'use client';

import {
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useState
} from 'react';

import { Button } from '@/components/button';
import { cn } from '@/lib/shadcn/utils';
import { ChevronDownIcon } from 'lucide-react';

const selectContext = createContext<{
	onChange: (value: string) => void;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	value: string;
	setValue: Dispatch<SetStateAction<string>>;
	displayValue: string;
	setDisplayValue: Dispatch<SetStateAction<string>>;
}>({
	onChange: () => {},
	open: false,
	setOpen: () => {},
	value: '',
	setValue: () => {},
	displayValue: '',
	setDisplayValue: () => {}
});

const Select: FC<{
	defaultValue: string;
	onChange: (value: string) => void;
	children: ReactNode;
}> = ({ defaultValue, onChange, children }) => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<string>(defaultValue);
	const [displayValue, setDisplayValue] = useState<string>(
		defaultValue ?? null
	);

	return (
		<view className="relative">
			<selectContext.Provider
				value={{
					onChange,
					open,
					setOpen,
					value,
					setValue,
					displayValue,
					setDisplayValue
				}}>
				{children}
			</selectContext.Provider>
		</view>
	);
};

const SelectTrigger: FC<{ children: ReactNode; className?: string }> = ({
	children,
	className
}) => {
	const { open, setOpen } = useContext(selectContext);

	return (
		<Button
			variant={'outline'}
			className={cn('button-md', className)}
			onClick={() => setOpen(!open)}
			onBlur={() => setOpen(false)}>
			{children}
			<ChevronDownIcon
				className="size-4 transition-transform duration-200"
				style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
			/>
		</Button>
	);
};

const SelectValue: FC<{ placeholder: string }> = ({ placeholder }) => {
	const { value, displayValue } = useContext(selectContext);
	return <>{value ? displayValue : placeholder}</>;
};

const SelectContent: FC<{ children: ReactNode; className?: string }> = ({
	children,
	className
}) => {
	const { open } = useContext(selectContext);

	return (
		<view
			style={{
				display: open ? 'block' : 'none',
				zIndex: 10000,
				minWidth: '200px',
				top: 'calc(100% + 8px)'
			}}
			className={cn(
				'absolute right-0 bg-foreground backdrop-blur-2xl border border-divider rounded-xl shadow-lg',
				'flex flex-col py-3',
				className
			)}>
			{children}
		</view>
	);
};

const SelectItem: FC<{
	value: string;
	children: string;
	className?: string;
}> = ({ value, children: displayValue, className }) => {
	const {
		setValue,
		value: selectedValue,
		setDisplayValue,
		setOpen
	} = useContext(selectContext);

	const isSelected =
		(value === null && selectedValue === null) || value === selectedValue;

	const handleClick = () => {
		setValue(value);
		setOpen(false);
		setDisplayValue(displayValue);
	};

	useEffect(() => {
		if (isSelected) {
			setDisplayValue(displayValue);
		}
	}, [isSelected]);

	return (
		<Button
			variant={isSelected ? 'solid-weak' : 'ghost'}
			className="justify-start w-full rounded-lg"
			onClick={handleClick}>
			{displayValue}
		</Button>
	);
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
