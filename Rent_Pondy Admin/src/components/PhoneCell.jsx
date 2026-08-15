import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFollowups } from '../contexts/FollowupContext';

/*
 * <PhoneCell />
 * --------------
 * Renders a phone number with a colour cue based on follow-up state:
 *   - Red underline   → no follow-up exists for this phone (action needed)
 *   - Green underline → follow-up has been created
 *
 * Double-clicking the number navigates to the matching create-followup page:
 *   - type="owner"  → /dashboard/create-followup        with state { rentId, phoneNumber }
 *   - type="tenant" → /dashboard/create-followup-buyer  with state { Ra_Id, phoneNumber }
 *
 * Drop-in usage: replace `{item.phoneNumber}` (or wrap an existing <td>) with
 *   <PhoneCell phone={item.phoneNumber} type="owner"  rentId={item.rentId} />
 *   <PhoneCell phone={item.phoneNumber} type="tenant" raId={item.Ra_Id}  />
 *
 * Pass `onDoubleClick` to override the default navigation — e.g. the Login
 * (OTP) Report opens a quick create-follow-up modal in place instead of
 * routing to a create page. When provided, the built-in navigation is skipped.
 */
const PhoneCell = ({
  phone,
  type,                 // "owner" | "tenant" | "any" (any = green if a follow-up exists in any bucket)
  rentId,
  raId,
  Ra_Id,                // accepted as alias to match existing prop names
  display,              // optional override for what to render (defaults to phone)
  className = '',
  style = {},
  title,
  onDoubleClick,        // optional: (phone) => void — overrides default navigation
}) => {
  const navigate = useNavigate();
  const { hasFollowup, loaded } = useFollowups();

  const finalRaId = raId || Ra_Id;
  const inferredType = type || (finalRaId ? 'tenant' : 'owner');
  const exists = hasFollowup(phone, inferredType);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    if (!phone) return;
    if (onDoubleClick) {
      onDoubleClick(phone);
      return;
    }
    if (inferredType === 'tenant') {
      navigate('/dashboard/create-followup-buyer', {
        state: { Ra_Id: finalRaId, phoneNumber: phone },
      });
    } else {
      navigate('/dashboard/create-followup', {
        state: { rentId, phoneNumber: phone },
      });
    }
  }, [navigate, inferredType, phone, rentId, finalRaId, onDoubleClick]);

  // Loading state: render plain text (avoid flashing red while we fetch).
  // data-clarity-mask keeps customer numbers out of Microsoft Clarity replays
  // regardless of the masking mode set in the Clarity dashboard.
  if (!loaded) {
    return <span data-clarity-mask="true" className={className} style={style}>{display ?? phone ?? '—'}</span>;
  }

  if (!phone) {
    return <span data-clarity-mask="true" className={className} style={style}>{display ?? '—'}</span>;
  }

  const colour = exists ? '#16a34a' : '#dc2626'; // green-600 / red-600
  return (
    <span
      data-clarity-mask="true"
      role="button"
      tabIndex={0}
      onDoubleClick={handleDoubleClick}
      title={
        title ??
        (exists
          ? 'Follow-up already created — double-click to add another'
          : 'No follow-up yet — double-click to create one')
      }
      className={className}
      style={{
        color: colour,
        textDecoration: 'underline',
        textDecorationColor: colour,
        textUnderlineOffset: '3px',
        textDecorationThickness: '2px',
        cursor: 'pointer',
        fontWeight: 600,
        userSelect: 'text',
        ...style,
      }}
    >
      {display ?? phone}
    </span>
  );
};

export default PhoneCell;
