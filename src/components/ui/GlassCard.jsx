import React from "react";

export default function GlassCard({ 
  children, 
  className = "", 
  title, 
  action, 
  noPadding = false,
  subpanel = false 
}) {
  // If title/action is present, card-head provides its own padding.
  // Children get p-5 only when there's a title (content section below header).
  // If no title, className controls all padding directly on the outer div.
  const hasHeader = title || action;

  return (
    <div className={`${subpanel ? "glass-subpanel" : "glass-panel"} ${className}`}>
      {hasHeader && (
        <div className={`card-head ${noPadding ? "p-[var(--space-md)_var(--space-md)_0_var(--space-md)]" : ""}`}>
          {title && <h2>{title}</h2>}
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      {hasHeader ? (
        <div className={noPadding ? "p-0" : "p-5"}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
