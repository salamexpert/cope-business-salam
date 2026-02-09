import { useState, useEffect } from 'react';
import { StatCard, Card, CardHeader, CardBody, Table, Badge } from '../../components';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [totalClients, setTotalClients] = useState(0);
  const [openTickets, setOpenTickets] = useState(0);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [recentTickets, setRecentTickets] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Fetch all counts in parallel
    const [clientsRes, ticketsRes, invoicesRes, ordersRes, recentTicketsRes, recentInvoicesRes] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
      supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'Open'),
      supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).neq('status', 'Completed'),
      supabase.from('tickets').select('*, profiles!client_id(name)').order('created_at', { ascending: false }).limit(5),
      supabase.from('invoices').select('*, profiles!client_id(name)').order('created_at', { ascending: false }).limit(5)
    ]);

    if (clientsRes.count !== null) setTotalClients(clientsRes.count);
    if (ticketsRes.count !== null) setOpenTickets(ticketsRes.count);
    if (invoicesRes.count !== null) setPendingInvoices(invoicesRes.count);
    if (ordersRes.count !== null) setActiveOrders(ordersRes.count);

    if (recentTicketsRes.data) {
      setRecentTickets(recentTicketsRes.data.map(t => ({
        ...t,
        clientName: t.profiles?.name || 'Unknown',
        lastUpdated: new Date(t.last_updated).toLocaleDateString()
      })));
    }

    if (recentInvoicesRes.data) {
      setRecentInvoices(recentInvoicesRes.data.map((inv, index) => ({
        ...inv,
        displayId: `INV-${String(recentInvoicesRes.data.length - index).padStart(3, '0')}`,
        clientName: inv.profiles?.name || 'Unknown',
        amount: parseFloat(inv.amount || 0)
      })));
    }
  };

  const ticketColumns = [
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
    { key: 'displayId', label: 'Invoice ID' },
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
            {recentTickets.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No tickets yet.</div>
            ) : (
              <Table columns={ticketColumns} data={recentTickets} />
            )}
          </CardBody>
        </Card>
      </div>

      <div className="admin-dashboard-section">
        <Card>
          <CardHeader>
            <h3>Recent Invoices</h3>
          </CardHeader>
          <CardBody className="no-padding">
            {recentInvoices.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No invoices yet.</div>
            ) : (
              <Table columns={invoiceColumns} data={recentInvoices} />
            )}
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
