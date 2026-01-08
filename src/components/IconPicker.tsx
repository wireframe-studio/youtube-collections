import React, { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { Search } from 'lucide-react';

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}

// Get all icon names from lucide-react
const iconNames = Object.keys(Icons).filter(
  key => key !== 'default' && typeof (Icons as any)[key] === 'function'
);

export function IconPicker({ selectedIcon, onSelect }: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = useMemo(() => {
    if (!searchQuery) return iconNames.slice(0, 100); // Show first 100 by default
    return iconNames
      .filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 100);
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Search icons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto p-2">
        {filteredIcons.map(iconName => {
          const IconComponent = (Icons as any)[iconName];
          const isSelected = iconName === selectedIcon;

          return (
            <button
              key={iconName}
              onClick={() => onSelect(iconName)}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                ${isSelected
                  ? 'bg-white/20 ring-2 ring-white/40'
                  : 'bg-white/5 hover:bg-white/10'
                }
              `}
              title={iconName}
            >
              <IconComponent className="w-5 h-5 text-white" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
