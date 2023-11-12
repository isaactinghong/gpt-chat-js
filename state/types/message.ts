import { ChatCompletionUserMessageParam } from 'openai/resources';

export interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string | ChatCompletionUserMessageParam;
  id: string;
  timestamp: number;
  imageUrls?: string[];
  isLoading?: boolean;
}
