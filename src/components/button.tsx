import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../utils/utils';

const buttonVariants = cva(
	'flex flex-row items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
	{
		variants: {
			variant: {
				solid:
					'bg-neutral text-neutral-contrast hover:bg-surface-hover active:bg-surface-active hover:text-neutral',
				'solid-weak':
					'bg-surface text-neutral hover:bg-surface-hover active:bg-surface-active [&>svg]:text-[var(--yt-spec-text-primary)]',
				ghost:
					'bg-transparent text-neutral hover:bg-surface-hover active:bg-surface-active [&>svg]:text-neutral',
				outline:
					'bg-transparent text-neutral hover:bg-surface-hover active:bg-surface-active [&>svg]:text-neutral border border-divider'
			},
			size: {
				sm: '',
				md: 'px-[16px] h-[36px] rounded-full button-md [&>svg]:size-[16px]!',
				lg: '',
				xs: '',
				tab: 'px-[16px] h-[40px] rounded-[10px] button-md',
				icon: 'w-[36px] h-[36px] rounded-full transition-all items-center [&>svg]:size-[16px]!'
			}
		}
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'solid', size = 'md', ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
