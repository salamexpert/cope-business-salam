import { useState } from 'react';
import { Card, CardBody, CardHeader, Table, Badge, Button, Modal } from '../components';
import { mockTickets } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './SupportTickets.css';

export default function SupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [newTicketForm, setNewTicketForm] = useState({ subject: '', description: '', priority: 'Medium' });

  // Filter tickets for current client
  const clientTickets = tickets.filter(t => t.clientId === user?.id);

  const columns = [
    { key: 'id', label: 'Ticket ID' },
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
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <Button variant="secondary" size="sm" onClick={() => setSelectedTicket(row)}>
          View
        </Button>
      )
    }
  ];

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;

    const newMessage = {
      id: selectedTicket.messages.length + 1,
      author: 'You',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      message: replyText,
      isSupport: false
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

  const handleCreateTicket = () => {
    if (!newTicketForm.subject || !newTicketForm.description) return;

    const newTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      clientId: user?.id,
      clientName: user?.name,
      subject: newTicketForm.subject,
      status: 'Open',
      lastUpdated: new Date().toISOString().slice(0, 10),
      priority: newTicketForm.priority,
      messages: [
        {
          id: 1,
          author: 'You',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          message: newTicketForm.description,
          isSupport: false
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setShowNewTicket(false);
    setNewTicketForm({ subject: '', description: '', priority: 'Medium' });
  };

  return (
    <DashboardLayout title="Support Tickets">
      <div className="tickets-page-header">
        <div>
          <h2>My Support Tickets</h2>
          <p>Need help? Create a ticket and our team will get back to you.</p>
        </div>
        <Button variant="primary" onClick={() => setShowNewTicket(true)}>
          Create New Ticket
        </Button>
      </div>

      {clientTickets.length === 0 ? (
        <Card>
          <CardBody>
            <div className="empty-state">
              <span className="empty-icon">🎟️</span>
              <h3>No Support Tickets</h3>
              <p>You haven't created any support tickets yet. If you need help, click the button above to create one.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="no-padding">
            <Table columns={columns} data={clientTickets} />
          </CardBody>
        </Card>
      )}

      {/* View Ticket Modal */}
      {selectedTicket && (
        <Modal
          onClose={() => {
            setSelectedTicket(null);
            setReplyText('');
          }}
          title="Support Ticket"
          size="lg"
        >
          <div className="ticket-view">
            {/* Ticket Header */}
            <div className="ticket-header">
              <div className="ticket-title-section">
                <h3>{selectedTicket.subject}</h3>
                <span className="ticket-id">#{selectedTicket.id}</span>
              </div>
              <Badge variant={selectedTicket.status.toLowerCase()}>
                {selectedTicket.status}
              </Badge>
            </div>

            {/* Ticket Meta */}
            <div className="ticket-meta">
              <div className="meta-item">
                <span className="meta-label">Priority</span>
                <Badge variant={selectedTicket.priority.toLowerCase()}>
                  {selectedTicket.priority}
                </Badge>
              </div>
              <div className="meta-item">
                <span className="meta-label">Last Updated</span>
                <span className="meta-value">{selectedTicket.lastUpdated}</span>
              </div>
              {selectedTicket.orderId && (
                <div className="meta-item">
                  <span className="meta-label">Related Order</span>
                  <span className="meta-value">{selectedTicket.orderId}</span>
                </div>
              )}
            </div>

            {/* Conversation */}
            <div className="conversation">
              <h4>Conversation</h4>
              <div className="messages-list">
                {selectedTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.isSupport ? 'support' : 'user'}`}
                  >
                    <div className="message-bubble">
                      <div className="message-header">
                        <span className="message-author">{msg.author}</span>
                        <span className="message-time">{msg.timestamp}</span>
                      </div>
                      <p className="message-body">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Box */}
            {selectedTicket.status === 'Open' && (
              <div className="reply-section">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your message..."
                  rows={3}
                />
                <Button variant="primary" onClick={handleSendReply} disabled={!replyText.trim()}>
                  Send Reply
                </Button>
              </div>
            )}

            {selectedTicket.status === 'Resolved' && (
              <div className="resolved-notice">
                This ticket has been resolved. If you need further assistance, please create a new ticket.
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Create Ticket Modal */}
      {showNewTicket && (
        <Modal
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
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={newTicketForm.priority}
                onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={newTicketForm.description}
                onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                placeholder="Provide details about your issue..."
                rows="5"
              />
            </div>

            <div className="form-actions">
              <Button variant="secondary" onClick={() => setShowNewTicket(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateTicket}>
                Create Ticket
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
