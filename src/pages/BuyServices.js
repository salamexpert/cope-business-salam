import { useState } from 'react';
import { Card, CardBody, Button, Modal } from '../components';
import { mockServices } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './BuyServices.css';

export default function BuyServices() {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const walletBalance = parseFloat(user?.wallet_balance || 0);

  const handlePurchaseClick = (service, plan) => {
    setSelectedService(service);
    setSelectedPlan(plan);
  };

  const closeModal = () => {
    setSelectedService(null);
    setSelectedPlan(null);
  };

  const handleConfirm = () => {
    closeModal();
    alert(`Order placed successfully for ${selectedService.name} - ${selectedPlan.tier} plan`);
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
                <strong>${(walletBalance - selectedPlan.price).toFixed(2)}</strong>
              </div>
            </div>

            <div className="modal-actions">
              <Button variant="secondary" onClick={closeModal} className="btn-block">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirm} className="btn-block">
                Confirm Purchase
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
