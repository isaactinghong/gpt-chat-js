
export interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string;
  id: string;
  timestamp: number;
  imageUrls?: string[];
  isLoading?: boolean;
}
