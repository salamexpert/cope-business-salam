import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Modal } from '../components';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './Wallet.css';

export default function Wallet() {
  const { user, updateProfile } = useAuth();
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const balance = parseFloat(user?.wallet_balance || 0);

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setProcessing(true);
    const newBalance = balance + parseFloat(amount);
    const result = await updateProfile({ wallet_balance: newBalance });

    setProcessing(false);
    if (result.success) {
      setShowAddFunds(false);
      setAmount('');
      alert(`Successfully added $${parseFloat(amount).toFixed(2)} to your wallet`);
    } else {
      alert('Failed to add funds. Please try again.');
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
          <CardBody>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              <p>Transaction history will be available soon.</p>
            </div>
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
            <Button variant="primary" onClick={handleAddFunds} className="btn-block" disabled={processing}>
              {processing ? 'Processing...' : 'Add Funds'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
