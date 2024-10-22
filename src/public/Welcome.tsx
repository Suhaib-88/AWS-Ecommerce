import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ServiceBadge from '../public/components/ServiceBadge';

const Welcome: React.FC = () => {
  const services = [
    {
      text: 'Amazon Personalize',
      src: '/personalize.svg',
    },
    {
      text: 'Amazon Pinpoint',
      src: '/pinpoint.svg',
    },
    {
      text: 'Amazon Lex',
      src: '/lex.svg',
    },
  ];

  return (
    <Layout
      showNav={false}
      showFooter={false}
      showTextAlert={false}
      showDemoGuide={false}
      backgroundColor="var(--aws-squid-ink)"
    >
      <div className="container mb-2 text-left">
        <h1 className="heading my-5 text-center">Welcome to the Retail Demo Store!</h1>

        <p>
          The Retail Demo Store is a demo platform to demonstrate how AWS infrastructure and services can be used to build
          personalized customer experiences across multiple channels of engagement.
        </p>

        <p>
          The Retail Demo Store mimics an online store with products, users and user-interactions to showcase the
          personalized product recommendations a shopper would receive based on historical and real time click-through
          behavior.
        </p>

        <div className="mt-2 d-flex flex-column flex-lg-row align-items-lg-center">
          <div className="mb-2 mb-lg-0">AWS Services Included:</div>

          <ul className="service-list mb-0 pl-0 flex-grow-1 d-flex flex-column flex-lg-row justify-content-lg-around font-weight-bold">
            {services.map((service) => (
              <li key={service.text} className="mb-2 mb-lg-0">
                <ServiceBadge text={service.text} src={service.src} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-2 mb-4 my-sm-5 d-flex flex-column align-items-center align-items-sm-end">
          <div className="d-flex flex-column flex-sm-row align-items-center">
            <div className="login-cta d-flex justify-content-center align-items-center">
              Have an account?<Link to="/auth" className="sign-in btn btn-link">Sign in</Link>
            </div>
            <Link to="/auth?signup=true" className="create-account mt-3 mt-sm-0 ml-sm-3 btn btn-primary">
              Create an account
            </Link>
          </div>

          <Link to="/" className="mt-3 skip-login btn btn-link">Skip login for now</Link>
        </div>
      </div>
    </Layout>
  );
};

export default Welcome;
