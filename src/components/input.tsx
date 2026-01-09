import * as React from 'react';

import { cva } from 'class-variance-authority';
import { cn } from '../utils/utils';

export const inputVariants = cva(
	cn(
		'flex h-12 w-full rounded-lg border border-divider focus:border-divider bg-surface px-4 py-3 file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-neutral-muted disabled:cursor-not-allowed disabled:opacity-50 body-1 text-neutral',
		'transition-all duration-100 ease-in-out',
		'focus-visible:outline-neutral focus-visible:outline-offset-2 outline-offset-2 focus-visible:outline-2'
	)
);

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(inputVariants(), className)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = 'Input';

export { Input };
