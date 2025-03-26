'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { useUser } from '@/hooks/use-user';
import { useWalletConnection } from '@/hooks/use-wallet';

const DashboardPage = () => {
  const { publicKey, connected, handleDisconnectWallet, getBalance } =
    useWalletConnection();
  const { user, loading: userLoading } = useUser();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // ウォレット未接続の場合はホームにリダイレクト
    if (!connected) {
      router.push(paths.home.getHref());
      return;
    }

    // 残高を取得
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const sol = await getBalance();
        setBalance(sol);
      } catch (error) {
        console.error('残高取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    // 10秒ごとに残高を更新
    const intervalId = setInterval(fetchBalance, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [connected, getBalance, router]);

  if (!connected || userLoading) {
    return null; // リダイレクト中は何も表示しない
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">ダッシュボード</h1>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">ウォレット情報</h2>

        <div className="mb-4">
          <p className="mb-2 text-gray-600">ウォレットアドレス:</p>
          <p className="break-all font-mono text-sm">{publicKey?.toString()}</p>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-gray-600">SOL残高:</p>
          {loading ? (
            <p>読み込み中...</p>
          ) : (
            <p className="text-2xl font-bold">{balance.toFixed(4)} SOL</p>
          )}
        </div>

        <Button
          onClick={handleDisconnectWallet}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          ウォレット切断
        </Button>
      </div>

      {user && (
        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">プレイヤー情報</h2>

          <div className="mb-4">
            <p className="mb-2 text-gray-600">ユーザー名:</p>
            <p className="text-lg font-semibold">{user.username}</p>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-gray-600">勝利数:</p>
            <p className="text-lg font-semibold">{user.wins} 回</p>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-gray-600">参加試合数:</p>
            <p className="text-lg font-semibold">{user.gamesPlayed} 回</p>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-gray-600">ポイント:</p>
            <p className="text-lg font-semibold">{user.points} ポイント</p>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-gray-600">登録日:</p>
            <p className="text-sm text-gray-500">
              {user.createdAt.toDate().toLocaleDateString('ja-JP')}
            </p>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-gray-600">最終更新:</p>
            <p className="text-sm text-gray-500">
              {user.updatedAt.toDate().toLocaleDateString('ja-JP')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
