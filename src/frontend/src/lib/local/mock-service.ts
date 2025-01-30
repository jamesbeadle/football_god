import type { MockData } from './mock-data';
import { mockData } from './mock-data';

export class MockService {
  private mockData: MockData = mockData;

  async getData<T extends keyof MockData>(category: T): Promise<MockData[T]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.mockData[category];
  }

  async getLeagueData<T extends keyof MockData>(
    category: T, 
    leagueId: number
  ): Promise<MockData[T][keyof MockData[T]]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const data = this.mockData[category] as Record<number, any>;
    return data[leagueId];
  }
} 