import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Table, Button, Modal } from '../../components';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';
import './AdminClients.css';

export default function AdminClients() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientStats, setClientStats] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
    } else {
      const mapped = data.map(client => ({
        ...client,
        avatar: client.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=random`,
        walletBalance: parseFloat(client.wallet_balance || 0),
        joinDate: new Date(client.created_at).toLocaleDateString()
      }));
      setClients(mapped);
    }
    setLoading(false);
  };

  const handleViewClient = async (client) => {
    setSelectedClient(client);
    setShowModal(true);
    setClientStats(null);

    const [ordersRes, ticketsRes, invoicesRes, spentRes] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('client_id', client.id),
      supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('client_id', client.id),
      supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('client_id', client.id),
      supabase.from('invoices').select('amount').eq('client_id', client.id).eq('status', 'Paid')
    ]);

    const totalSpent = (spentRes.data || []).reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);

    setClientStats({
      ordersCount: ordersRes.count || 0,
      ticketsCount: ticketsRes.count || 0,
      invoicesCount: invoicesRes.count || 0,
      totalSpent
    });
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'company', label: 'Company', render: (val) => val || 'N/A' },
    { key: 'joinDate', label: 'Joined' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button variant="secondary" size="sm" onClick={() => handleViewClient(row)}>
          View Details
        </Button>
      )
    }
  ];

  return (
    <AdminLayout title="Clients">
      <Card>
        <CardHeader>
          <h3>All Clients</h3>
        </CardHeader>
        <CardBody className="no-padding">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading clients...</div>
          ) : clients.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>No clients found.</div>
          ) : (
            <Table columns={columns} data={clients} />
          )}
        </CardBody>
      </Card>

      {showModal && selectedClient && (
        <Modal
          title="Client Details"
          onClose={() => {
            setShowModal(false);
            setSelectedClient(null);
            setClientStats(null);
          }}
        >
          <div className="client-details">
            <div className="client-header">
              <img
                src={selectedClient.avatar}
                alt={selectedClient.name}
                className="client-avatar"
              />
              <div className="client-info">
                <h3>{selectedClient.name}</h3>
                <p>{selectedClient.email}</p>
                <p>{selectedClient.company || 'No company'}</p>
              </div>
            </div>

            <div className="client-stats-grid">
              {clientStats ? (
                <>
                  <div className="client-stat">
                    <span className="stat-value">{clientStats.ordersCount}</span>
                    <span className="stat-label">Orders</span>
                  </div>
                  <div className="client-stat">
                    <span className="stat-value">{clientStats.ticketsCount}</span>
                    <span className="stat-label">Tickets</span>
                  </div>
                  <div className="client-stat">
                    <span className="stat-value">{clientStats.invoicesCount}</span>
                    <span className="stat-label">Invoices</span>
                  </div>
                  <div className="client-stat">
                    <span className="stat-value">${clientStats.totalSpent.toFixed(2)}</span>
                    <span className="stat-label">Total Spent</span>
                  </div>
                </>
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>
                  Loading stats...
                </div>
              )}
            </div>

            <div className="client-meta">
              <div className="meta-item">
                <span className="meta-label">Phone:</span>
                <span className="meta-value">{selectedClient.phone || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Wallet Balance:</span>
                <span className="meta-value">${selectedClient.walletBalance?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Member Since:</span>
                <span className="meta-value">{selectedClient.joinDate}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
