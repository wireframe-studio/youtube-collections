export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Channel {
  id: string;
  name: string;
  thumbnailUrl: string;
  categoryIds: string[];
}

export interface StorageData {
  categories: Category[];
  channels: Channel[];
  activeFilters: string[]; // category IDs
}

export const CATEGORY_COLORS = [
  '#e57373', // red
  '#f06292', // pink
  '#ba68c8', // purple
  '#7986cb', // indigo
  '#64b5f6', // blue
  '#4dd0e1', // cyan
  '#4db6ac', // teal
  '#81c784', // green
  '#aed581', // lime
  '#ffd54f', // yellow
  '#ffb74d', // orange
  '#a1887f', // brown
  '#90a4ae', // gray
] as const;
