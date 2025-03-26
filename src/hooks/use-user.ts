import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

import { db } from '@/lib/firebase';
import { User } from '@/types/user';

import { useWalletConnection } from './use-wallet';

export const useUser = () => {
  const { publicKey, connected } = useWalletConnection();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ユーザー情報の取得
  const fetchUser = useCallback(async () => {
    if (!publicKey || !connected) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, 'users', publicKey.toString());
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(userSnap.data() as User);
      } else {
        // 新規ユーザーの作成
        const newUser: Omit<User, 'id'> = {
          username: `Player${publicKey.toString().slice(0, 4)}`,
          walletAddress: publicKey.toString(),
          wins: 0,
          gamesPlayed: 0,
          points: 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        await setDoc(userRef, newUser);
        setUser({ id: publicKey.toString(), ...newUser });
      }
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
    } finally {
      setLoading(false);
    }
  }, [publicKey, connected]);

  // ユーザー情報の更新
  const updateUser = useCallback(
    async (data: Partial<User>) => {
      if (!publicKey) return;

      try {
        const userRef = doc(db, 'users', publicKey.toString());
        await updateDoc(userRef, {
          ...data,
          updatedAt: Timestamp.now(),
        });
        await fetchUser();
      } catch (error) {
        console.error('ユーザー情報更新エラー:', error);
      }
    },
    [publicKey, fetchUser],
  );

  // ウォレット接続状態が変更されたときにユーザー情報を取得
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    updateUser,
  };
};
