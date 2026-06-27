import api from './api';
import { ItemGroup } from '../types';

const ItemGroupService = {
  getActiveItemGroups: async (): Promise<ItemGroup[]> => {
    // Corrected endpoint from /itemgroup/active to /item-groups/active
    const response = await api.get('/item-groups/active');
    return response.data;
  },
  
  getAllItemGroups: async (): Promise<ItemGroup[]> => {
    const response = await api.get('/item-groups');
    return response.data;
  }
};

export default ItemGroupService;

