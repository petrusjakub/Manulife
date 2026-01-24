export enum View {
  HOME = 'HOME',
  PRODUCTS = 'PRODUCTS',
  ASSISTANT = 'ASSISTANT',
  CONTACT = 'CONTACT'
}

export interface Product {
  id: string;
  name: string;
  category: 'Life' | 'Health' | 'Investment' | 'Syariah' | 'Saving';
  description: string;
  imageUrl: string;
  benefits: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}