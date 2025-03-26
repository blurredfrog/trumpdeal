'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { useWalletConnection } from '@/hooks/use-wallet';

const HomePage = () => {
  const { connected } = useWalletConnection();

  return (
    <div className="flex h-screen items-center bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Solana Gamify</span>
        </h2>
        <img src="/logo.svg" alt="logo" />
        <p className="mt-4 text-lg text-gray-600">
          Solana Blockchainで構築されたゲームプラットフォーム
        </p>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex shadow">
            {!connected && (
              <div className="flex justify-center">
                <WalletMultiButton className="rounded-md !bg-purple-600 px-4 py-2 !text-white transition-colors hover:!bg-purple-700" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
