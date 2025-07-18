'use client';

import React from 'react';

import { ProtectedRoute } from '@/shared/providers/ProtectedRoute';
import Sidebar from '@/shared/ui/Sidebar/Sidebar';

import styles from './layout.module.scss';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className={styles.dashboard_layout}>
        <Sidebar />
        <main className={styles.dashboard_main}>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
