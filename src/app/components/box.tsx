"use client";

import React from "react";
import classNames from "classnames";
import styles from "./box.module.css";

interface BoxProps {
	/**
	 * Current active phase (1-4)
	 */
	step: number;

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

	playing?: boolean
}

/**
 * Box component for breathing exercise visualization
 */
export function Box({ step, children, className, playing }: BoxProps) {
	return (
		<div className={classNames(styles.box, className)}>
			<div className={styles.boxContent}>{children}</div>
			<div
				className={classNames(styles.ball, {
					[styles.traverse]: step === 1,
					[styles.descend]: step === 2,
					[styles.retreat]: step === 3,
					[styles.ascend]: step === 4,
					[styles.paused]: !playing,
				})}
			/>
		</div>
	);
}

export default Box;
