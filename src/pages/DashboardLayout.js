import { Sidebar, TopNav } from '../components';
import './DashboardLayout.css';

export default function DashboardLayout({ title, children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <TopNav title={title} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
