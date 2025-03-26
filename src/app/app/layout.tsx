import { ReactNode } from 'react';

export const metadata = {
  title: 'ダッシュボード - Solana Gamify',
  description: 'Solana Gamifyアプリケーションのダッシュボード',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>{children}</main>
    </div>
  );
}
