import { useState } from 'react';
import { Card, CardBody, CardHeader, Table, Badge, Button, Modal } from '../components';
import { mockOrders } from '../data/mockData';
import DashboardLayout from './DashboardLayout';
import './MyOrders.css';

export default function MyOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const columns = [
    { key: 'id', label: 'Order ID', width: '120px' },
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
      key: 'id',
      label: 'Action',
      render: (val, row) => (
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

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'Pending':
        return 10;
      case 'In Progress':
        return 50;
      case 'Completed':
        return 100;
      default:
        return 0;
    }
  };

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
      <Card>
        <CardHeader>
          <h3>Order History</h3>
        </CardHeader>
        <CardBody className="no-padding">
          <Table columns={columns} data={mockOrders} />
        </CardBody>
      </Card>

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
                  <span className="label">Order ID</span>
                  <span className="value">{selectedOrder.id}</span>
                </div>
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

            <div className="details-section">
              <h4>Delivered Files</h4>
              {selectedOrder.deliveredFiles.length > 0 ? (
                <div className="files-list">
                  {selectedOrder.deliveredFiles.map((file, idx) => (
                    <div key={idx} className="file-item">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{file}</span>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-text">No files delivered yet. Check back soon!</p>
              )}
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
