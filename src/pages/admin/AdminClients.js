import { useState } from 'react';
import { Card, CardHeader, CardBody, Table, Badge, Button, Modal } from '../../components';
import { mockClients, mockOrders, mockTickets, mockInvoices } from '../../data/mockData';
import AdminLayout from './AdminLayout';
import './AdminClients.css';

export default function AdminClients() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const getClientStats = (clientId) => {
    const orders = mockOrders.filter(o => o.clientId === clientId);
    const tickets = mockTickets.filter(t => t.clientId === clientId);
    const invoices = mockInvoices.filter(i => i.clientId === clientId);
    const totalSpent = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    return {
      ordersCount: orders.length,
      ticketsCount: tickets.length,
      invoicesCount: invoices.length,
      totalSpent
    };
  };

  const columns = [
    { key: 'id', label: 'Client ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'company', label: 'Company' },
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
          <Table columns={columns} data={mockClients} />
        </CardBody>
      </Card>

      {showModal && selectedClient && (
        <Modal
          title="Client Details"
          onClose={() => {
            setShowModal(false);
            setSelectedClient(null);
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
                <p>{selectedClient.company}</p>
              </div>
            </div>

            <div className="client-stats-grid">
              {(() => {
                const stats = getClientStats(selectedClient.id);
                return (
                  <>
                    <div className="client-stat">
                      <span className="stat-value">{stats.ordersCount}</span>
                      <span className="stat-label">Orders</span>
                    </div>
                    <div className="client-stat">
                      <span className="stat-value">{stats.ticketsCount}</span>
                      <span className="stat-label">Tickets</span>
                    </div>
                    <div className="client-stat">
                      <span className="stat-value">{stats.invoicesCount}</span>
                      <span className="stat-label">Invoices</span>
                    </div>
                    <div className="client-stat">
                      <span className="stat-value">${stats.totalSpent.toFixed(2)}</span>
                      <span className="stat-label">Total Spent</span>
                    </div>
                  </>
                );
              })()}
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
