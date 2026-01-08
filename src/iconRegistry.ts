import {
  Circle, Star, Heart, Music, Video, Book,
  Briefcase, Code, Coffee, Film, Headphones, Home, Lightbulb, Mail,
  MessageCircle, Mic, Monitor, Mountain, Palette, Camera, Rocket,
  ShoppingBag, Sparkles, Sword, Target, Tv, Umbrella, Zap,
  Apple, Award, Beaker, Bell, Bookmark, Box, Calendar,
  Clock, Cloud, Compass, Cookie, Crown, Database, Dumbbell, Flag,
  Flame, Gift, Globe, Hammer, Hash, Image, Key,
  Layers, Leaf, Lock, Map, Megaphone, Newspaper, Package, Paintbrush,
  Pencil, Pizza, Plane, Radio, Scissors, Shield, Smile, Snowflake,
  Sun, TrendingUp, Trophy, Truck, Users, Wallet, Watch,
  Wifi, Wind, Wrench, Youtube, Beer, Bike, Bug, Building, Car, Cake,
  Dog, Droplet, Egg, Eye, Feather, Fish, Gem, Glasses,
  Guitar, Lamp, Moon, Phone, Pill, Play, Plug, Printer,
  Shirt, Skull, Smartphone, Speaker, Trees, Waves, Wheat, Wine,
  type LucideIcon
} from 'lucide-react';

// Map icon names to their components
const ICON_MAP: Record<string, LucideIcon> = {
  Circle, Star, Heart, Music, Video, Book,
  Briefcase, Code, Coffee, Film, Headphones, Home, Lightbulb, Mail,
  MessageCircle, Mic, Monitor, Mountain, Palette, Camera, Rocket,
  ShoppingBag, Sparkles, Sword, Target, Tv, Umbrella, Zap,
  Apple, Award, Beaker, Bell, Bookmark, Box, Calendar,
  Clock, Cloud, Compass, Cookie, Crown, Database, Dumbbell, Flag,
  Flame, Gift, Globe, Hammer, Hash, Image, Key,
  Layers, Leaf, Lock, Map, Megaphone, Newspaper, Package, Paintbrush,
  Pencil, Pizza, Plane, Radio, Scissors, Shield, Smile, Snowflake,
  Sun, TrendingUp, Trophy, Truck, Users, Wallet, Watch,
  Wifi, Wind, Wrench, Youtube, Beer, Bike, Bug, Building, Car, Cake,
  Dog, Droplet, Egg, Eye, Feather, Fish, Gem, Glasses,
  Guitar, Lamp, Moon, Phone, Pill, Play, Plug, Printer,
  Shirt, Skull, Smartphone, Speaker, Trees, Waves, Wheat, Wine,
};

export function getIconComponent(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Circle;
}

export const ICON_LIST = Object.keys(ICON_MAP).map(name => ({
  name,
  component: ICON_MAP[name]
}));
