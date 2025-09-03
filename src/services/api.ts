import { Expense, ExpenseFormData, ExpenseStats, ApiResponse } from '../types/expense';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getExpenses(filters?: {
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Expense[]> {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const queryString = params.toString();
    const endpoint = `/expenses${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<Expense[]>(endpoint);
    return response.data || [];
  }

  async getExpenseById(id: number): Promise<Expense> {
    const response = await this.request<Expense>(`/expenses/${id}`);
    if (!response.data) {
      throw new Error('Expense not found');
    }
    return response.data;
  }

  async createExpense(expenseData: ExpenseFormData): Promise<Expense> {
    const response = await this.request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
    
    if (!response.data) {
      throw new Error('Failed to create expense');
    }
    
    return response.data;
  }

  async updateExpense(id: number, expenseData: Partial<ExpenseFormData>): Promise<Expense> {
    const response = await this.request<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
    
    if (!response.data) {
      throw new Error('Failed to update expense');
    }
    
    return response.data;
  }

  async deleteExpense(id: number): Promise<void> {
    await this.request(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  async getStats(): Promise<ExpenseStats> {
    const response = await this.request<ExpenseStats>('/expenses/stats');
    if (!response.data) {
      throw new Error('Failed to fetch statistics');
    }
    return response.data;
  }

  async checkHealth(): Promise<boolean> {
    try {
      await this.request('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();