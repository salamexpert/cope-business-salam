import { StatCard, Card, CardHeader, CardBody, Table, Badge } from '../components';
import { mockUser, mockOrders, mockTransactions } from '../data/mockData';
import DashboardLayout from './DashboardLayout';
import './Dashboard.css';

export default function Dashboard() {
  const completedOrders = mockOrders.filter(o => o.status === 'Completed').length;
  const activeOrders = mockOrders.filter(o => o.status !== 'Completed').length;
  const openTickets = 2;

  const recentOrders = mockOrders.slice(0, 5);
  const recentTransactions = mockTransactions.slice(0, 5);

  const orderColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'serviceName', label: 'Service' },
    { key: 'plan', label: 'Plan' },
    { key: 'price', label: 'Price', render: (val) => `$${val.toFixed(2)}` },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge variant={val.toLowerCase()}>{val}</Badge>
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
          {val >= 0 ? '+' : ''} ${Math.abs(val).toFixed(2)}
        </span>
      )
    }
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="dashboard-grid">
        <StatCard
          icon="💰"
          label="Wallet Balance"
          value={`$${mockUser.walletBalance.toFixed(2)}`}
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

      <div className="dashboard-section">
        <Card>
          <CardHeader>
            <h3>Recent Orders</h3>
          </CardHeader>
          <CardBody className="no-padding">
            <Table columns={orderColumns} data={recentOrders} />
          </CardBody>
        </Card>
      </div>

      <div className="dashboard-section">
        <Card>
          <CardHeader>
            <h3>Recent Transactions</h3>
          </CardHeader>
          <CardBody className="no-padding">
            <Table columns={transactionColumns} data={recentTransactions} />
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
