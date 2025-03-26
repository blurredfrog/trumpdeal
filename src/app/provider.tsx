'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications';
import { queryConfig } from '@/lib/react-query';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  // デフォルトでdevnetを使用
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = React.useMemo(() => clusterApiUrl(network), [network]);

  // 利用可能なウォレットのリスト
  const wallets = React.useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  );

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        {process.env.DEV && <ReactQueryDevtools />}
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <Notifications />
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
