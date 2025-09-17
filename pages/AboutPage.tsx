
import React from 'react';
import Layout from '../components/Layout';

const AboutPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6" style={{fontFamily: "'Playfair Display', serif"}}>About Limra InfoNet</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
          <p className="text-lg">
            Welcome to Limra InfoNet, your premier source for high-quality, AI-powered content. We are dedicated to bringing you the most insightful and up-to-date articles on a wide range of topics including technology, Islamic knowledge, trending news, and modern lifestyle.
          </p>
          <p>
            Our mission is to leverage the power of cutting-edge artificial intelligence, guided by human expertise, to create a unique and enriching reading experience. We believe in the synergy of technology and human creativity to deliver content that is not only informative but also engaging and thought-provoking.
          </p>
          <h2 className="text-2xl font-bold mt-8">Our Vision</h2>
          <p>
            We envision a world where information is accessible, accurate, and tailored to the reader's interests. At Limra InfoNet, we strive to be at the forefront of this digital revolution, using AI to discover trends, generate comprehensive articles, and provide you with a constant stream of valuable content.
          </p>
          <h2 className="text-2xl font-bold mt-8">What We Offer</h2>
          <ul>
            <li><strong>In-Depth Articles:</strong> Comprehensive posts that cover topics from multiple angles.</li>
            <li><strong>Trending News:</strong> Stay updated with the latest happenings around the globe.</li>
            <li><strong>Expert Insights:</strong> Content curated and refined by our team of expert editors.</li>
            <li><strong>Diverse Categories:</strong> From tech reviews to spiritual guidance, we cover what matters to you.</li>
          </ul>
          <p>
            Thank you for being a part of our community. We invite you to explore our articles, join the discussion in the comments, and connect with us on social media.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
