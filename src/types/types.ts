export interface MediaItem {
  id: number;
  title: string;
  description: string;
  status: string;
  progress: number;
  rating: number | null;
  notes: string;
  cover_url: string;
  category: number;
}

export interface CustomList {
  id: number;
  name: string;
  items: MediaItem[];
  description: string;
}
