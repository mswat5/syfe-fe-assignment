import React from 'react';
import '../../styles/ui.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export const Button = ({ variant = 'primary', className = '', children, ...rest }: ButtonProps) => {
  const variantClass = variant === 'primary' ? 'btn--primary' : 'btn--secondary';
  return (
    <button {...rest} className={[ 'btn', variantClass, className ].filter(Boolean).join(' ')}>
      {children}
    </button>
  );
};

export default Button;
