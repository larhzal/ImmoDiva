import { useState } from "react";
import Navbar from "../../components/layout/NavbarLanding";

const plans = [
  {
    id: "gratuit",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    name: "Gratuit",
    tagline: "Pour découvrir la plateforme",
    price: null,
    priceLabel: "Gratuit",
    features: [
      "2 annonces/mois",
      "Accès aux outils de base",
      "Support email",
    ],
    cta: "Commencer gratuitement",
    ctaStyle: "dark",
    borderColor: "#e2e8f0",
    accentColor: "#1e293b",
    iconBg: "#f1f5f9",
    iconColor: "#475569",
    popular: false,
  },
  {
    id: "starter",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    name: "Starter",
    tagline: "Pour les indépendants et petites agences",
    price: "199",
    priceLabel: null,
    features: [
      "5 annonces/mois",
      "Badge vérifié sur les annonces",
      "Statistiques de base",
      "Support prioritaire",
    ],
    cta: "Souscrire",
    ctaStyle: "blue",
    borderColor: "#93c5fd",
    accentColor: "#3b82f6",
    iconBg: "#eff6ff",
    iconColor: "#3b82f6",
    popular: false,
  },
  {
    id: "pro",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    name: "Pro",
    tagline: "Pour les agences en croissance",
    price: "499",
    priceLabel: null,
    features: [
      "20 annonces/mois",
      "Badge vérifié premium",
      "Statistiques avancées",
      "Annonces boostées incluses",
      "Support dédié",
    ],
    cta: "Souscrire",
    ctaStyle: "orange",
    borderColor: "#f59e0b",
    accentColor: "#f59e0b",
    iconBg: "#fffbeb",
    iconColor: "#f59e0b",
    popular: true,
  },
  {
    id: "premium",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      </svg>
    ),
    name: "Premium",
    tagline: "Pour les grandes agences",
    price: "999",
    priceLabel: null,
    features: [
      "Annonces illimitées",
      "Page agence personnalisée",
      "Mise en avant homepage",
      "Account manager dédié",
      "API accès",
    ],
    cta: "Souscrire",
    ctaStyle: "purple",
    borderColor: "#a78bfa",
    accentColor: "#7c3aed",
    iconBg: "#f5f3ff",
    iconColor: "#7c3aed",
    popular: false,
  },
];

const steps = [
  {
    number: 1,
    title: "Choisissez votre forfait",
    desc: "Sélectionnez le plan adapté à votre activité et cliquez sur Souscrire.",
  },
  {
    number: 2,
    title: "Effectuez le virement",
    desc: "Virez le montant mensuel sur notre compte RIB : CIH 230 640 0120080087370102 89",
  },
  {
    number: 3,
    title: "Téléversez le justificatif",
    desc: "Joignez votre preuve de virement. L'activation se fait sous 24h ouvrées.",
  },
];

const ctaStyles = {
  dark: {
    background: "#1e293b",
    color: "#fff",
  },
  blue: {
    background: "#3b82f6",
    color: "#fff",
  },
  orange: {
    background: "#f59e0b",
    color: "#fff",
  },
  purple: {
    background: "#7c3aed",
    color: "#fff",
  },
};

export default function Tarifs() {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <div style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif", margin: 0, padding: 0 }}>
        <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .tarifs-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          padding: 80px 24px 100px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .tarifs-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 60% 40%, rgba(245,158,11,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 20% 80%, rgba(59,130,246,0.06) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(245,158,11,0.15);
          border: 1px solid rgba(245,158,11,0.3);
          color: #fbbf24;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 20px;
          border-radius: 8px;
          margin-bottom: 32px;
          letter-spacing: 0.01em;
        }

        .hero-title {
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin: 0 0 8px;
        }

        .hero-title-accent {
          color: #f59e0b;
          display: block;
        }

        .hero-subtitle {
          color: #94a3b8;
          font-size: 17px;
          line-height: 1.7;
          max-width: 520px;
          margin: 20px auto 0;
        }

        .plans-section {
          background: #f8fafc;
          padding: 60px 24px 80px;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .plan-card {
          background: #fff;
          border-radius: 16px;
          padding: 32px 28px;
          border: 2px solid;
          position: relative;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: default;
        }

        .plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .popular-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: #f59e0b;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 5px 14px;
          border-radius: 20px;
          white-space: nowrap;
          text-transform: uppercase;
        }

        .plan-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .plan-name {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .plan-tagline {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 20px;
          line-height: 1.5;
        }

        .plan-price {
          font-size: 40px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
          line-height: 1;
        }

        .plan-price span {
          font-size: 16px;
          font-weight: 500;
          color: #64748b;
        }

        .plan-price-free {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .plan-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 20px 0;
        }

        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .plan-features li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14.5px;
          color: #334155;
          line-height: 1.4;
        }

        .check-icon {
          width: 18px;
          height: 18px;
          color: #22c55e;
          flex-shrink: 0;
        }

        .plan-cta {
          width: 100%;
          padding: 14px 20px;
          border-radius: 10px;
          border: none;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s ease, transform 0.15s ease;
          font-family: inherit;
        }

        .plan-cta:hover {
          opacity: 0.9;
          transform: scale(1.01);
        }

        .steps-section {
          background: #fff;
          padding: 80px 24px;
          text-align: center;
        }

        .steps-title {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 56px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 40px;
          max-width: 900px;
          margin: 0 auto;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .step-number {
          width: 52px;
          height: 52px;
          background: #f59e0b;
          color: #fff;
          font-size: 22px;
          font-weight: 800;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-title {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .step-desc {
          font-size: 14px;
          color: #64748b;
          line-height: 1.65;
          margin: 0;
          max-width: 240px;
        }

        @media (max-width: 900px) {
          .plans-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .plans-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Hero */}
      <section className="tarifs-hero">
        <div className="hero-badge">Tarifs simples et transparents</div>
        <h1 className="hero-title">
          Publiez vos annonces
          <span className="hero-title-accent">professionnelles</span>
        </h1>
        <p className="hero-subtitle">
          Des forfaits adaptés à chaque structure — indépendants, agences et grands comptes.
          Paiement mensuel, sans engagement.
        </p>
      </section>

      {/* Plans */}
      <section className="plans-section">
        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="plan-card"
              style={{ borderColor: plan.borderColor }}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.popular && (
                <div className="popular-badge">LE PLUS POPULAIRE</div>
              )}

              <div
                className="plan-icon"
                style={{ background: plan.iconBg, color: plan.iconColor }}
              >
                {plan.icon}
              </div>

              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-tagline">{plan.tagline}</p>

              {plan.price ? (
                <div className="plan-price">
                  {plan.price} DH<span>/mois</span>
                </div>
              ) : (
                <div className="plan-price-free">Gratuit</div>
              )}

              <div className="plan-divider" />

              <ul className="plan-features">
                {plan.features.map((feat, i) => (
                  <li key={i}>
                    <svg className="check-icon" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="10" fill="#dcfce7" />
                      <path
                        d="M6 10.5l2.5 2.5 5-5"
                        stroke="#22c55e"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                className="plan-cta"
                style={ctaStyles[plan.ctaStyle]}
              >
                {plan.cta}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="steps-section">
        <h2 className="steps-title">Comment souscrire ?</h2>
        <div className="steps-grid">
          {steps.map((step) => (
            <div className="step-item" key={step.number}>
              <div className="step-number">{step.number}</div>
              <h4 className="step-title">{step.title}</h4>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}