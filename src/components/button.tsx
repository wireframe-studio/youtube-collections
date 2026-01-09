import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../utils/utils';

const buttonVariants = cva(
	'flex flex-row items-center justify-center gap-2 cursor-pointer',
	{
		variants: {
			variant: {
				solid: '',
				'solid-weak':
					'bg-[var(--yt-spec-outline)] text-[var(--yt-spec-text-primary)] hover:bg-[var(--yt-spec-additive-background)] [&>svg]:text-[var(--yt-spec-text-primary)]',
				ghost:
					'bg-transparent text-[var(--yt-spec-text-primary)] hover:bg-[var(--yt-spec-additive-background)] [&>svg]:text-[var(--yt-spec-text-primary)]',
				outline:
					'bg-transparent text-[var(--yt-spec-text-primary)] hover:bg-[var(--yt-spec-additive-background)] [&>svg]:text-[var(--yt-spec-text-primary)] border border-[var(--yt-spec-outline)]'
			},
			size: {
				sm: '',
				md: 'px-[16px] h-[36px] rounded-full text-[14px] leading-[36px] font-[400] [&>svg]:size-[16px]!',
				lg: '',
				xs: '',
				tab: 'px-[16px] h-[40px] rounded-[10px] text-[1.4rem] leading-[2rem] font-[400]',
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
