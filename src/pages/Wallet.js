import { useState } from 'react';
import { Card, CardBody, CardHeader, Table, Badge, Button, Modal } from '../components';
import { mockTransactions } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './Wallet.css';

export default function Wallet() {
  const { user } = useAuth();
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [balance, setBalance] = useState(parseFloat(user?.wallet_balance || 0));

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'type', label: 'Type', render: (val) => <Badge variant={val === 'Payment' ? 'default' : 'default'}>{val}</Badge> },
    {
      key: 'amount',
      label: 'Amount',
      render: (val) => (
        <span className={val >= 0 ? 'amount-positive' : 'amount-negative'}>
          {val >= 0 ? '+' : ''} ${Math.abs(val).toFixed(2)}
        </span>
      )
    }
  ];

  const handleAddFunds = () => {
    if (amount && parseFloat(amount) > 0) {
      setBalance(balance + parseFloat(amount));
      setShowAddFunds(false);
      setAmount('');
      alert(`Successfully added $${parseFloat(amount).toFixed(2)} to your wallet`);
    }
  };

  return (
    <DashboardLayout title="Wallet">
      <div className="wallet-container">
        <Card className="balance-card">
          <CardBody>
            <div className="balance-header">
              <div className="balance-info">
                <p className="balance-label">Current Balance</p>
                <h2 className="balance-amount">${balance.toFixed(2)}</h2>
              </div>
              <div className="balance-icon">💰</div>
            </div>

            <Button
              variant="primary"
              onClick={() => setShowAddFunds(true)}
              className="add-funds-btn"
            >
              Add Funds
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3>Transaction History</h3>
          </CardHeader>
          <CardBody className="no-padding">
            <Table columns={columns} data={mockTransactions} />
          </CardBody>
        </Card>
      </div>

      <Modal
        isOpen={showAddFunds}
        onClose={() => setShowAddFunds(false)}
        title="Add Funds"
        size="sm"
      >
        <div className="add-funds-form">
          <div className="form-group">
            <label htmlFor="amount">Amount to Add</label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="1"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">💳</span>
                <span>Credit Card</span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">🅿️</span>
                <span>PayPal</span>
              </label>
            </div>
          </div>

          <div className="form-group summary">
            <div className="summary-row">
              <span>Amount</span>
              <strong>${(parseFloat(amount) || 0).toFixed(2)}</strong>
            </div>
            <div className="summary-row">
              <span>Processing Fee</span>
              <strong>$0.00</strong>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>${(parseFloat(amount) || 0).toFixed(2)}</strong>
            </div>
          </div>

          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setShowAddFunds(false)} className="btn-block">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddFunds} className="btn-block">
              Add Funds
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
