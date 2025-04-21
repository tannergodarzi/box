"use client";

import React from 'react';
import classNames from 'classnames';
import styles from './box.module.css';

interface BoxProps {
  /**
   * Current active phase (1-4)
   */
  phase: number;
  
  /**
   * Whether this box is in the active state
   */
  active?: boolean;
  
  /**
   * Optional custom content to display inside the box
   */
  children?: React.ReactNode;
  
  /**
   * Optional additional class names
   */
  className?: string;
  
  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * Box component for breathing exercise visualization
 */
export function Box({
  phase,
  active = false,
  children,
  className,
  onClick
}: BoxProps) {
  return (
    <div 
      className={classNames(
        styles.box,
        { [styles.active]: active },
        className
      )}
      onClick={onClick}
    >
      <div className={styles.phase}>{phase}</div>
      <div className={styles.content}>
        {children || `Phase ${phase}`}
      </div>
    </div>
  );
}

export default Box;