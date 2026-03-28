export interface WishItem {
  id: string;
  name: string;
  price: number;
  url: string;
  genre: string;
  tags: string[];
  rank: number; // 1〜5 (1が最高)
  memo: string;
  purchased: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SortKey = 'rank' | 'price_asc' | 'price_desc' | 'createdAt';
