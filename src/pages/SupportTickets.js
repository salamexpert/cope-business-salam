import { useState, useEffect } from 'react';
import { Card, CardBody, Table, Badge, Button, Modal } from '../components';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './SupportTickets.css';

export default function SupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [newTicketForm, setNewTicketForm] = useState({ subject: '', description: '', priority: 'Medium' });

  useEffect(() => {
    if (user?.id) fetchTickets();
  }, [user?.id]);

  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tickets')
      .select('*, ticket_messages(*)')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tickets:', error);
    } else {
      const mapped = data.map(t => ({
        ...t,
        lastUpdated: new Date(t.last_updated || t.created_at).toLocaleDateString(),
        messages: (t.ticket_messages || [])
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map(m => ({
            ...m,
            timestamp: new Date(m.created_at).toLocaleString(),
          }))
      }));
      setTickets(mapped);
    }
    setLoading(false);
  };

  const columns = [
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

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;

    const { error } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: selectedTicket.id,
        author: user.name || 'You',
        message: replyText,
        is_support: false
      });

    if (error) {
      console.error('Error sending reply:', error);
      return;
    }

    await supabase
      .from('tickets')
      .update({ last_updated: new Date().toISOString() })
      .eq('id', selectedTicket.id);

    setReplyText('');
    fetchTickets();

    // Refresh selected ticket
    const { data } = await supabase
      .from('tickets')
      .select('*, ticket_messages(*)')
      .eq('id', selectedTicket.id)
      .single();

    if (data) {
      const mapped = {
        ...data,
        lastUpdated: new Date(data.last_updated || data.created_at).toLocaleDateString(),
        messages: (data.ticket_messages || [])
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map(m => ({
            ...m,
            timestamp: new Date(m.created_at).toLocaleString(),
          }))
      };
      setSelectedTicket(mapped);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicketForm.subject || !newTicketForm.description) return;

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        client_id: user.id,
        subject: newTicketForm.subject,
        status: 'Open',
        priority: newTicketForm.priority,
        last_updated: new Date().toISOString()
      })
      .select()
      .single();

    if (ticketError) {
      console.error('Error creating ticket:', ticketError);
      return;
    }

    await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: ticket.id,
        author: user.name || 'You',
        message: newTicketForm.description,
        is_support: false
      });

    setShowNewTicket(false);
    setNewTicketForm({ subject: '', description: '', priority: 'Medium' });
    fetchTickets();
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

      {loading ? (
        <Card>
          <CardBody>
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading tickets...</div>
          </CardBody>
        </Card>
      ) : tickets.length === 0 ? (
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
            <Table columns={columns} data={tickets} />
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
            <div className="ticket-header">
              <div className="ticket-title-section">
                <h3>{selectedTicket.subject}</h3>
              </div>
              <Badge variant={selectedTicket.status.toLowerCase()}>
                {selectedTicket.status}
              </Badge>
            </div>

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
            </div>

            <div className="conversation">
              <h4>Conversation</h4>
              <div className="messages-list">
                {selectedTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.is_support ? 'support' : 'user'}`}
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
