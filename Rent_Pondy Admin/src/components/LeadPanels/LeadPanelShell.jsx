// The drawer chrome every lead panel shares: header, optional control strip,
// a scrolling body and a footer stamp.
//
// Kept separate from any one panel's content so a second panel is a component
// and a rail entry rather than another copy of this markup — which is what
// went wrong in the source, where five panels each carried their own shell and
// the tabs had to be measured and stacked in JavaScript to stop them colliding.

import React from 'react';

const LeadPanelShell = ({
  title,
  subtitle,
  open,
  onClose,
  controls,
  footer,
  children,
}) => (
  <aside
    className={`lp-panel${open ? ' lp-panel-open' : ''}`}
    aria-hidden={!open}
    aria-label={title}
  >
    <div className="lp-head">
      <button type="button" className="lp-x" onClick={onClose} aria-label="Close panel">
        &times;
      </button>
      <h4>{title}</h4>
      {subtitle ? <div className="lp-sub">{subtitle}</div> : null}
    </div>

    {controls ? <div className="lp-ctl">{controls}</div> : null}

    <div className="lp-list">{children}</div>

    {footer ? <div className="lp-foot">{footer}</div> : null}
  </aside>
);

export default LeadPanelShell;
