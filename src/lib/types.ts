export interface PokerSession {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  gameType: string;
  stakes: string;
  buyIn: number;
  cashOut: number;
  profit: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  gameType?: string;
  location?: string;
  profitFilter?: 'all' | 'positive' | 'negative';
}
