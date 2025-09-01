import { ReactNode } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

/**
 * Admin Layout Wrapper
 * 
 * This layout wraps all admin pages (/admin/*) with:
 * - Admin sidebar navigation
 * - Admin header with user info
 * - Consistent styling and layout structure
 * 
 * @param children - The admin page content to render
 */
export default function AdminLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
