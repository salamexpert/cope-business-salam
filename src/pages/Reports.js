import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Table, Badge, Button, Modal } from '../components';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './Reports.css';

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.id) fetchReports();
  }, [user?.id]);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('client_id', user.id)
      .eq('status', 'Sent')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
    } else {
      setReports(data || []);
    }
    setLoading(false);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const columns = [
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
      {loading ? (
        <Card>
          <CardBody>
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading reports...</div>
          </CardBody>
        </Card>
      ) : reports.length === 0 ? (
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
            <Table columns={columns} data={reports} />
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
                <span className="meta-label">Date Received</span>
                <span className="meta-value">{selectedReport.date}</span>
              </div>
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
