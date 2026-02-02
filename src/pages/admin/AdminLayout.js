import { AdminSidebar } from '../../components';
import AdminTopNav from './AdminTopNav';
import './AdminLayout.css';

export default function AdminLayout({ title, children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <AdminTopNav title={title} />
        <main className="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
