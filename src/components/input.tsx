import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/utils';

export const inputVariants = cva(
	cn(
		'flex h-12 w-full rounded-lg border px-[16px] file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-neutral-muted disabled:cursor-not-allowed disabled:opacity-50 body-1 text-neutral',
		'transition-all duration-100 ease-in-out',
		'focus-visible:outline-neutral focus-visible:outline-offset-2 outline-offset-2 focus-visible:outline-2'
	),
	{
		variants: {
			variant: {
				default: 'border-divider focus:border-divider bg-surface',
				outline:
					'bg-transparent border-divider hover:bg-surface-hover focus:bg-surface-hover focus:border-divider rounded-full h-[40px]'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
);

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, variant, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(inputVariants({ variant }), className)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = 'Input';

export { Input };
