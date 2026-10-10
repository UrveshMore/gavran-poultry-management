import { Farm, Shed, BirdBatch, MortalityRecord, DashboardStats } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const ApiService = {
  // Farms
  async getFarms(): Promise<{ success: boolean; farms?: Farm[]; error?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/farms`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, farms: result.farms };
      } else {
        return { success: false, error: result.error || 'Failed to fetch farms' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  async createFarm(farmData: {
    name: string;
    location: string;
  }): Promise<{ success: boolean; farm?: Farm; error?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/farms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(farmData),
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, farm: result.farm };
      } else {
        return { success: false, error: result.error || 'Failed to create farm' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Sheds
  async getSheds(): Promise<{ success: boolean; sheds?: Shed[]; error?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/sheds`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, sheds: result.sheds };
      } else {
        return { success: false, error: result.error || 'Failed to fetch sheds' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  async createShed(shedData: {
    name: string;
    farmId: string;
    capacity: number;
  }): Promise<{ success: boolean; shed?: Shed; error?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/sheds`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shedData),
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, shed: result.shed };
      } else {
        return { success: false, error: result.error || 'Failed to create shed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Bird Batches
  async getBatches(): Promise<{ success: boolean; batches?: BirdBatch[]; error?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/batches`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, batches: result.batches };
      } else {
        return { success: false, error: result.error || 'Failed to fetch batches' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  async createBatch(batchData: {
    name: string;
    farmId: string;
    shedId: string;
    breed: string;
    startDate: string;
    initialCount: number;
  }): Promise<{ success: boolean; batch?: BirdBatch; error?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/batches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchData),
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, batch: result.batch };
      } else {
        return { success: false, error: result.error || 'Failed to create batch' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  async recordMortality(mortalityData: {
    batchId: string;
    count: number;
    reason: string;
    date: string;
    notes?: string;
  }): Promise<{ success: boolean; record?: MortalityRecord; error?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/batches/mortality`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mortalityData),
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, record: result.record };
      } else {
        return { success: false, error: result.error || 'Failed to record mortality' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Dashboard
  async getDashboardStats(): Promise<{ success: boolean; stats?: DashboardStats; error?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, stats: result.stats };
      } else {
        return { success: false, error: result.error || 'Failed to fetch dashboard stats' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },
};