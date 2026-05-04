import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Home.css';


const PackageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" x2="12" y1="22" y2="12" />
  </svg>
);

const CreditCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 17h4V5H2v12h3" />
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const RotateIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);


function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <PackageIcon />
          </div>
          <span className="logo-text">RentEase</span>
        </Link>

        {}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#features" className="nav-link">Features</a>
        </div>

        {}
        <div className="navbar-auth">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>

        {}
        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
          <a href="#how-it-works" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>How It Works</a>
          <a href="#features" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Features</a>
          <div className="mobile-auth">
            <Link to="/login" className="btn btn-outline btn-full">Login</Link>
            <Link to="/register" className="btn btn-primary btn-full">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}


function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Trusted by 10,000+ renters</span>
          </div>
          <h1 className="hero-title">
            Rent Anything You Need,<br />
            <span className="hero-title-highlight">Anytime, Anywhere</span>
          </h1>
          <p className="hero-subtitle">
            A secure platform to rent and lend items with trust, insurance, and easy payments. 
            Save money, reduce waste, and get what you need when you need it.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary btn-lg">
              <span>Browse Items</span>
              <ArrowRightIcon />
            </Link>
            <Link to="/vendor/register" className="btn btn-outline btn-lg">
              Become a Vendor
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">5,000+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Vendors</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Happy Renters</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-wrapper">
            <div className="hero-image-bg"></div>
            <div className="hero-categories">
              {[
                { icon: '📷', label: 'Cameras', color: '#4F46E5' },
                { icon: '🚗', label: 'Vehicles', color: '#22C55E' },
                { icon: '🏠', label: 'Furniture', color: '#F59E0B' },
                { icon: '🎮', label: 'Electronics', color: '#EC4899' },
                { icon: '🛠️', label: 'Tools', color: '#6366F1' },
                { icon: '👔', label: 'Fashion', color: '#14B8A6' },
              ].map((item) => (
                <div key={item.label} className="category-card" style={{ '--accent': item.color } as React.CSSProperties}>
                  <span className="category-icon">{item.icon}</span>
                  <span className="category-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function FeaturesSection() {
  const features = [
    {
      icon: <CreditCardIcon />,
      title: 'Secure Payments',
      description: 'Your transactions are protected with bank-level security and encryption.',
      color: '#4F46E5',
    },
    {
      icon: <UsersIcon />,
      title: 'Verified Vendors',
      description: 'All vendors are verified and reviewed by our community for your peace of mind.',
      color: '#22C55E',
    },
    {
      icon: <RotateIcon />,
      title: 'Easy Returns',
      description: 'Hassle-free returns with flexible policies. We make renting simple.',
      color: '#F59E0B',
    },
    {
      icon: <TruckIcon />,
      title: 'Fast Delivery',
      description: 'Quick pickup or delivery options available for your convenience.',
      color: '#EC4899',
    },
  ];

  return (
    <section id="features" className="features">
      <div className="features-container">
        <div className="section-header">
          <h2 className="section-title">Why Choose RentEase?</h2>
          <p className="section-subtitle">
            We've built the most reliable rental marketplace with features designed for your convenience.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function HowItWorksSection() {
  const steps = [
    {
      icon: <SearchIcon />,
      number: '01',
      title: 'Search Items',
      description: 'Browse our wide catalog of products. Filter by category, price, or location to find exactly what you need.',
    },
    {
      icon: <CheckCircleIcon />,
      number: '02',
      title: 'Rent & Pay Securely',
      description: 'Select your rental dates, review the terms, and complete your booking with our secure payment system.',
    },
    {
      icon: <RotateIcon />,
      number: '03',
      title: 'Return or Extend',
      description: 'Return the item when done or easily extend your rental period. Flexible options for your needs.',
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="hiw-container">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Renting has never been easier. Get started in three simple steps.
          </p>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={step.number} className="step-card">
              {index < steps.length - 1 && <div className="step-connector"></div>}
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function CTASection() {
  return (
    <section className="cta">
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Renting?</h2>
          <p className="cta-subtitle">
            Join thousands of smart renters who save money and reduce waste. 
            Sign up now and get access to exclusive deals!
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-white btn-lg">
              <span>Start Renting</span>
              <ArrowRightIcon />
            </Link>
            <Link to="/vendor/register" className="btn btn-outline-white btn-lg">
              List Your Items
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <PackageIcon />
              </div>
              <span className="logo-text">RentEase</span>
            </Link>
            <p className="footer-description">
              The modern marketplace for renting anything. Connect with trusted vendors 
              and find what you need, when you need it.
            </p>
          </div>

          {}
          <div className="footer-links">
            <h4 className="footer-heading">Quick Links</h4>
            <ul>
              <li><Link to="/products">Browse Products</Link></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><Link to="/register">Become a Vendor</Link></li>
            </ul>
          </div>

          {}
          <div className="footer-links">
            <h4 className="footer-heading">Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>

          {}
          <div className="footer-links">
            <h4 className="footer-heading">Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} RentEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
