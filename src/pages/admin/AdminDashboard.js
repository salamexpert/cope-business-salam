import { useState, useEffect } from 'react';
import { StatCard, Card, CardHeader, CardBody, Table, Badge } from '../../components';
import { mockTickets, mockInvoices, mockOrders } from '../../data/mockData';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [totalClients, setTotalClients] = useState(0);

  useEffect(() => {
    const fetchClientCount = async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client');

      if (!error && count !== null) {
        setTotalClients(count);
      }
    };
    fetchClientCount();
  }, []);

  const openTickets = mockTickets.filter(t => t.status === 'Open').length;
  const pendingInvoices = mockInvoices.filter(i => i.status === 'Pending').length;
  const activeOrders = mockOrders.filter(o => o.status !== 'Completed').length;

  const recentTickets = mockTickets.slice(0, 5);
  const recentInvoices = mockInvoices.slice(0, 5);

  const ticketColumns = [
    { key: 'id', label: 'Ticket ID' },
    { key: 'clientName', label: 'Client' },
    { key: 'subject', label: 'Subject' },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => <Badge variant={val.toLowerCase()}>{val}</Badge>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge variant={val.toLowerCase()}>{val}</Badge>
    }
  ];

  const invoiceColumns = [
    { key: 'id', label: 'Invoice ID' },
    { key: 'clientName', label: 'Client' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount', render: (val) => `$${val.toFixed(2)}` },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge variant={val.toLowerCase()}>{val}</Badge>
    }
  ];

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="admin-dashboard-grid">
        <StatCard
          icon="👥"
          label="Total Clients"
          value={totalClients}
          accent="blue"
        />
        <StatCard
          icon="🎟️"
          label="Open Tickets"
          value={openTickets}
          accent="orange"
        />
        <StatCard
          icon="🧾"
          label="Pending Invoices"
          value={pendingInvoices}
          accent="purple"
        />
        <StatCard
          icon="📦"
          label="Active Orders"
          value={activeOrders}
          accent="teal"
        />
      </div>

      <div className="admin-dashboard-section">
        <Card>
          <CardHeader>
            <h3>Recent Tickets</h3>
          </CardHeader>
          <CardBody className="no-padding">
            <Table columns={ticketColumns} data={recentTickets} />
          </CardBody>
        </Card>
      </div>

      <div className="admin-dashboard-section">
        <Card>
          <CardHeader>
            <h3>Recent Invoices</h3>
          </CardHeader>
          <CardBody className="no-padding">
            <Table columns={invoiceColumns} data={recentInvoices} />
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
