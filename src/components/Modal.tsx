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
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]"
      onClick={onClose}
    >
      <div
        className="bg-[#212121] rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">YouTube Collections</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-white/10">
          <button
            onClick={() => setActiveTab('categories')}
            className={`
              px-4 py-2 rounded-t-lg font-medium transition-colors
              ${activeTab === 'categories'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white/80'
              }
            `}
          >
            Your Categories
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`
              px-4 py-2 rounded-t-lg font-medium transition-colors
              ${activeTab === 'channels'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white/80'
              }
            `}
          >
            Channels by Category
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
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
