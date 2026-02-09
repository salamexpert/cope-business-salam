import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Table, Badge, Button, Modal } from '../components';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './Invoices.css';

export default function Invoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.id) fetchInvoices();
  }, [user?.id]);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('invoices')
      .select('*, invoice_line_items(*)')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
    } else {
      const mapped = data.map(inv => ({
        ...inv,
        amount: parseFloat(inv.amount || 0),
        dueDate: inv.due_date,
        lineItems: (inv.invoice_line_items || []).map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unit_price || 0),
          total: parseFloat(item.total || 0)
        }))
      }));
      setInvoices(mapped);
    }
    setLoading(false);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const columns = [
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
        <Button variant="secondary" size="sm" onClick={() => handleViewInvoice(row)}>
          View
        </Button>
      )
    }
  ];

  return (
    <DashboardLayout title="Invoices">
      {loading ? (
        <Card>
          <CardBody>
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading invoices...</div>
          </CardBody>
        </Card>
      ) : invoices.length === 0 ? (
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
            <Table columns={columns} data={invoices} />
          </CardBody>
        </Card>
      )}

      {/* Invoice Detail Modal */}
      {showModal && selectedInvoice && (
        <Modal
          title={`Invoice`}
          onClose={() => {
            setShowModal(false);
            setSelectedInvoice(null);
          }}
          size="lg"
        >
          <div className="invoice-detail">
            <div className="invoice-header">
              <div className="invoice-brand">
                <h2>COPE Business</h2>
                <p>Invoice</p>
              </div>
              <Badge variant={selectedInvoice.status.toLowerCase()} size="lg">
                {selectedInvoice.status}
              </Badge>
            </div>

            <div className="invoice-info-grid">
              <div className="info-section">
                <h4>Bill To</h4>
                <p className="client-name">{user?.name}</p>
                <p>{user?.company || ''}</p>
                <p>{user?.email}</p>
              </div>
              <div className="info-section">
                <h4>Invoice Details</h4>
                <p><strong>Invoice Date:</strong> {selectedInvoice.date}</p>
                <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
              </div>
            </div>

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

            <div className="invoice-total">
              <div className="total-row">
                <span>Total Amount</span>
                <span className="total-amount">${selectedInvoice.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
