import { useState } from 'react';
import { Card, CardBody, CardHeader, Table, Badge, Button, Modal } from '../components';
import { mockTickets } from '../data/mockData';
import DashboardLayout from './DashboardLayout';
import './SupportTickets.css';

export default function SupportTickets() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [newTicketForm, setNewTicketForm] = useState({ subject: '', description: '' });

  const columns = [
    { key: 'id', label: 'Ticket ID', width: '120px' },
    { key: 'subject', label: 'Subject' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge variant={val.toLowerCase()}>{val}</Badge>
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => <Badge variant={val.toLowerCase()}>{val}</Badge>
    },
    { key: 'lastUpdated', label: 'Last Updated' },
    {
      key: 'id',
      label: 'Action',
      render: (val, row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedTicket(row)}
        >
          View
        </Button>
      )
    }
  ];

  const handleSendReply = () => {
    if (replyText.trim()) {
      alert(`Reply sent to ticket ${selectedTicket.id}`);
      setReplyText('');
    }
  };

  const handleCreateTicket = () => {
    if (newTicketForm.subject && newTicketForm.description) {
      alert(`Ticket created: ${newTicketForm.subject}`);
      setShowNewTicket(false);
      setNewTicketForm({ subject: '', description: '' });
    }
  };

  return (
    <DashboardLayout title="Support Tickets">
      <div className="tickets-header">
        <h2>My Support Tickets</h2>
        <Button variant="primary" onClick={() => setShowNewTicket(true)}>
          Create New Ticket
        </Button>
      </div>

      <Card>
        <CardBody className="no-padding">
          <Table columns={columns} data={mockTickets} />
        </CardBody>
      </Card>

      <Modal
        isOpen={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
        title="Support Ticket"
        size="lg"
      >
        {selectedTicket && (
          <div className="ticket-details">
            <div className="ticket-header-info">
              <div>
                <h4>{selectedTicket.subject}</h4>
                <p className="ticket-id">Ticket ID: {selectedTicket.id}</p>
              </div>
              <Badge variant={selectedTicket.status.toLowerCase()}>
                {selectedTicket.status}
              </Badge>
            </div>

            <div className="ticket-meta">
              <div className="meta-item">
                <span className="meta-label">Priority:</span>
                <Badge variant={selectedTicket.priority.toLowerCase()}>
                  {selectedTicket.priority}
                </Badge>
              </div>
              <div className="meta-item">
                <span className="meta-label">Last Updated:</span>
                <span>{selectedTicket.lastUpdated}</span>
              </div>
            </div>

            <div className="messages-container">
              <h4>Conversation</h4>
              <div className="messages-list">
                {selectedTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.isSupport ? 'support-message' : 'user-message'}`}
                  >
                    <div className="message-header">
                      <strong className="message-author">{msg.author}</strong>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>
                    <p className="message-content">{msg.message}</p>
                  </div>
                ))}
              </div>

              <div className="reply-box">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  className="reply-textarea"
                />
                <Button
                  variant="primary"
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                >
                  Send Reply
                </Button>
              </div>
            </div>

            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setSelectedTicket(null)} className="btn-block">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showNewTicket}
        onClose={() => setShowNewTicket(false)}
        title="Create Support Ticket"
        size="md"
      >
        <div className="new-ticket-form">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              value={newTicketForm.subject}
              onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
              placeholder="Briefly describe your issue"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newTicketForm.description}
              onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
              placeholder="Provide details about your issue"
              rows="5"
            />
          </div>

          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setShowNewTicket(false)} className="btn-block">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateTicket} className="btn-block">
              Create Ticket
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
