import { Link } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import './HowItWorks.css';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Create Your Account',
      description: 'Sign up for free in less than 2 minutes. No credit card required.',
      details: [
        'Enter your email and password',
        'Verify your email address',
        'Complete your profile',
        'Start exploring services',
      ],
    },
    {
      number: '2',
      title: 'Browse & Choose Services',
      description: 'Explore our catalog of 50+ services across multiple categories.',
      details: [
        'Filter by service category',
        'Read detailed service descriptions',
        'Check pricing and packages',
        'See customer reviews and ratings',
      ],
    },
    {
      number: '3',
      title: 'Place Your Order',
      description: 'Order any service with just a few clicks.',
      details: [
        'Select your service tier',
        'Add order details and requirements',
        'Choose payment method',
        'Complete your purchase',
      ],
    },
    {
      number: '4',
      title: 'Track Progress',
      description: 'Monitor your order in real-time with our dashboard.',
      details: [
        'View order status updates',
        'Access detailed analytics',
        'Communicate with your provider',
        'Download reports and deliverables',
      ],
    },
    {
      number: '5',
      title: 'Receive Results',
      description: 'Get high-quality deliverables on schedule.',
      details: [
        'Download completed work',
        'Review detailed reports',
        'Request revisions if needed',
        'Leave feedback for the provider',
      ],
    },
    {
      number: '6',
      title: 'Measure Success',
      description: 'Track the impact of your services with metrics that matter.',
      details: [
        'Monitor ranking improvements',
        'Track traffic increases',
        'View conversion metrics',
        'Get monthly reports',
      ],
    },
  ];

  const faqItems = [
    {
      question: 'How long does it take to see results?',
      answer: 'Results vary by service type. SEO and content services typically show results within 4-8 weeks. Social media and backlink services can show faster results. We provide monthly reports to track progress.',
    },
    {
      question: 'What if I\'m not satisfied with the results?',
      answer: 'We offer a 30-60 day money-back guarantee depending on your plan. If you\'re not satisfied, contact our support team and we\'ll issue a full refund.',
    },
    {
      question: 'Can I modify my order after placing it?',
      answer: 'Yes! You can modify your order details, timeline, and requirements through your dashboard. Contact our support team for assistance.',
    },
    {
      question: 'How do I communicate with providers?',
      answer: 'Our platform includes built-in messaging. You can communicate directly with service providers through your order page. We also offer phone and email support.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, PayPal, and bank transfers. Enterprise customers can arrange custom payment terms.',
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel before work starts. If work has begun, cancellation fees may apply. Check our refund policy for details.',
    },
    {
      question: 'Do you offer bulk discounts?',
      answer: 'Yes! We offer discounts for orders of 10+ services or long-term monthly plans. Contact our sales team for custom pricing.',
    },
    {
      question: 'What\'s included in the analytics?',
      answer: 'Detailed analytics include keyword rankings, traffic data, backlink metrics, conversion rates, and custom reports based on your service type.',
    },
  ];

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="how-header">
        <div className="section-container">
          <h1 className="page-title">How It Works</h1>
          <p className="page-subtitle">
            Simple 6-step process to grow your business
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="process-section">
        <div className="section-container">
          <div className="timeline">
            {steps.map((step) => (
              <div key={step.number} className="timeline-item">
                <div className="timeline-marker">
                  <div className="step-circle">{step.number}</div>
                </div>
                <div className="timeline-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                  <ul className="step-details">
                    {step.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Process Works */}
      <section className="why-process">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Our Process Works</h2>
            <p className="section-subtitle">
              Proven methodology trusted by 500+ businesses
            </p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h4 className="benefit-title">Goal-Oriented</h4>
              <p className="benefit-text">
                We focus on your specific business goals and provide services tailored to achieve them.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h4 className="benefit-title">Data-Driven</h4>
              <p className="benefit-text">
                Every service is backed by analytics and metrics to ensure measurable results.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h4 className="benefit-title">Fast Turnaround</h4>
              <p className="benefit-text">
                Quick delivery without compromising on quality. Most services completed within days.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h4 className="benefit-title">Dedicated Support</h4>
              <p className="benefit-text">
                Our support team is available 24/7 to answer questions and assist with your orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison with Alternatives */}
      <section className="comparison-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose CopeBusiness?</h2>
            <p className="section-subtitle">
              See how we compare to traditional agencies
            </p>
          </div>
          <div className="comparison-grid">
            <div className="comparison-item">
              <h4 className="comparison-label">CopeBusiness</h4>
              <ul className="comparison-list">
                <li>✓ Affordable pricing</li>
                <li>✓ Quick setup</li>
                <li>✓ Flexible services</li>
                <li>✓ 24/7 support</li>
                <li>✓ No contracts</li>
                <li>✓ Transparent pricing</li>
              </ul>
            </div>
            <div className="comparison-item highlight">
              <h4 className="comparison-label">Traditional Agencies</h4>
              <ul className="comparison-list">
                <li>✗ High costs</li>
                <li>✗ Long onboarding</li>
                <li>✗ Limited flexibility</li>
                <li>✗ Limited support</li>
                <li>✗ Long-term contracts</li>
                <li>✗ Hidden fees</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Find answers to common questions
            </p>
          </div>
          <div className="faq-container">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-item">
                <h4 className="faq-question">{item.question}</h4>
                <p className="faq-answer">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="process-cta-section">
        <div className="section-container">
          <h2 className="cta-title">Ready to get started?</h2>
          <p className="cta-text">
            Join hundreds of businesses that have already achieved their goals with CopeBusiness.
          </p>
          <Link to="/signup" className="cta-primary-large">
            Create Free Account
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
