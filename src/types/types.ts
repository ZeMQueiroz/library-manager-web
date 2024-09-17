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
  category: number;
  id: number;
  name: string;
  items: MediaItem[];
  description: string;
  background_image: string | null;
}

export interface UpdateCustomListPayload {
  name: string;
  items: MediaItem[];
  background_image?: string | null;
  category: number;
}
