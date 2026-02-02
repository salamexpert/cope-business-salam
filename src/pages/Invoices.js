import { useState } from 'react';
import { Card, CardBody, CardHeader, Table, Badge, Button, Modal } from '../components';
import { mockInvoices } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './Invoices.css';

export default function Invoices() {
  const { user } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter invoices for current client
  const clientInvoices = mockInvoices.filter(i => i.clientId === user?.id);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const columns = [
    { key: 'id', label: 'Invoice ID' },
    { key: 'date', label: 'Date' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'amount', label: 'Amount', render: (val) => `$${val.toFixed(2)}` },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge variant={val.toLowerCase()}>{val}</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="invoice-actions">
          <Button variant="secondary" size="sm" onClick={() => handleViewInvoice(row)}>
            View
          </Button>
          <Button variant="ghost" size="sm" onClick={() => alert(`Downloading ${row.id}...`)}>
            Download
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout title="Invoices">
      {clientInvoices.length === 0 ? (
        <Card>
          <CardBody>
            <div className="empty-state">
              <span className="empty-icon">🧾</span>
              <h3>No Invoices Yet</h3>
              <p>You don't have any invoices yet. Invoices will appear here when you make purchases or when our team sends you billing documents.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h3>Your Invoices</h3>
          </CardHeader>
          <CardBody className="no-padding">
            <Table columns={columns} data={clientInvoices} />
          </CardBody>
        </Card>
      )}

      {/* Invoice Detail Modal */}
      {showModal && selectedInvoice && (
        <Modal
          title={`Invoice ${selectedInvoice.id}`}
          onClose={() => {
            setShowModal(false);
            setSelectedInvoice(null);
          }}
          size="lg"
        >
          <div className="invoice-detail">
            {/* Invoice Header */}
            <div className="invoice-header">
              <div className="invoice-brand">
                <h2>COPE Business</h2>
                <p>Invoice #{selectedInvoice.id}</p>
              </div>
              <Badge variant={selectedInvoice.status.toLowerCase()} size="lg">
                {selectedInvoice.status}
              </Badge>
            </div>

            {/* Invoice Info Grid */}
            <div className="invoice-info-grid">
              <div className="info-section">
                <h4>Bill To</h4>
                <p className="client-name">{selectedInvoice.clientName}</p>
                <p>{selectedInvoice.clientCompany}</p>
                <p>{selectedInvoice.clientEmail}</p>
              </div>
              <div className="info-section">
                <h4>Invoice Details</h4>
                <p><strong>Invoice Date:</strong> {selectedInvoice.date}</p>
                <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
                {selectedInvoice.orderId && (
                  <p><strong>Order ID:</strong> {selectedInvoice.orderId}</p>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="invoice-items">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.lineItems?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>${item.unitPrice.toFixed(2)}</td>
                      <td>${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="invoice-total">
              <div className="total-row">
                <span>Total Amount</span>
                <span className="total-amount">${selectedInvoice.amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="invoice-modal-actions">
              <Button variant="primary" onClick={() => alert(`Downloading ${selectedInvoice.id}...`)}>
                Download PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
