export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  totalSheds: number;
  totalBirds: number;
  createdAt: string;
}

export interface Shed {
  id: string;
  name: string;
  farmId: string;
  capacity: number;
  currentBirds: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface BirdBatch {
  id: string;
  name: string;
  farmId: string;
  shedId: string;
  breed: string;
  startDate: string;
  initialCount: number;
  currentCount: number;
  mortalityCount: number;
  status: 'active' | 'completed';
  createdAt: string;
}

export interface MortalityRecord {
  id: string;
  batchId: string;
  count: number;
  reason: string;
  date: string;
  notes: string;
}

export interface DashboardStats {
  totalFarms: number;
  totalSheds: number;
  totalBirds: number;
  totalMortality: number;
  mortalityRate: number;
}