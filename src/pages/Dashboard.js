import { Link } from 'react-router-dom';
import { StatCard, Card, CardHeader, CardBody, Table, Badge, Button } from '../components';
import { mockOrders, mockTransactions, mockTickets } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  // Filter data for current client
  const clientOrders = mockOrders.filter(o => o.clientId === user?.id);
  const clientTickets = mockTickets.filter(t => t.clientId === user?.id);

  const completedOrders = clientOrders.filter(o => o.status === 'Completed').length;
  const activeOrders = clientOrders.filter(o => o.status !== 'Completed').length;
  const openTickets = clientTickets.filter(t => t.status === 'Open').length;

  const recentOrders = clientOrders.slice(0, 5);
  const recentTransactions = mockTransactions.slice(0, 5);

  const orderColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'serviceName', label: 'Service' },
    { key: 'plan', label: 'Plan' },
    { key: 'price', label: 'Price', render: (val) => `$${val.toFixed(2)}` },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge variant={val.toLowerCase().replace(' ', '-')}>{val}</Badge>
    }
  ];

  const transactionColumns = [
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    {
      key: 'amount',
      label: 'Amount',
      render: (val) => (
        <span className={val >= 0 ? 'amount-positive' : 'amount-negative'}>
          {val >= 0 ? '+' : ''}${Math.abs(val).toFixed(2)}
        </span>
      )
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

      {/* Recent Transactions */}
      <div className="dashboard-section">
        <Card>
          <CardHeader>
            <div className="section-header">
              <h3>Recent Transactions</h3>
              <Link to="/dashboard/wallet">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody className="no-padding">
            <Table columns={transactionColumns} data={recentTransactions} />
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
