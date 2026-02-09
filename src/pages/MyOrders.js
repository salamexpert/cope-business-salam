import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Table, Badge, Button, Modal } from '../components';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './MyOrders.css';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user?.id]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      const mapped = data.map(o => ({
        ...o,
        serviceName: o.service_name,
        price: parseFloat(o.price || 0),
        progress: o.progress || 0
      }));
      setOrders(mapped);
    }
    setLoading(false);
  };

  const columns = [
    { key: 'serviceName', label: 'Service', width: '200px' },
    { key: 'plan', label: 'Plan', width: '100px' },
    { key: 'date', label: 'Date', width: '120px' },
    { key: 'price', label: 'Price', render: (val) => `$${val.toFixed(2)}` },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge variant={val.toLowerCase()}>{val}</Badge>
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedOrder(row)}
        >
          View
        </Button>
      )
    }
  ];

  const getStatusSteps = () => {
    const steps = ['Ordered', 'Processing', 'Completed'];
    const currentIndex =
      selectedOrder?.status === 'Pending'
        ? 0
        : selectedOrder?.status === 'In Progress'
        ? 1
        : 2;

    return steps.map((step, idx) => ({
      label: step,
      completed: idx <= currentIndex,
      active: idx === currentIndex
    }));
  };

  return (
    <DashboardLayout title="My Orders">
      {loading ? (
        <Card>
          <CardBody>
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</div>
          </CardBody>
        </Card>
      ) : orders.length === 0 ? (
        <Card>
          <CardBody>
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <h3>No Orders Yet</h3>
              <p>You haven't placed any orders yet. Browse our services to get started!</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h3>Order History</h3>
          </CardHeader>
          <CardBody className="no-padding">
            <Table columns={columns} data={orders} />
          </CardBody>
        </Card>
      )}

      <Modal
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="order-details">
            <div className="details-section">
              <h4>Order Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Service</span>
                  <span className="value">{selectedOrder.serviceName}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Plan</span>
                  <span className="value">{selectedOrder.plan}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Amount</span>
                  <span className="value">${selectedOrder.price.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Date</span>
                  <span className="value">{selectedOrder.date}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Status</span>
                  <Badge variant={selectedOrder.status.toLowerCase()}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h4>Order Progress</h4>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${selectedOrder.progress}%` }}
                />
              </div>
              <p className="progress-text">{selectedOrder.progress}% Complete</p>

              <div className="status-timeline">
                {getStatusSteps().map((step, idx) => (
                  <div key={idx} className={`timeline-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                    <div className="timeline-dot" />
                    <div className="timeline-label">{step.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setSelectedOrder(null)} className="btn-block">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
