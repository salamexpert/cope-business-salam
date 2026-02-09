import { useState } from 'react';
import { Card, CardBody, Button, Modal } from '../components';
import { mockServices } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './BuyServices.css';

export default function BuyServices() {
  const { user, updateProfile } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState(null);

  const walletBalance = parseFloat(user?.wallet_balance || 0);

  const handlePurchaseClick = (service, plan) => {
    setSelectedService(service);
    setSelectedPlan(plan);
    setMessage(null);
  };

  const closeModal = () => {
    setSelectedService(null);
    setSelectedPlan(null);
    setMessage(null);
  };

  const handleConfirm = async () => {
    if (walletBalance < selectedPlan.price) {
      setMessage({ type: 'error', text: 'Insufficient wallet balance. Please add funds first.' });
      return;
    }

    setPurchasing(true);
    setMessage(null);

    // Create order in DB
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        client_id: user.id,
        service_name: selectedService.name,
        plan: selectedPlan.tier,
        date: new Date().toISOString().slice(0, 10),
        price: selectedPlan.price,
        status: 'Pending',
        progress: 0
      });

    if (orderError) {
      console.error('Error creating order:', orderError);
      setMessage({ type: 'error', text: 'Failed to place order. Please try again.' });
      setPurchasing(false);
      return;
    }

    // Deduct from wallet
    const newBalance = walletBalance - selectedPlan.price;
    const { error: walletError } = await updateProfile({ wallet_balance: newBalance });

    if (walletError) {
      console.error('Error updating wallet:', walletError);
    }

    setPurchasing(false);
    closeModal();
    alert(`Order placed successfully for ${selectedService.name} - ${selectedPlan.tier} plan!`);
  };

  return (
    <DashboardLayout title="Buy Services">
      <div className="services-grid">
        {mockServices.map((service) => (
          <Card key={service.id} className="service-card">
            <div className="service-image">
              <img src={service.image} alt={service.name} />
              <span className="category-badge">{service.category}</span>
            </div>

            <CardBody>
              <h3 className="service-title">{service.name}</h3>
              <p className="service-description">{service.description}</p>

              <div className="plans-container">
                {service.plans.map((plan, idx) => (
                  <div key={idx} className="plan-option">
                    <div className="plan-header">
                      <h4 className="plan-tier">{plan.tier}</h4>
                      <span className="plan-price">${plan.price}</span>
                    </div>
                    <p className="plan-description">{plan.description}</p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="purchase-btn"
                      onClick={() => handlePurchaseClick(service, plan)}
                    >
                      Purchase
                    </Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={selectedService !== null}
        onClose={closeModal}
        title="Confirm Purchase"
        size="sm"
      >
        {selectedService && selectedPlan && (
          <div className="purchase-modal">
            <div className="modal-section">
              <h4>Order Summary</h4>
              <div className="summary-item">
                <span>Service:</span>
                <strong>{selectedService.name}</strong>
              </div>
              <div className="summary-item">
                <span>Plan:</span>
                <strong>{selectedPlan.tier}</strong>
              </div>
              <div className="summary-item">
                <span>Price:</span>
                <strong>${selectedPlan.price.toFixed(2)}</strong>
              </div>
            </div>

            <div className="modal-section">
              <h4>Wallet Balance</h4>
              <div className="summary-item">
                <span>Current Balance:</span>
                <strong>${walletBalance.toFixed(2)}</strong>
              </div>
              <div className="summary-item total">
                <span>Balance After Order:</span>
                <strong style={{ color: walletBalance < selectedPlan.price ? '#ef4444' : undefined }}>
                  ${(walletBalance - selectedPlan.price).toFixed(2)}
                </strong>
              </div>
            </div>

            {message && (
              <div style={{ padding: '0.75rem', borderRadius: '8px', background: message.type === 'error' ? '#fef2f2' : '#f0fdf4', color: message.type === 'error' ? '#dc2626' : '#16a34a', fontSize: '0.875rem' }}>
                {message.text}
              </div>
            )}

            <div className="modal-actions">
              <Button variant="secondary" onClick={closeModal} className="btn-block">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirm} className="btn-block" disabled={purchasing}>
                {purchasing ? 'Processing...' : 'Confirm Purchase'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
