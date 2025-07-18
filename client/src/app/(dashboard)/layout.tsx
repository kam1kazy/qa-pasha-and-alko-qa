import React from 'react';

import Sidebar from '@/shared/ui/Sidebar/Sidebar';

import styles from './layout.module.scss';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboard_layout}>
      <Sidebar />
      <main className={styles.dashboard_main}>{children}</main>
    </div>
  );
}
