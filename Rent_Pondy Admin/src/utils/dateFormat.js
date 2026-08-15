/*
 * Shared date / date-time formatters.
 *
 * Returns an em-dash for invalid / missing values so callers don't need to
 * guard them. Format matches what most pages already render manually:
 *
 *   formatDateTime("2026-05-06T15:45:00Z") → "06-05-2026 03:45 PM"
 *   formatDate    ("2026-05-06T15:45:00Z") → "06-05-2026"
 */
const pad2 = (n) => String(n).padStart(2, '0');

export const formatDate = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return '—';
  return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;
};

export const formatDateTime = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return '—';
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${dd}-${mm}-${yyyy} ${pad2(h)}:${pad2(d.getMinutes())} ${ampm}`;
};
