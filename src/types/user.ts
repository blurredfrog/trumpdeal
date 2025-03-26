import { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  username: string;
  walletAddress: string;
  wins: number;
  gamesPlayed: number;
  points: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
