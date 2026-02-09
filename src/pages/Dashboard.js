import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard, Card, CardHeader, CardBody, Table, Badge, Button } from '../components';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeOrders, setActiveOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [openTickets, setOpenTickets] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (user?.id) fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    const [activeRes, completedRes, ticketsRes, recentRes] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('client_id', user.id).neq('status', 'Completed'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('client_id', user.id).eq('status', 'Completed'),
      supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('client_id', user.id).eq('status', 'Open'),
      supabase.from('orders').select('*').eq('client_id', user.id).order('created_at', { ascending: false }).limit(5)
    ]);

    if (activeRes.count !== null) setActiveOrders(activeRes.count);
    if (completedRes.count !== null) setCompletedOrders(completedRes.count);
    if (ticketsRes.count !== null) setOpenTickets(ticketsRes.count);

    if (recentRes.data) {
      setRecentOrders(recentRes.data.map(o => ({
        ...o,
        serviceName: o.service_name,
        price: parseFloat(o.price || 0)
      })));
    }
  };

  const orderColumns = [
    { key: 'serviceName', label: 'Service' },
    { key: 'plan', label: 'Plan' },
    { key: 'price', label: 'Price', render: (val) => `$${val.toFixed(2)}` },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge variant={val.toLowerCase().replace(' ', '-')}>{val}</Badge>
    }
  ];

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
          <p>Here's what's happening with your account today.</p>
        </div>
        <div className="welcome-actions">
          <Link to="/dashboard/services">
            <Button variant="primary">Browse Services</Button>
          </Link>
          <Link to="/dashboard/tickets">
            <Button variant="secondary">Create Ticket</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        <StatCard
          icon="💰"
          label="Wallet Balance"
          value={`$${parseFloat(user?.wallet_balance || 0).toFixed(2)}`}
          accent="green"
        />
        <StatCard
          icon="📊"
          label="Active Orders"
          value={activeOrders}
          accent="orange"
        />
        <StatCard
          icon="✓"
          label="Completed Orders"
          value={completedOrders}
          accent="gray"
        />
        <StatCard
          icon="🎟️"
          label="Open Tickets"
          value={openTickets}
          accent="teal"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          <Link to="/dashboard/wallet" className="quick-action-card">
            <span className="quick-action-icon">💳</span>
            <span className="quick-action-label">Add Funds</span>
          </Link>
          <Link to="/dashboard/orders" className="quick-action-card">
            <span className="quick-action-icon">📦</span>
            <span className="quick-action-label">View Orders</span>
          </Link>
          <Link to="/dashboard/invoices" className="quick-action-card">
            <span className="quick-action-icon">🧾</span>
            <span className="quick-action-label">View Invoices</span>
          </Link>
          <Link to="/dashboard/reports" className="quick-action-card">
            <span className="quick-action-icon">📋</span>
            <span className="quick-action-label">View Reports</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-section">
        <Card>
          <CardHeader>
            <div className="section-header">
              <h3>Recent Orders</h3>
              <Link to="/dashboard/orders">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody className="no-padding">
            {recentOrders.length > 0 ? (
              <Table columns={orderColumns} data={recentOrders} />
            ) : (
              <div className="empty-table">
                <p>No orders yet. <Link to="/dashboard/services">Browse services</Link> to get started!</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
