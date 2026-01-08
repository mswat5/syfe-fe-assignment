import React from 'react';
import '../../styles/ui.css';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  accent?: boolean;
};

export const Card = ({ accent = false, className = '', children, ...rest }: CardProps) => {
  return (
    <div {...rest} className={[ 'card', accent ? 'card--accent' : '', className ].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
};

export default Card;
