import React from 'react';
// FIX: Use namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import Layout from '../components/Layout';

const PrivacyPolicyPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-serif">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
          <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            <strong>Important:</strong> This is a template for a privacy policy. You must replace the placeholder text with your own policy. It is highly recommended to consult with a legal professional to ensure your privacy policy is compliant with all applicable laws and regulations, such as GDPR, CCPA, etc.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">Introduction</h2>
          <p>
            Welcome to Limra InfoNet. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>

          <h2 className="text-2xl font-bold mt-8">Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as posting comments.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Email you regarding your account or order.</li>
            <li>Enable user-to-user communications.</li>
            <li>Manage comments and respond to your requests.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8">Cookies and Web Beacons</h2>
          <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology.</p>

          <h2 className="text-2xl font-bold mt-8">Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us through our <ReactRouterDOM.Link to="/contact" className="text-primary-500 hover:underline">Contact Page</ReactRouterDOM.Link>.</p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicyPage;