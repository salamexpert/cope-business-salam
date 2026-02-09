import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Table, Badge, Button, Modal } from '../../components';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';
import './AdminReports.css';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [clients, setClients] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newReport, setNewReport] = useState({
    clientId: '',
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchReports();
    fetchClients();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reports')
      .select('*, profiles!client_id(name, email)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
    } else {
      const mapped = data.map((r, index) => ({
        ...r,
        displayId: `RPT-${String(data.length - index).padStart(3, '0')}`,
        clientName: r.profiles?.name || 'Unknown',
        clientEmail: r.profiles?.email || ''
      }));
      setReports(mapped);
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

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const handleCreateReport = async () => {
    const client = clients.find(c => c.id === newReport.clientId);
    if (!client || !newReport.title || !newReport.content) return;

    const { error } = await supabase
      .from('reports')
      .insert({
        client_id: client.id,
        title: newReport.title,
        content: newReport.content,
        status: 'Draft',
        date: new Date().toISOString().slice(0, 10)
      });

    if (error) {
      console.error('Error creating report:', error);
      return;
    }

    setShowCreateModal(false);
    setNewReport({ clientId: '', title: '', content: '' });
    fetchReports();
  };

  const handleSendReport = async (reportId) => {
    const { error } = await supabase
      .from('reports')
      .update({ status: 'Sent' })
      .eq('id', reportId);

    if (error) {
      console.error('Error sending report:', error);
      return;
    }

    const updatedReports = reports.map(r => {
      if (r.id === reportId) {
        return { ...r, status: 'Sent' };
      }
      return r;
    });
    setReports(updatedReports);

    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({ ...selectedReport, status: 'Sent' });
    }
  };

  const columns = [
    { key: 'displayId', label: 'Report ID' },
    { key: 'clientName', label: 'Client' },
    { key: 'title', label: 'Title' },
    { key: 'date', label: 'Date' },
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
          <Button variant="secondary" size="sm" onClick={() => handleViewReport(row)}>
            View
          </Button>
          {row.status === 'Draft' && (
            <Button variant="primary" size="sm" onClick={() => handleSendReport(row.id)}>
              Send
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="Reports">
      <Card>
        <CardHeader>
          <div className="reports-header">
            <h3>All Reports</h3>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create Report
            </Button>
          </div>
        </CardHeader>
        <CardBody className="no-padding">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading reports...</div>
          ) : reports.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>No reports found.</div>
          ) : (
            <Table columns={columns} data={reports} />
          )}
        </CardBody>
      </Card>

      {showCreateModal && (
        <Modal
          title="Create New Report"
          onClose={() => setShowCreateModal(false)}
          size="lg"
        >
          <div className="create-report-form">
            <div className="form-group">
              <label>Client</label>
              <select
                value={newReport.clientId}
                onChange={(e) => setNewReport({ ...newReport, clientId: e.target.value })}
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
              <label>Report Title</label>
              <input
                type="text"
                value={newReport.title}
                onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                placeholder="e.g., Monthly Progress Report - January 2024"
              />
            </div>

            <div className="form-group">
              <label>Report Content</label>
              <textarea
                value={newReport.content}
                onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                placeholder="Write your report content here..."
                rows={10}
              />
            </div>

            <div className="form-actions">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateReport}>
                Create Report
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showViewModal && selectedReport && (
        <Modal
          title={selectedReport.title}
          onClose={() => {
            setShowViewModal(false);
            setSelectedReport(null);
          }}
          size="lg"
        >
          <div className="report-view">
            <div className="report-meta">
              <div className="meta-item">
                <span className="meta-label">Report ID:</span>
                <span className="meta-value">{selectedReport.displayId}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Client:</span>
                <span className="meta-value">{selectedReport.clientName}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Email:</span>
                <span className="meta-value">{selectedReport.clientEmail}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Date:</span>
                <span className="meta-value">{selectedReport.date}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Status:</span>
                <Badge variant={selectedReport.status.toLowerCase()}>
                  {selectedReport.status}
                </Badge>
              </div>
            </div>

            <div className="report-content">
              <h4>Report Content</h4>
              <div className="content-box">
                {selectedReport.content}
              </div>
            </div>

            {selectedReport.status === 'Draft' && (
              <div className="report-actions">
                <Button variant="primary" onClick={() => handleSendReport(selectedReport.id)}>
                  Send to Client
                </Button>
              </div>
            )}

            {selectedReport.status === 'Sent' && (
              <div className="sent-notice">
                This report has been sent to {selectedReport.clientEmail}
              </div>
            )}
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
