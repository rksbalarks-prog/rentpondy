import axios from 'axios';

/**
 * WhatsApp Message Queue Service
 *
 * Instead of sending messages immediately (which triggers WhatsApp spam detection),
 * this service queues messages and sends them one-by-one with random delays.
 *
 * Priority levels:
 *   - "immediate" → sent right away (OTP only)
 *   - "high"      → sent within 30-60s
 *   - "normal"    → sent within 60-120s (default)
 *   - "low"       → sent within 120-180s (welcome, promotional)
 */

const STORAGE_KEY = 'whatsapp_message_queue';
const SENT_LOG_KEY = 'whatsapp_sent_log';
const MAX_MESSAGES_PER_HOUR = 30; // Safety cap
const MAX_MESSAGES_PER_NUMBER_PER_HOUR = 3; // Per-recipient cap
const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes - ignore duplicate messages

// Random delay ranges per priority (in milliseconds)
const DELAY_RANGES = {
  immediate: { min: 0, max: 0 },
  high: { min: 30000, max: 60000 },       // 30-60 seconds
  normal: { min: 60000, max: 120000 },     // 1-2 minutes
  low: { min: 120000, max: 180000 },       // 2-3 minutes
};

let isProcessing = false;
let processTimer = null;

// ─── Queue Storage Helpers ────────────────────────────────────

const getQueue = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveQueue = (queue) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save WhatsApp queue:', e.message);
  }
};

const getSentLog = () => {
  try {
    const data = localStorage.getItem(SENT_LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveSentLog = (log) => {
  try {
    // Only keep last 1 hour of logs
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const trimmed = log.filter(entry => entry.timestamp > oneHourAgo);
    localStorage.setItem(SENT_LOG_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save sent log:', e.message);
  }
};

// ─── Rate Limiting ────────────────────────────────────────────

const canSendMessage = (to) => {
  const sentLog = getSentLog();
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const recentSends = sentLog.filter(entry => entry.timestamp > oneHourAgo);

  // Global hourly limit
  if (recentSends.length >= MAX_MESSAGES_PER_HOUR) {
    console.warn(`⚠️ WhatsApp queue: Global hourly limit reached (${MAX_MESSAGES_PER_HOUR})`);
    return false;
  }

  // Per-number hourly limit
  const sendsToNumber = recentSends.filter(entry => entry.to === to);
  if (sendsToNumber.length >= MAX_MESSAGES_PER_NUMBER_PER_HOUR) {
    console.warn(`⚠️ WhatsApp queue: Per-number limit reached for ${to} (${MAX_MESSAGES_PER_NUMBER_PER_HOUR}/hr)`);
    return false;
  }

  return true;
};

// ─── Deduplication ────────────────────────────────────────────

const isDuplicate = (to, message) => {
  const sentLog = getSentLog();
  const cutoff = Date.now() - DEDUP_WINDOW_MS;

  return sentLog.some(entry =>
    entry.to === to &&
    entry.messageHash === hashMessage(message) &&
    entry.timestamp > cutoff
  );
};

const hashMessage = (message) => {
  // Simple hash for dedup — not cryptographic, just for comparison
  let hash = 0;
  const str = message.substring(0, 100); // First 100 chars is enough for dedup
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit int
  }
  return hash.toString();
};

// ─── Random Delay Generator ───────────────────────────────────

const getRandomDelay = (priority) => {
  const range = DELAY_RANGES[priority] || DELAY_RANGES.normal;
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

// ─── Core Queue Methods ───────────────────────────────────────

/**
 * Add a message to the queue
 * @param {string} to - Recipient phone number
 * @param {string} message - Message text
 * @param {string} priority - "immediate" | "high" | "normal" | "low"
 * @param {string} category - Category label for logging (e.g., "otp", "welcome", "interest")
 * @returns {object} - { queued: boolean, position: number, estimatedDelay: string }
 */
export const enqueueMessage = (to, message, priority = 'normal', category = 'general') => {
  // Immediate priority bypasses queue entirely
  if (priority === 'immediate') {
    sendMessageDirect(to, message, category);
    return { queued: false, position: 0, estimatedDelay: '0s (immediate)' };
  }

  // Check for duplicate
  if (isDuplicate(to, message)) {
    console.log(`🔄 WhatsApp queue: Duplicate message to ${to} skipped (category: ${category})`);
    return { queued: false, position: -1, estimatedDelay: 'skipped (duplicate)' };
  }

  const queue = getQueue();

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    to,
    message,
    priority,
    category,
    addedAt: Date.now(),
    retries: 0,
  };

  // Insert by priority (high priority messages go to front)
  const priorityOrder = { high: 0, normal: 1, low: 2 };
  const entryOrder = priorityOrder[priority] ?? 1;

  let insertIndex = queue.length;
  for (let i = 0; i < queue.length; i++) {
    const existingOrder = priorityOrder[queue[i].priority] ?? 1;
    if (entryOrder < existingOrder) {
      insertIndex = i;
      break;
    }
  }

  queue.splice(insertIndex, 0, entry);
  saveQueue(queue);

  console.log(`📥 WhatsApp queue: Added [${category}] to ${to} (priority: ${priority}, position: ${insertIndex + 1}/${queue.length})`);

  // Start processing if not already running
  startProcessing();

  return {
    queued: true,
    position: insertIndex + 1,
    estimatedDelay: `~${Math.round(getRandomDelay(priority) / 1000)}s`,
  };
};

/**
 * Add a group message to the queue
 * @param {string} groupId - WhatsApp group ID
 * @param {string} message - Message text
 * @param {string} priority - Priority level
 * @param {string} category - Category label
 */
export const enqueueGroupMessage = (groupId, message, priority = 'low', category = 'group') => {
  const queue = getQueue();

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    groupId,
    message,
    priority,
    category,
    isGroup: true,
    addedAt: Date.now(),
    retries: 0,
  };

  queue.push(entry); // Group messages always go to end
  saveQueue(queue);

  console.log(`📥 WhatsApp queue: Added group message [${category}] (position: ${queue.length})`);
  startProcessing();
};

// ─── Queue Processing ─────────────────────────────────────────

const startProcessing = () => {
  if (isProcessing) return;
  processNext();
};

const processNext = () => {
  const queue = getQueue();

  if (queue.length === 0) {
    isProcessing = false;
    console.log('✅ WhatsApp queue: Empty — processing stopped');
    return;
  }

  isProcessing = true;
  const nextEntry = queue[0];
  const delay = getRandomDelay(nextEntry.priority);

  console.log(`⏳ WhatsApp queue: Next message [${nextEntry.category}] to ${nextEntry.to || nextEntry.groupId} in ${Math.round(delay / 1000)}s (${queue.length} remaining)`);

  processTimer = setTimeout(async () => {
    const currentQueue = getQueue();

    if (currentQueue.length === 0) {
      isProcessing = false;
      return;
    }

    const entry = currentQueue.shift();
    saveQueue(currentQueue);

    try {
      if (entry.isGroup) {
        await sendGroupMessageDirect(entry.groupId, entry.message, entry.category);
      } else {
        // Check rate limit before sending
        if (!canSendMessage(entry.to)) {
          console.warn(`⏸️ WhatsApp queue: Rate limited — re-queuing [${entry.category}] to ${entry.to}`);
          entry.retries = (entry.retries || 0) + 1;
          if (entry.retries < 3) {
            currentQueue.push(entry); // Push to end
            saveQueue(currentQueue);
          } else {
            console.warn(`❌ WhatsApp queue: Dropped [${entry.category}] to ${entry.to} after 3 retries`);
          }
        } else {
          await sendMessageDirect(entry.to, entry.message, entry.category);
        }
      }
    } catch (err) {
      console.error(`❌ WhatsApp queue: Failed [${entry.category}]:`, err.message);
    }

    // Process next
    processNext();
  }, delay);
};

// ─── Direct Send (used by queue processor) ────────────────────

const sendMessageDirect = async (to, message, category) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-message`, {
      to,
      message,
    });

    // Log successful send
    const sentLog = getSentLog();
    sentLog.push({
      to,
      category,
      messageHash: hashMessage(message),
      timestamp: Date.now(),
    });
    saveSentLog(sentLog);

    console.log(`✅ WhatsApp sent [${category}] to ${to}`);
    return response.data;
  } catch (err) {
    console.error(`❌ WhatsApp send failed [${category}] to ${to}:`, err.message);
    throw err;
  }
};

const sendGroupMessageDirect = async (groupId, message, category) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/group-list`, {
      groupid: groupId,
      message,
    });

    console.log(`✅ WhatsApp group sent [${category}]`);
    return response.data;
  } catch (err) {
    console.error(`❌ WhatsApp group send failed [${category}]:`, err.message);
    throw err;
  }
};

// ─── Queue Management ─────────────────────────────────────────

/** Get current queue status */
export const getQueueStatus = () => {
  const queue = getQueue();
  const sentLog = getSentLog();
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const recentSends = sentLog.filter(e => e.timestamp > oneHourAgo);

  return {
    pending: queue.length,
    sentLastHour: recentSends.length,
    isProcessing,
    hourlyLimitRemaining: MAX_MESSAGES_PER_HOUR - recentSends.length,
    queue: queue.map(e => ({
      to: e.to || e.groupId,
      category: e.category,
      priority: e.priority,
      waitingFor: `${Math.round((Date.now() - e.addedAt) / 1000)}s`,
    })),
  };
};

/** Clear the entire queue */
export const clearQueue = () => {
  if (processTimer) clearTimeout(processTimer);
  isProcessing = false;
  saveQueue([]);
  console.log('🗑️ WhatsApp queue: Cleared');
};

/** Remove messages for a specific number */
export const removeFromQueue = (phoneNumber) => {
  const queue = getQueue();
  const filtered = queue.filter(e => e.to !== phoneNumber);
  saveQueue(filtered);
  console.log(`🗑️ WhatsApp queue: Removed messages for ${phoneNumber}`);
};

// ─── Convenience Methods (drop-in replacements) ──────────────

/** OTP messages — sent immediately, no queue */
export const sendOtpMessage = (to, message) => {
  return enqueueMessage(to, message, 'immediate', 'otp');
};

/** Welcome/login messages — low priority, queued */
export const sendWelcomeMessage = (to, message) => {
  return enqueueMessage(to, message, 'low', 'welcome');
};

/** Login failure alert — high priority but still queued */
export const sendFailureMessage = (to, message) => {
  return enqueueMessage(to, message, 'high', 'login-failure');
};

/** Interest notification — normal priority */
export const sendInterestMessage = (to, message) => {
  return enqueueMessage(to, message, 'normal', 'interest');
};

/** Offer notification — normal priority */
export const sendOfferMessage = (to, message) => {
  return enqueueMessage(to, message, 'normal', 'offer');
};

/** Contact/address/call notification — normal priority */
export const sendContactNotification = (to, message) => {
  return enqueueMessage(to, message, 'normal', 'contact');
};

/** Report notification — high priority */
export const sendReportMessage = (to, message) => {
  return enqueueMessage(to, message, 'high', 'report');
};

/** Share notification — low priority */
export const sendShareMessage = (to, message) => {
  return enqueueMessage(to, message, 'low', 'share');
};

/** Photo request — normal priority */
export const sendPhotoRequestMessage = (to, message) => {
  return enqueueMessage(to, message, 'normal', 'photo-request');
};

/** Favorite notification — low priority */
export const sendFavoriteMessage = (to, message) => {
  return enqueueMessage(to, message, 'low', 'favorite');
};

/** Need help — high priority (to admin) */
export const sendNeedHelpMessage = (to, message) => {
  return enqueueMessage(to, message, 'high', 'need-help');
};

/** Group messages — always low priority */
export const sendGroupMessage = (groupId, message) => {
  return enqueueGroupMessage(groupId, message, 'low', 'group');
};

export default {
  enqueueMessage,
  enqueueGroupMessage,
  getQueueStatus,
  clearQueue,
  removeFromQueue,
  sendOtpMessage,
  sendWelcomeMessage,
  sendFailureMessage,
  sendInterestMessage,
  sendOfferMessage,
  sendContactNotification,
  sendReportMessage,
  sendShareMessage,
  sendPhotoRequestMessage,
  sendFavoriteMessage,
  sendNeedHelpMessage,
  sendGroupMessage,
};
