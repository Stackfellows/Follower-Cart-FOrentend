import React, { useState } from 'react';
import { Search, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'general', name: 'General' },
    { id: 'orders', name: 'Orders & Delivery' },
    { id: 'payment', name: 'Payment & Billing' },
    { id: 'account', name: 'Account & Security' },
    { id: 'services', name: 'Services' },
  ];

  const faqs = [
    {
      id: 1,
      category: 'general',
      question: 'What is FollowerCarts and how does it work?',
      answer: 'FollowerCarts is a premium social media marketing service that helps you grow your social media presence with real followers, likes, views, and engagement. We connect you with genuine users who are interested in your content, helping you build an authentic and engaged audience across platforms like Instagram, YouTube, TikTok, and Facebook.'
    },
    {
      id: 2,
      category: 'general',
      question: 'Is it safe to use FollowerCarts for my social media accounts?',
      answer: 'Yes, absolutely! FollowerCarts prioritizes account safety above all else. We use only legitimate, organic growth methods that comply with all social media platform guidelines. Our services mimic natural growth patterns, and we never ask for your passwords. All our methods are 100% safe and secure.'
    },
    {
      id: 3,
      category: 'orders',
      question: 'How fast will I receive my order?',
      answer: 'Most orders begin processing within 15-30 minutes of confirmation. Delivery times vary by service: followers typically deliver within 1-24 hours, likes and views start immediately and complete within a few hours, and larger orders may take 24-72 hours for full completion. We prioritize quality over speed to ensure natural-looking growth.'
    },
    {
      id: 4,
      category: 'orders',
      question: 'Can I track my order progress?',
      answer: 'Yes! You can track your order in real-time through your dashboard. We provide live updates on delivery progress, completion status, and detailed analytics. You\'ll also receive email notifications for important order milestones.'
    },
    {
      id: 5,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and various cryptocurrencies including Bitcoin and Ethereum. All payments are processed through secure, encrypted channels.'
    },
    {
      id: 6,
      category: 'payment',
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with your service or if we fail to deliver as promised, you can request a full refund. We also provide free refills for 30 days to maintain your follower count.'
    },
    {
      id: 7,
      category: 'account',
      question: 'Do I need to provide my password?',
      answer: 'No, never! We never ask for your passwords or any sensitive login information. All we need is your public username or profile URL. This is one of the key safety measures that makes our service 100% secure.'
    },
    {
      id: 8,
      category: 'account',
      question: 'Will my account get banned or suspended?',
      answer: 'No, our services are completely safe and compliant with all platform terms of service. We use organic growth methods that mimic natural user behavior. In our years of operation, we\'ve never had a customer\'s account suspended or banned due to our services.'
    },
    {
      id: 9,
      category: 'services',
      question: 'Are the followers/likes/views real?',
      answer: 'Yes! We provide 100% real followers, likes, and views from genuine, active users. These are real people with complete profiles, profile pictures, and post history. We never use bots, fake accounts, or automated systems.'
    },
    {
      id: 10,
      category: 'services',
      question: 'What\'s the difference between regular and non-drop services?',
      answer: 'Regular services are high-quality but may experience minor natural drops over time (5-10%). Non-drop services come with a lifetime guarantee - if any followers drop, we replace them for free forever. Non-drop services cost slightly more but offer maximum long-term value.'
    },
    {
      id: 11,
      category: 'services',
      question: 'Can I choose the location or demographics of my followers?',
      answer: 'Yes! We offer targeted services where you can choose followers from specific countries, age groups, or interests. We have specialized packages for USA followers, female followers, and niche-specific audiences to match your target demographic.'
    },
    {
      id: 12,
      category: 'orders',
      question: 'What happens if I don\'t receive my full order?',
      answer: 'If for any reason you don\'t receive your complete order, we will either complete the delivery for free or provide a full refund. We have a 99.9% successful delivery rate, and our customer support team monitors every order to ensure completion.'
    },
    {
      id: 13,
      category: 'general',
      question: 'How do I get started?',
      answer: 'Getting started is easy! Simply browse our services, select the package that fits your needs, enter your username/URL, complete payment, and we\'ll handle the rest. No account creation required for one-time purchases, though we recommend creating an account to track orders.'
    },
    {
      id: 14,
      category: 'services',
      question: 'Do you offer customer support?',
      answer: 'Yes! We provide 24/7 customer support through live chat, email, and our support ticket system. Our expert team is always ready to help with questions, order issues, or account concerns. Average response time is under 30 minutes.'
    },
    {
      id: 15,
      category: 'general',
      question: 'Why should I choose FollowerCarts over competitors?',
      answer: 'FollowerCarts offers the perfect combination of quality, safety, and value. We provide real followers (not bots), guarantee account safety, offer 24/7 support, provide 30-day refill guarantees, and have served over 1 million satisfied customers. Our reputation and customer reviews speak for themselves.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about FollowerCarts services
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {expandedFaq === faq.id ? (
                    <ChevronDown className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>
              
              {expandedFaq === faq.id && (
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or browse by category.
            </p>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 bg-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-purple-100 mb-6">
            Our 24/7 support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Live Chat Support
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200">
              Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;