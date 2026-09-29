import './Button.css';

/**
 * Button — universal button component.
 *
 * Props:
 *  variant  — 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 *  size     — 'sm' | 'md' | 'lg'
 *  loading  — bool (shows spinner)
 *  icon     — React node rendered before label
 *  fullWidth — bool
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon = null,
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : (
        icon && <span className="btn-icon">{icon}</span>
      )}
      {children && <span className="btn-label">{children}</span>}
    </button>
  );
};

export default Button;