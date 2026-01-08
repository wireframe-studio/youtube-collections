import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ICON_LIST } from '../iconRegistry';

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}

export function IconPicker({ selectedIcon, onSelect }: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = useMemo(() => {
    if (!searchQuery) return ICON_LIST;
    return ICON_LIST.filter(icon =>
      icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Search icons (e.g., star, heart, video)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
        <div className="grid grid-cols-8 gap-2 max-h-72 overflow-y-auto">
          {filteredIcons.map(icon => {
            const IconComponent = icon.component;
            const isSelected = icon.name === selectedIcon;

            return (
              <button
                key={icon.name}
                onClick={() => onSelect(icon.name)}
                className={`
                  w-11 h-11 rounded-lg flex items-center justify-center transition-all
                  ${isSelected
                    ? 'bg-white/25 ring-2 ring-white/50 scale-105 shadow-lg'
                    : 'bg-white/5 hover:bg-white/15 hover:scale-105'
                  }
                `}
                title={icon.name}
                aria-label={`Select ${icon.name} icon`}
              >
                <IconComponent className="w-5 h-5 text-white" />
              </button>
            );
          })}
        </div>
        {filteredIcons.length === 0 && (
          <div className="text-center py-8 text-white/40 text-sm">
            No icons found for "{searchQuery}"
          </div>
        )}
      </div>

      <div className="text-xs text-white/40 text-center">
        Showing {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
