import { useState } from 'react';
import { Card, CardHeader, CardBody, Table, Badge, Button, Modal } from '../../components';
import { mockTickets } from '../../data/mockData';
import AdminLayout from './AdminLayout';
import './AdminTickets.css';

export default function AdminTickets() {
  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
    setReplyText('');
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;

    const newMessage = {
      id: selectedTicket.messages.length + 1,
      author: 'Admin',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      message: replyText,
      isSupport: true
    };

    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          messages: [...t.messages, newMessage],
          lastUpdated: new Date().toISOString().slice(0, 10)
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage]
    });
    setReplyText('');
  };

  const handleStatusChange = (ticketId, newStatus) => {
    const updatedTickets = tickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: newStatus, lastUpdated: new Date().toISOString().slice(0, 10) };
      }
      return t;
    });
    setTickets(updatedTickets);

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  const filteredTickets = statusFilter === 'all'
    ? tickets
    : tickets.filter(t => t.status.toLowerCase() === statusFilter);

  const columns = [
    { key: 'id', label: 'Ticket ID' },
    { key: 'clientName', label: 'Client' },
    { key: 'subject', label: 'Subject' },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => <Badge variant={val.toLowerCase()}>{val}</Badge>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge variant={val.toLowerCase()}>{val}</Badge>
    },
    { key: 'lastUpdated', label: 'Last Updated' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button variant="secondary" size="sm" onClick={() => handleViewTicket(row)}>
          View
        </Button>
      )
    }
  ];

  return (
    <AdminLayout title="Support Tickets">
      <Card>
        <CardHeader>
          <div className="tickets-header">
            <h3>All Tickets</h3>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All ({tickets.length})
              </button>
              <button
                className={`filter-btn ${statusFilter === 'open' ? 'active' : ''}`}
                onClick={() => setStatusFilter('open')}
              >
                Open ({tickets.filter(t => t.status === 'Open').length})
              </button>
              <button
                className={`filter-btn ${statusFilter === 'resolved' ? 'active' : ''}`}
                onClick={() => setStatusFilter('resolved')}
              >
                Resolved ({tickets.filter(t => t.status === 'Resolved').length})
              </button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="no-padding">
          <Table columns={columns} data={filteredTickets} />
        </CardBody>
      </Card>

      {showModal && selectedTicket && (
        <Modal
          title={`Ticket: ${selectedTicket.subject}`}
          onClose={() => {
            setShowModal(false);
            setSelectedTicket(null);
          }}
          size="lg"
        >
          <div className="ticket-detail">
            <div className="ticket-meta">
              <div className="meta-row">
                <span className="meta-label">Ticket ID:</span>
                <span className="meta-value">{selectedTicket.id}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Client:</span>
                <span className="meta-value">{selectedTicket.clientName}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Priority:</span>
                <Badge variant={selectedTicket.priority.toLowerCase()}>
                  {selectedTicket.priority}
                </Badge>
              </div>
              <div className="meta-row">
                <span className="meta-label">Status:</span>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                  className="status-select"
                >
                  <option value="Open">Open</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="ticket-messages">
              <h4>Conversation</h4>
              <div className="messages-list">
                {selectedTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.isSupport ? 'support' : 'client'}`}
                  >
                    <div className="message-header">
                      <span className="message-author">{msg.author}</span>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>
                    <div className="message-body">{msg.message}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ticket-reply">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
              />
              <Button variant="primary" onClick={handleSendReply}>
                Send Reply
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
