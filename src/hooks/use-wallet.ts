import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { paths } from '@/config/paths';

export const useWalletConnection = () => {
  const { publicKey, wallet, disconnect, connect, connecting, connected } =
    useWallet();
  const { connection } = useConnection();
  const router = useRouter();

  // ウォレット接続処理
  const handleConnectWallet = useCallback(async () => {
    if (wallet) {
      try {
        await connect();
      } catch (error) {
        console.error('ウォレット接続エラー:', error);
      }
    }
  }, [wallet, connect]);

  // ウォレット切断処理
  const handleDisconnectWallet = useCallback(async () => {
    try {
      await disconnect();
      router.push(paths.home.getHref());
    } catch (error) {
      console.error('ウォレット切断エラー:', error);
    }
  }, [disconnect, router]);

  // SOL残高取得
  const getBalance = useCallback(async () => {
    if (!publicKey || !connection) return 0;

    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('残高取得エラー:', error);
      return 0;
    }
  }, [publicKey, connection]);

  // ウォレット接続状態に基づいてリダイレクト
  useEffect(() => {
    // ウォレット接続後はダッシュボードへリダイレクト
    if (connected && window.location.pathname === paths.home.getHref()) {
      router.push(paths.app.root.getHref());
    }
  }, [connected, router]);

  return {
    publicKey,
    connecting,
    connected,
    wallet,
    handleConnectWallet,
    handleDisconnectWallet,
    getBalance,
  };
};
