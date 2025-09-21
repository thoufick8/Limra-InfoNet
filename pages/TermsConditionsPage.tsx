import React from 'react';
// FIX: Use namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import Layout from '../components/Layout';

const TermsConditionsPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-serif">Terms and Conditions</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
          <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            <strong>Disclaimer:</strong> This is a template for Terms and Conditions. It is not legal advice. You should seek professional legal counsel to ensure that your terms are adequate for your website and compliant with the law.
          </p>

          <h2 className="text-2xl font-bold mt-8">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Limra InfoNet (the "Site"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-2xl font-bold mt-8">2. User Conduct</h2>
          <p>
            You agree to use the Site only for lawful purposes. You are prohibited from posting on or transmitting through the Site any material that is harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable. When leaving comments, you agree to:
          </p>
          <ul>
            <li>Be respectful of other users.</li>
            <li>Not post spam or unsolicited advertisements.</li>
            <li>Not impersonate any person or entity.</li>
          </ul>
          <p>We reserve the right to remove any comments that violate these terms without notice.</p>

          <h2 className="text-2xl font-bold mt-8">3. Intellectual Property</h2>
          <p>
            The Site and its original content, features, and functionality are owned by Limra InfoNet and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. Please see our <ReactRouterDOM.Link to="/copyright" className="text-primary-500 hover:underline">Copyright Page</ReactRouterDOM.Link> for more information.
          </p>

          <h2 className="text-2xl font-bold mt-8">4. Disclaimer of Warranties</h2>
          <p>
            The Site is provided on an "as is" and "as available" basis. Limra InfoNet makes no representations or warranties of any kind, express or implied, as to the operation of the site or the information, content, or materials included on this site.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">5. Changes to This Agreement</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. We will do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms and Conditions.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsConditionsPage;