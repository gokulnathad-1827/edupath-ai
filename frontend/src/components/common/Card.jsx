import './Card.css';

/**
 * Card — flexible container component.
 *
 * Props:
 *  title       — Card heading
 *  subtitle    — Secondary text under heading
 *  icon        — React node for header icon
 *  value       — Large metric value
 *  badge       — Badge text
 *  badgeType   — 'primary' | 'success' | 'danger' | 'warning'
 *  footer      — React node placed at bottom
 *  hoverable   — enable hover lift effect
 *  gradient    — CSS gradient string for icon background
 *  className   — extra class names
 */
const Card = ({
  children,
  title,
  subtitle,
  icon,
  value,
  badge,
  badgeType = 'primary',
  footer,
  hoverable = false,
  gradient,
  className = '',
  style,
}) => {
  const classes = ['card', hoverable ? 'card-hoverable' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style}>
      {(icon || title || badge) && (
        <div className="card-header">
          <div className="card-header-left">
            {icon && (
              <div
                className="card-icon"
                style={gradient ? { background: gradient } : undefined}
              >
                {icon}
              </div>
            )}
            <div className="card-titles">
              {title && <h4 className="card-title">{title}</h4>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {badge && (
            <span className={`badge badge-${badgeType}`}>{badge}</span>
          )}
        </div>
      )}

      {value !== undefined && (
        <div className="card-value">{value}</div>
      )}

      {children && <div className="card-body">{children}</div>}

      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;