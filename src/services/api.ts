// src/services/api.ts
import axios from 'axios';
import { MediaItem, UpdateCustomListPayload } from '../types/types';

const API_BASE_URL =
  'https://library-manager-api-production.up.railway.app/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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
  listData: UpdateCustomListPayload // Use the updated type here
) => api.put(`/lists/${id}/`, listData);
export const deleteCustomList = (id: number) => api.delete(`/lists/${id}/`);
export const addItemToList = (listId: number, itemId: number) =>
  api.post(`/lists/${listId}/items/`, { item_id: itemId });

export const removeItemFromList = (listId: number, itemId: number) =>
  api.delete(`/lists/${listId}/items/${itemId}/`);

export default api;
