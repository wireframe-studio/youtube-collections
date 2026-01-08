import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CategoryManagement } from './CategoryManagement';
import { ChannelAssignment } from './ChannelAssignment';
import { getStorageData } from '../storage';
import type { Category, Channel } from '../types';

interface ModalProps {
  onClose: () => void;
}

type Tab = 'categories' | 'channels';

export function Modal({ onClose }: ModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await getStorageData();
    setCategories(data.categories);
    setChannels(data.channels);
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#282828] rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-white/10 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          <h2 className="text-3xl font-bold text-white">YouTube Collections</h2>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-colors group"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-8 pt-6 pb-2">
          <button
            onClick={() => setActiveTab('categories')}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all text-sm
              ${activeTab === 'categories'
                ? 'bg-white/15 text-white shadow-lg'
                : 'text-white/60 hover:text-white/90 hover:bg-white/5'
              }
            `}
          >
            Your Categories
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all text-sm
              ${activeTab === 'channels'
                ? 'bg-white/15 text-white shadow-lg'
                : 'text-white/60 hover:text-white/90 hover:bg-white/5'
              }
            `}
          >
            Channels by Category
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0">
          {activeTab === 'categories' && (
            <CategoryManagement categories={categories} onUpdate={loadData} />
          )}
          {activeTab === 'channels' && (
            <ChannelAssignment
              categories={categories}
              channels={channels}
              onUpdate={loadData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
