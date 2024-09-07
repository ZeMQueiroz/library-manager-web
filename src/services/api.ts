// src/services/api.ts
import axios from 'axios';
import { MediaItem } from '../types/types';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchMediaItems = (query: string = '') =>
  api.get(`items/${query}`);
export const fetchMediaItem = (id: string) => api.get(`items/${id}/`);
export const updateMediaItem = (id: number, updatedItem: MediaItem) =>
  api.put(`items/${id}/`, updatedItem);
export const createMediaItem = (newItem: Partial<MediaItem>) =>
  api.post('items/', newItem);
export const deleteMediaItem = (id: number) => api.delete(`items/${id}/`);
export const fetchCustomLists = () => api.get('/lists/');
export const createCustomList = (listData: {
  name: string;
  items: MediaItem[];
  category: number;
}) => api.post('/lists/', listData);
export const fetchCustomList = (id: string) => api.get(`/lists/${id}/`);
export const updateCustomList = (
  id: number,
  listData: { name: string; items: MediaItem[] }
) => api.put(`/lists/${id}/`, listData);
export const deleteCustomList = (id: number) => api.delete(`/lists/${id}/`);
export const addItemToList = (listId: number, itemId: number) =>
  api.post(`/lists/${listId}/items/`, { item_id: itemId });

export const removeItemFromList = (listId: number, itemId: number) =>
  api.delete(`/lists/${listId}/items/${itemId}/`);

export default api;
