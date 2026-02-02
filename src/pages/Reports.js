import { useState } from 'react';
import { Card, CardHeader, CardBody, Table, Badge, Button, Modal } from '../components';
import { mockReports } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './Reports.css';

export default function Reports() {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter reports for the current client that have been sent
  const clientReports = mockReports.filter(
    r => r.clientId === user?.id && r.status === 'Sent'
  );

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const columns = [
    { key: 'id', label: 'Report ID' },
    { key: 'title', label: 'Title' },
    { key: 'date', label: 'Date Received' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button variant="secondary" size="sm" onClick={() => handleViewReport(row)}>
          View Report
        </Button>
      )
    }
  ];

  return (
    <DashboardLayout title="Reports">
      {clientReports.length === 0 ? (
        <Card>
          <CardBody>
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <h3>No Reports Yet</h3>
              <p>You haven't received any reports from our team yet. When we send you updates or progress reports, they'll appear here.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h3>Your Reports</h3>
          </CardHeader>
          <CardBody className="no-padding">
            <Table columns={columns} data={clientReports} />
          </CardBody>
        </Card>
      )}

      {showModal && selectedReport && (
        <Modal
          title={selectedReport.title}
          onClose={() => {
            setShowModal(false);
            setSelectedReport(null);
          }}
          size="lg"
        >
          <div className="report-detail">
            <div className="report-meta">
              <div className="meta-item">
                <span className="meta-label">Report ID</span>
                <span className="meta-value">{selectedReport.id}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Date Received</span>
                <span className="meta-value">{selectedReport.date}</span>
              </div>
              {selectedReport.orderId && (
                <div className="meta-item">
                  <span className="meta-label">Related Order</span>
                  <span className="meta-value">{selectedReport.orderId}</span>
                </div>
              )}
            </div>

            <div className="report-content">
              <h4>Report Details</h4>
              <div className="content-box">
                {selectedReport.content}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
