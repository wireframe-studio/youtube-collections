import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getIconComponent } from '../iconRegistry';
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Your Categories</h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-white flex items-center gap-2 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      {isCreating && (
        <div className="bg-white/5 rounded-xl p-6 space-y-5 border border-white/10">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Category Name</label>
            <input
              type="text"
              placeholder="e.g., Science, Gaming, Music"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">Choose an Icon</label>
            <IconPicker selectedIcon={newIcon} onSelect={setNewIcon} />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">Pick a Color</label>
            <div className="flex gap-2.5 flex-wrap">
              {CATEGORY_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setNewColor(color)}
                  className={`
                    w-10 h-10 rounded-full transition-all
                    ${color === newColor ? 'ring-3 ring-white/50 scale-110 shadow-lg' : 'hover:scale-105 hover:ring-2 hover:ring-white/20'}
                  `}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="px-6 py-2.5 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Category
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {categories.map(category => {
          const IconComponent = getIconComponent(category.icon);

          return (
            <div
              key={category.id}
              className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/10 hover:bg-white/[0.07] transition-colors"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                style={{ backgroundColor: category.color }}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <span className="text-white flex-1 font-medium">{category.name}</span>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-2.5 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                aria-label={`Delete ${category.name}`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })}

        {categories.length === 0 && !isCreating && (
          <div className="text-center py-12 text-white/40">
            <div className="text-lg mb-2">No categories yet</div>
            <div className="text-sm">Create your first category to get started!</div>
          </div>
        )}
      </div>
    </div>
  );
}
