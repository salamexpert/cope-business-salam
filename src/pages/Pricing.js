import { Link } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import './Pricing.css';

export default function Pricing() {
  const pricingPlans = [
    {
      id: 1,
      name: 'Starter',
      description: 'Perfect for small businesses getting started',
      price: '$99',
      period: 'per service',
      features: [
        'Up to 10 services',
        'Basic analytics dashboard',
        'Email support',
        '30-day money back guarantee',
        'Access to our knowledge base',
      ],
      highlighted: false,
      cta: 'Get Started',
    },
    {
      id: 2,
      name: 'Professional',
      description: 'Ideal for growing businesses',
      price: '$499',
      period: 'per month',
      features: [
        'Unlimited services',
        'Advanced analytics & reporting',
        'Priority email & chat support',
        'Dedicated account manager',
        'Monthly strategy calls',
        '60-day money back guarantee',
        'Custom service combinations',
      ],
      highlighted: true,
      cta: 'Start Free Trial',
    },
    {
      id: 3,
      name: 'Enterprise',
      description: 'For large-scale operations',
      price: 'Custom',
      period: 'Let\'s talk',
      features: [
        'Everything in Professional',
        'Custom service packages',
        'Dedicated support team',
        'API access',
        'Weekly strategy sessions',
        'Custom integrations',
        'SLA guarantees',
      ],
      highlighted: false,
      cta: 'Contact Sales',
    },
  ];

  const comparisonFeatures = [
    { name: 'Number of Services', starter: '10', professional: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Analytics Dashboard', starter: 'Basic', professional: 'Advanced', enterprise: 'Custom' },
    { name: 'Reporting', starter: 'Monthly', professional: 'Real-time', enterprise: 'Custom' },
    { name: 'Support', starter: 'Email', professional: 'Priority 24/7', enterprise: 'Dedicated Team' },
    { name: 'Account Manager', starter: '❌', professional: '✅', enterprise: '✅' },
    { name: 'Strategy Calls', starter: '❌', professional: 'Monthly', enterprise: 'Weekly' },
    { name: 'Money Back Guarantee', starter: '30 days', professional: '60 days', enterprise: '90 days' },
    { name: 'API Access', starter: '❌', professional: '❌', enterprise: '✅' },
  ];

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="pricing-header">
        <div className="section-container">
          <h1 className="page-title">Transparent Pricing</h1>
          <p className="page-subtitle">
            Choose the perfect plan for your business needs
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pricing-section">
        <div className="section-container">
          <div className="pricing-cards">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
              >
                {plan.highlighted && (
                  <div className="pricing-badge">Most Popular</div>
                )}
                <h3 className="pricing-plan-name">{plan.name}</h3>
                <p className="pricing-plan-description">{plan.description}</p>
                <div className="pricing-amount">
                  <span className="pricing-price">{plan.price}</span>
                  <span className="pricing-period">{plan.period}</span>
                </div>
                <button className="pricing-btn">
                  {plan.cta}
                </button>
                <ul className="pricing-features">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="pricing-feature">
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="comparison-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Plan Comparison</h2>
            <p className="section-subtitle">
              See what's included in each plan
            </p>
          </div>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="comparison-feature-name">Features</th>
                  <th>Starter</th>
                  <th>Professional</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'even' : ''}>
                    <td className="comparison-feature-name">{feature.name}</td>
                    <td>{feature.starter}</td>
                    <td>{feature.professional}</td>
                    <td>{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Find answers to common questions about our pricing
            </p>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h4 className="faq-question">Can I change my plan anytime?</h4>
              <p className="faq-answer">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">What payment methods do you accept?</h4>
              <p className="faq-answer">
                We accept all major credit cards, PayPal, and bank transfers. Contact our sales team for custom payment options.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">Is there a long-term contract?</h4>
              <p className="faq-answer">
                No contracts required. All plans are month-to-month with no commitment. Cancel anytime.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">Do you offer refunds?</h4>
              <p className="faq-answer">
                Yes! We offer a 30, 60, or 90-day money-back guarantee depending on your plan, no questions asked.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">Can I get a custom plan?</h4>
              <p className="faq-answer">
                Absolutely! Contact our sales team for custom pricing and service packages tailored to your specific needs.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">What if I need more services?</h4>
              <p className="faq-answer">
                You can add additional services à la carte or upgrade to a higher plan at any time. We're flexible!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pricing-cta-section">
        <div className="section-container">
          <h2 className="cta-title">Ready to grow your business?</h2>
          <p className="cta-text">
            Start with our Professional plan and see the difference our services can make.
          </p>
          <Link to="/signup" className="cta-primary-large">
            Get Started Now
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
