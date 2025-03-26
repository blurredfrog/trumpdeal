import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { ReactNode } from 'react';

import { AppProvider } from '@/app/provider';

import '@/styles/globals.css';

export const metadata = {
  title: 'Solana Gamify',
  description: 'Solana Blockchainで構築されたゲームプラットフォーム',
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="ja">
      <body>
        <AppProvider>
          <HydrationBoundary state={dehydratedState}>
            {children}
          </HydrationBoundary>
        </AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;

// We are not prerendering anything because the app is highly dynamic
// and the data depends on the user so we need to send cookies with each request
export const dynamic = 'force-dynamic';
