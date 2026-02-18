const Card = ({
  children,
  className = '',
  shadow = 'md',
  hover = false,
  ...props
}) => {
  const shadowStyles = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    none: 'shadow-none',
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700
        ${shadowStyles[shadow]}
        ${hover ? 'hover:shadow-xl dark:hover:shadow-2xl transition-all duration-200 hover:scale-[1.02]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
