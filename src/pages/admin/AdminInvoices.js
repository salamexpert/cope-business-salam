import { useState } from 'react';
import { Card, CardHeader, CardBody, Table, Badge, Button, Modal } from '../../components';
import { mockInvoices, mockClients } from '../../data/mockData';
import AdminLayout from './AdminLayout';
import './AdminInvoices.css';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // New invoice form state
  const [newInvoice, setNewInvoice] = useState({
    clientId: '',
    dueDate: '',
    lineItems: [{ description: '', quantity: 1, unitPrice: 0 }]
  });

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleAddLineItem = () => {
    setNewInvoice({
      ...newInvoice,
      lineItems: [...newInvoice.lineItems, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleRemoveLineItem = (index) => {
    const items = newInvoice.lineItems.filter((_, i) => i !== index);
    setNewInvoice({ ...newInvoice, lineItems: items });
  };

  const handleLineItemChange = (index, field, value) => {
    const items = newInvoice.lineItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setNewInvoice({ ...newInvoice, lineItems: items });
  };

  const calculateTotal = () => {
    return newInvoice.lineItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
  };

  const handleCreateInvoice = () => {
    const client = mockClients.find(c => c.id === newInvoice.clientId);
    if (!client || !newInvoice.dueDate) return;

    const total = calculateTotal();
    const lineItemsWithTotal = newInvoice.lineItems.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));

    const invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientCompany: client.company,
      date: new Date().toISOString().slice(0, 10),
      dueDate: newInvoice.dueDate,
      amount: total,
      status: 'Pending',
      lineItems: lineItemsWithTotal
    };

    setInvoices([invoice, ...invoices]);
    setShowCreateModal(false);
    setNewInvoice({
      clientId: '',
      dueDate: '',
      lineItems: [{ description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleMarkAsPaid = (invoiceId) => {
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: 'Paid' };
      }
      return inv;
    });
    setInvoices(updatedInvoices);

    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice({ ...selectedInvoice, status: 'Paid' });
    }
  };

  const columns = [
    { key: 'id', label: 'Invoice ID' },
    { key: 'clientName', label: 'Client' },
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
        <div className="action-buttons">
          <Button variant="secondary" size="sm" onClick={() => handleViewInvoice(row)}>
            View
          </Button>
          {row.status === 'Pending' && (
            <Button variant="primary" size="sm" onClick={() => handleMarkAsPaid(row.id)}>
              Mark Paid
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="Invoices">
      <Card>
        <CardHeader>
          <div className="invoices-header">
            <h3>All Invoices</h3>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create Invoice
            </Button>
          </div>
        </CardHeader>
        <CardBody className="no-padding">
          <Table columns={columns} data={invoices} />
        </CardBody>
      </Card>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <Modal
          title="Create New Invoice"
          onClose={() => setShowCreateModal(false)}
          size="lg"
        >
          <div className="create-invoice-form">
            <div className="form-row">
              <div className="form-group">
                <label>Client</label>
                <select
                  value={newInvoice.clientId}
                  onChange={(e) => setNewInvoice({ ...newInvoice, clientId: e.target.value })}
                >
                  <option value="">Select a client</option>
                  {mockClients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.company}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="line-items-section">
              <h4>Line Items</h4>
              {newInvoice.lineItems.map((item, index) => (
                <div key={index} className="line-item-row">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                    className="description-input"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    className="qty-input"
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.unitPrice}
                    onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="price-input"
                    min="0"
                    step="0.01"
                  />
                  <span className="line-total">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                  {newInvoice.lineItems.length > 1 && (
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => handleRemoveLineItem(index)}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="add-item-btn" onClick={handleAddLineItem}>
                + Add Line Item
              </button>
            </div>

            <div className="invoice-total">
              <span>Total:</span>
              <span className="total-amount">${calculateTotal().toFixed(2)}</span>
            </div>

            <div className="form-actions">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateInvoice}>
                Create Invoice
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Invoice Modal */}
      {showViewModal && selectedInvoice && (
        <Modal
          title={`Invoice ${selectedInvoice.id}`}
          onClose={() => {
            setShowViewModal(false);
            setSelectedInvoice(null);
          }}
          size="lg"
        >
          <div className="invoice-view">
            <div className="invoice-header-section">
              <div className="invoice-info">
                <h3>COPE Business</h3>
                <p>Invoice #{selectedInvoice.id}</p>
              </div>
              <Badge variant={selectedInvoice.status.toLowerCase()} size="lg">
                {selectedInvoice.status}
              </Badge>
            </div>

            <div className="invoice-details-grid">
              <div className="detail-section">
                <h4>Bill To</h4>
                <p className="client-name">{selectedInvoice.clientName}</p>
                <p>{selectedInvoice.clientCompany}</p>
                <p>{selectedInvoice.clientEmail}</p>
              </div>
              <div className="detail-section">
                <h4>Invoice Details</h4>
                <p><strong>Date:</strong> {selectedInvoice.date}</p>
                <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
              </div>
            </div>

            <table className="invoice-items-table">
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
              <tfoot>
                <tr>
                  <td colSpan="3" className="total-label">Total</td>
                  <td className="total-value">${selectedInvoice.amount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            {selectedInvoice.status === 'Pending' && (
              <div className="invoice-actions">
                <Button variant="primary" onClick={() => handleMarkAsPaid(selectedInvoice.id)}>
                  Mark as Paid
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
