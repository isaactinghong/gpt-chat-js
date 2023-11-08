
export interface Message {
  id: string;
  text: string;
  timestamp: number;
  senderId: string;
  imageUrls?: string[];
}
