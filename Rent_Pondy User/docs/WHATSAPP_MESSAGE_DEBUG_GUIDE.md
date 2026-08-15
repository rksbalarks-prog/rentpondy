# WhatsApp Message Trigger - Debugging Guide

## Changes Made

✅ **Removed HTML tags** from message (WhatsApp doesn't support HTML)
✅ **Added Payment Link** as plain text with URL
✅ **Fixed message template** to proper WhatsApp format
✅ **Enhanced logging** with unique console identifiers
✅ **Non-blocking call** with `.catch()` for error handling
✅ **Detailed console output** to track execution flow

## Testing Checklist

### 1. Check Console Logs During Submit

When you submit a property, you should see in the browser console:

```
🚀 Triggering WhatsApp notification...
✨✨✨ === PROPERTY SUBMISSION COMPLETE === ✨✨✨
📋 Function called successfully!
📋 Sending comprehensive property details...
📋 Current rentId: [YOUR_RENT_ID]
📋 Current phoneNumber: [YOUR_PHONE]
📋 Current formData keys: [list of keys]
```

### 2. Verify Phone Number Storage

Run this in browser console:
```javascript
console.log("Phone from localStorage:", localStorage.getItem("phoneNumber"));
```

Must return: `+91 XXXXXXXXXX` or `XXXXXXXXXX` (10 digits)

### 3. Check API Endpoint

The message sends to: `${process.env.REACT_APP_API_URL}/send-message`

Verify your `.env` has:
```env
REACT_APP_API_URL=http://localhost:3001
# OR
REACT_APP_API_URL=https://your-api-domain.com
```

### 4. Expected Console Output Sequence

```
[1] 🚀 Triggering WhatsApp notification...
[2] ✨✨✨ === PROPERTY SUBMISSION COMPLETE === ✨✨✨
[3] 📋 Function called successfully!
[4] 📋 StoredPhone from localStorage: 8610412173
[5] 📋 Clean phone after regex: 8610412173
[6] 📋 Added country code: 918610412173
[7] ✅ Valid phone number: 918610412173
[8] 📱 Message length: 1200 characters
[9] 📱 API URL: http://localhost:3001
[10] 📱 Sending to phone: 918610412173
[11] ✅✅✅ === COMPREHENSIVE PROPERTY DETAILS SENT === ✅✅✅
[12] ✅ Response status: 200
[13] ✅ Response data: { success: true, ... }
```

## Common Issues & Fixes

### Issue: "No phone number found in localStorage"

**Solution:**
```javascript
// In console, check and set:
localStorage.setItem("phoneNumber", "8610412173");
```

### Issue: "Invalid phone length"

**Reason:** Phone number not being cleaned properly

**Check in console:**
```javascript
let phone = localStorage.getItem("phoneNumber");
let clean = phone.replace(/\D/g, "");
console.log("Original:", phone);
console.log("Cleaned:", clean);
console.log("Length:", clean.length);
```

### Issue: API returns error

**Check:**
1. Is the `/send-message` endpoint running?
2. Is REACT_APP_API_URL correct?
3. Do you have WhatsApp API credentials configured?

Test the endpoint manually:
```bash
curl -X POST http://localhost:3001/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "918610412173",
    "message": "Test message"
  }'
```

### Issue: Message is being sent but with wrong format

**Solution:** Check that template variables are correct:
```javascript
console.log("formData.ownerName:", formData.ownerName);
console.log("formData.propertyType:", formData.propertyType);
console.log("rentId:", rentId);
```

All should have values, not undefined.

## Message Format Verification

The message should NOT contain:
- ❌ HTML tags like `<a>`, `<div>`, `<span>`
- ❌ CSS styling
- ❌ Multiple newlines

The message SHOULD contain:
- ✅ Plain text only
- ✅ Emojis
- ✅ Bold text using `*text*`
- ✅ Single newlines `\n`
- ✅ URLs as plain text

## Step-by-Step Debug Process

### Step 1: Add Property
1. Fill out form completely
2. Click Submit
3. Open Browser DevTools (F12)
4. Look for the console logs

### Step 2: Verify Logs
Check console shows:
- `🚀 Triggering WhatsApp notification...` ← Function called?
- `✨✨✨ === PROPERTY SUBMISSION COMPLETE ===` ← Inside function?
- Error logs? (⚠️ WhatsApp notification error)

### Step 3: Check Network
1. In DevTools, go to Network tab
2. Look for POST request to `/send-message`
3. Check:
   - Request payload (should have `to` and `message`)
   - Response status (should be 200)
   - Response body (success or error?)

### Step 4: Verify on Device
1. Check your phone for the WhatsApp message
2. Message should arrive within 10 seconds
3. Verify phone number is correct
4. Check message content

## Quick Test Command

In browser console after form submission:
```javascript
// Manually trigger the function
handlePropertySubmitted();
```

Watch for all console logs in sequence.

## If Message Still Not Sending

1. **Check API logs** - Does `/send-message` endpoint receive the request?
2. **Check WhatsApp API** - Is your WhatsApp API provider receiving messages?
3. **Check credentials** - Are API keys/tokens valid?
4. **Check phone number** - Is it registered with WhatsApp Business Account?
5. **Check rate limits** - Are you exceeding message limits?

## Successful Message Example

```
🎉 *YOUR PROPERTY ADDED SUCCESSFULLY!*

*Status:* ✅ Pre-Approved
*Rent ID:* 🆔 1842

*OWNER INFO*
📛 Name: John Doe
📱 Phone: 8610412173
✉️ Email: john@example.com

[... property details ...]

*PAYMENT LINK*
💳 *PAY NOW* for Instant Activation
https://u.payu.in/PAYUMN/Krxi1bgDHM45

Thank you for Rent Pondy! 🙏
```

## Code Changes Summary

### Before:
- HTML button tag in message
- Single setTimeout delay
- Basic logging

### After:
- Plain text payment link
- Non-blocking async/await with catch
- Enhanced console logging with unique identifiers
- Proper error handling
- Payload logging for debugging

## Next Steps

1. Test the submission with the updated code
2. Check console for all expected logs
3. Verify WhatsApp message arrives on your phone
4. If still not working, share the error logs from:
   - Browser console
   - Backend logs
   - WhatsApp API response

---
Last updated: January 29, 2026
