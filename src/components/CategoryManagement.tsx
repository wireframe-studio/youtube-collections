import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { IconPicker } from './IconPicker';
import { CATEGORY_COLORS, type Category } from '../types';
import { addCategory, deleteCategory, updateCategory } from '../storage';

interface CategoryManagementProps {
  categories: Category[];
  onUpdate: () => void;
}

export function CategoryManagement({ categories, onUpdate }: CategoryManagementProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('Circle');
  const [newColor, setNewColor] = useState(CATEGORY_COLORS[0]);

  async function handleCreate() {
    if (!newName.trim()) return;

    const category: Category = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      icon: newIcon,
      color: newColor,
    };

    await addCategory(category);
    setIsCreating(false);
    setNewName('');
    setNewIcon('Circle');
    setNewColor(CATEGORY_COLORS[0]);
    onUpdate();
  }

  async function handleDelete(categoryId: string) {
    if (confirm('Delete this category? Channels will be unassigned from it.')) {
      await deleteCategory(categoryId);
      onUpdate();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Your Categories</h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      {isCreating && (
        <div className="bg-white/5 rounded-lg p-4 space-y-4 border border-white/10">
          <input
            type="text"
            placeholder="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            autoFocus
          />

          <div>
            <label className="block text-sm text-white/70 mb-2">Icon</label>
            <IconPicker selectedIcon={newIcon} onSelect={setNewIcon} />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORY_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setNewColor(color)}
                  className={`
                    w-8 h-8 rounded-full transition-transform
                    ${color === newColor ? 'ring-2 ring-white/40 scale-110' : 'hover:scale-105'}
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {categories.map(category => {
          const IconComponent = (Icons as any)[category.icon] || Icons.Circle;

          return (
            <div
              key={category.id}
              className="bg-white/5 rounded-lg p-3 flex items-center gap-3 border border-white/10"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: category.color }}
              >
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <span className="text-white flex-1">{category.name}</span>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {categories.length === 0 && !isCreating && (
          <div className="text-center py-8 text-white/40">
            No categories yet. Create your first one!
          </div>
        )}
      </div>
    </div>
  );
}
