import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Table, Badge, Button, Modal } from '../../components';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';
import './AdminInvoices.css';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newInvoice, setNewInvoice] = useState({
    clientId: '',
    dueDate: '',
    lineItems: [{ description: '', quantity: 1, unitPrice: 0 }]
  });

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('invoices')
      .select('*, profiles!client_id(name, email, company), invoice_line_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
    } else {
      const mapped = data.map((inv, index) => ({
        ...inv,
        displayId: `INV-${String(data.length - index).padStart(3, '0')}`,
        clientName: inv.profiles?.name || 'Unknown',
        clientEmail: inv.profiles?.email || '',
        clientCompany: inv.profiles?.company || '',
        amount: parseFloat(inv.amount || 0),
        lineItems: (inv.invoice_line_items || []).map(li => ({
          description: li.description,
          quantity: li.quantity,
          unitPrice: parseFloat(li.unit_price || 0),
          total: parseFloat(li.total || 0)
        }))
      }));
      setInvoices(mapped);
    }
    setLoading(false);
  };

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, company')
      .eq('role', 'client')
      .order('name');

    if (!error) {
      setClients(data || []);
    }
  };

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

  const handleCreateInvoice = async () => {
    const client = clients.find(c => c.id === newInvoice.clientId);
    if (!client || !newInvoice.dueDate) return;

    const total = calculateTotal();

    const { data: invData, error: invError } = await supabase
      .from('invoices')
      .insert({
        client_id: client.id,
        date: new Date().toISOString().slice(0, 10),
        due_date: newInvoice.dueDate,
        amount: total,
        status: 'Pending'
      })
      .select()
      .single();

    if (invError) {
      console.error('Error creating invoice:', invError);
      return;
    }

    const lineItemsToInsert = newInvoice.lineItems.map(item => ({
      invoice_id: invData.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total: item.quantity * item.unitPrice
    }));

    const { error: liError } = await supabase
      .from('invoice_line_items')
      .insert(lineItemsToInsert);

    if (liError) {
      console.error('Error creating line items:', liError);
    }

    setShowCreateModal(false);
    setNewInvoice({
      clientId: '',
      dueDate: '',
      lineItems: [{ description: '', quantity: 1, unitPrice: 0 }]
    });
    fetchInvoices();
  };

  const handleMarkAsPaid = async (invoiceId) => {
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'Paid' })
      .eq('id', invoiceId);

    if (error) {
      console.error('Error marking as paid:', error);
      return;
    }

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
    { key: 'displayId', label: 'Invoice ID' },
    { key: 'clientName', label: 'Client' },
    { key: 'date', label: 'Date' },
    { key: 'due_date', label: 'Due Date' },
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
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading invoices...</div>
          ) : invoices.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>No invoices found.</div>
          ) : (
            <Table columns={columns} data={invoices} />
          )}
        </CardBody>
      </Card>

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
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.company ? `- ${client.company}` : ''}
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

      {showViewModal && selectedInvoice && (
        <Modal
          title={`Invoice ${selectedInvoice.displayId}`}
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
                <p>Invoice #{selectedInvoice.displayId}</p>
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
                <p><strong>Due Date:</strong> {selectedInvoice.due_date}</p>
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
