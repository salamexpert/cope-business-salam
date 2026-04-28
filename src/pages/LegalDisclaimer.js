import { Link } from 'react-router-dom';
import PublicLayout from './PublicLayout';

export default function LegalDisclaimer() {
  return (
    <PublicLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>Legal Disclaimer</h1>

        <div style={{ lineHeight: '1.7', color: '#374151' }}>
          <p style={{ marginBottom: '16px' }}>
            CopeBusiness is an independent digital marketing services platform. This website is not
            affiliated with, endorsed by, sponsored by, or associated with any previous owner,
            company, organization, brand, or trademark holder that may have previously owned,
            operated, or been connected with this domain name.
          </p>

          <p style={{ marginBottom: '16px' }}>
            All content published on this website is original and created exclusively for this
            platform. Any references to third-party trademarks, marketing tools, or service
            providers are used solely for identification and informational purposes. Such references
            do not imply any affiliation, endorsement, sponsorship, or partnership.
          </p>

          <p style={{ marginBottom: '24px' }}>All trademarks, logos, and registered marks are the property of their respective owners.</p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', marginTop: '32px' }}>Intellectual Property Complaints</h2>
          <p style={{ marginBottom: '16px' }}>
            If you are a trademark owner, copyright holder, or authorized representative and believe
            that any material on this website infringes upon your rights, please{' '}
            <Link to="/contact" style={{ color: '#2563eb', textDecoration: 'underline' }}>
              contact us through our contact page
            </Link>{' '}
            immediately. We will promptly review and, where appropriate, remove the disputed material
            in accordance with applicable laws.
          </p>
          <p style={{ marginBottom: '24px' }}>By using this website, you acknowledge and agree to these terms.</p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', marginTop: '32px' }}>DMCA / IP Complaint</h2>
          <p style={{ marginBottom: '12px' }}>
            If you believe that any content on this website violates your copyright, trademark, or
            other intellectual property rights, please submit a detailed notice through our{' '}
            <Link to="/contact" style={{ color: '#2563eb', textDecoration: 'underline' }}>contact page</Link>.
          </p>
          <p style={{ marginBottom: '8px' }}>Your notice should include:</p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>Your full name and contact information</li>
            <li>Proof of ownership or authorization to act on behalf of the rights holder</li>
            <li>Exact URL(s) of the allegedly infringing material</li>
            <li>A statement made in good faith regarding your claim</li>
          </ul>
          <p>We will investigate all legitimate complaints and take appropriate action promptly.</p>
        </div>
      </div>
    </PublicLayout>
  );
}
