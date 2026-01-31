import { Link } from 'react-router-dom';
import { Button } from '../components';
import PublicLayout from './PublicLayout';
import './Home.css';

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-headline">
              Professional Digital Marketing Services
            </h1>
            <p className="hero-subheadline">
              Grow your online presence with our proven SEO, backlinks, content writing, and social media services. Used by 500+ businesses worldwide.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="cta-primary">
                Get Started Free
              </Link>
              <Link to="/pricing" className="cta-secondary">
                View Pricing
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-placeholder">
              📈
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted-by">
        <div className="trusted-container">
          <p className="trusted-label">Trusted by leading brands and agencies</p>
          <div className="trusted-logos">
            <div className="logo-item">TechCorp</div>
            <div className="logo-item">Digital Agency</div>
            <div className="logo-item">StartupHub</div>
            <div className="logo-item">Enterprise Co</div>
            <div className="logo-item">Growth Labs</div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="services-overview">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Comprehensive digital marketing solutions for every stage of your growth
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🔍</div>
              <h3 className="service-title">SEO Optimization</h3>
              <p className="service-description">
                Improve your search rankings and organic visibility with expert SEO strategies.
              </p>
              <Link to="/services" className="service-link">
                Learn More →
              </Link>
            </div>
            <div className="service-card">
              <div className="service-icon">🔗</div>
              <h3 className="service-title">High-Quality Backlinks</h3>
              <p className="service-description">
                Build authority and boost rankings with our premium backlink services.
              </p>
              <Link to="/services" className="service-link">
                Learn More →
              </Link>
            </div>
            <div className="service-card">
              <div className="service-icon">✍️</div>
              <h3 className="service-title">Content Writing</h3>
              <p className="service-description">
                Engaging, SEO-optimized content that converts visitors into customers.
              </p>
              <Link to="/services" className="service-link">
                Learn More →
              </Link>
            </div>
            <div className="service-card">
              <div className="service-icon">📱</div>
              <h3 className="service-title">Social Media Management</h3>
              <p className="service-description">
                Grow your audience and engagement across all social platforms.
              </p>
              <Link to="/services" className="service-link">
                Learn More →
              </Link>
            </div>
          </div>
          <div className="services-cta">
            <Link to="/services" className="cta-primary">
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Simple 3-step process to get started with CopeBusiness
            </p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Sign Up</h3>
              <p className="step-description">
                Create your free account in minutes. No credit card required.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Choose Services</h3>
              <p className="step-description">
                Browse our catalog and select the services that fit your needs.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Get Results</h3>
              <p className="step-description">
                Track progress in real-time and see measurable results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose CopeBusiness?</h2>
            <p className="section-subtitle">
              Industry-leading features and support for your success
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h4 className="feature-title">Fast Delivery</h4>
              <p className="feature-text">Quick turnaround times without compromising quality.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✅</div>
              <h4 className="feature-title">Quality Guaranteed</h4>
              <p className="feature-text">100% satisfaction guarantee or your money back.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h4 className="feature-title">Transparent Reporting</h4>
              <p className="feature-text">Detailed analytics and progress tracking for every order.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <h4 className="feature-title">Expert Team</h4>
              <p className="feature-text">Experienced professionals dedicated to your growth.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <h4 className="feature-title">Secure & Safe</h4>
              <p className="feature-text">Industry best practices to protect your data and reputation.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h4 className="feature-title">Results Driven</h4>
              <p className="feature-text">We focus on metrics that matter to your business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">
              Real results from real clients
            </p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "CopeBusiness helped us improve our SEO rankings significantly. Their team is professional and responsive. Highly recommended!"
              </p>
              <p className="testimonial-author">— Sarah Johnson, Marketing Director</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "The quality of backlinks exceeded our expectations. We saw a noticeable improvement in our search rankings within 2 months."
              </p>
              <p className="testimonial-author">— Michael Chen, CEO of TechCorp</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Outstanding service and support. The team went above and beyond to deliver exceptional results for our campaign."
              </p>
              <p className="testimonial-author">— Lisa Rodriguez, Agency Owner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3 className="stat-number">10,000+</h3>
              <p className="stat-label">Orders Completed</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">500+</h3>
              <p className="stat-label">Happy Clients</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">98%</h3>
              <p className="stat-label">Satisfaction Rate</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">5+</h3>
              <p className="stat-label">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to grow your business?</h2>
            <p className="cta-text">
              Join hundreds of successful businesses using CopeBusiness to achieve their digital marketing goals.
            </p>
            <Link to="/signup" className="cta-primary-large">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
