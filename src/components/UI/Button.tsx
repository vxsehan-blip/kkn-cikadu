import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  disableScrollToTop?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  disableScrollToTop = false,
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-emerald-500 border border-transparent',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 border border-transparent',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white focus:ring-emerald-500 bg-white dark:bg-gray-800 dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white',
    ghost: 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20 focus:ring-emerald-500 border border-transparent bg-transparent',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      data-scroll-to-top={disableScrollToTop ? 'false' : 'true'}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} flex items-center justify-center space-x-2`}
    >
      {Icon && iconPosition === 'left' && <Icon className="h-5 w-5" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="h-5 w-5" />}
    </motion.button>
  );
};

export default Button;