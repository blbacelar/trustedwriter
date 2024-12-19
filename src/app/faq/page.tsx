'use client';

import { useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { SupportWidget } from '@/components/SupportWidget';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQPage = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSupport, setShowSupport] = useState(false);

  // Add debugging
  console.log('Current language:', language);
  console.log('Translation test:', {
    title: t('faq.title'),
    subtitle: t('faq.subtitle'),
    searchPlaceholder: t('faq.searchPlaceholder'),
    categories: {
      all: t('faq.categories.all'),
      gettingStarted: t('faq.categories.gettingStarted'),
    }
  });

  const faqItems: FAQItem[] = [
    {
      question: "How do I get started with TrustedWriter?",
      answer: "Getting started is easy! Simply sign up for an account, choose your preferred language settings, and start using our AI-powered writing assistance. Our platform will guide you through the process step by step.",
      category: "getting-started"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) as well as PayPal. All payments are processed securely through our payment providers.",
      category: "billing"
    },
    {
      question: "How can I change my language preferences?",
      answer: "You can change your language preferences at any time through the Settings page. Click on your profile icon, select 'Settings', and choose your preferred language from the dropdown menu.",
      category: "settings"
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. All your data is encrypted both in transit and at rest. We never share your personal information with third parties without your explicit consent.",
      category: "security"
    },
    {
      question: "Why do I need to set rules in the settings page?",
      answer: "The rules help our AI generate more accurate and personalized responses. By providing specific details about your preferences and requirements, the AI can better understand your needs and create more assertive and relevant applications. This ensures that each application is tailored to your unique situation and increases your chances of success.",
      category: "settings"
    },
  ];

  const categories = [
    { id: 'all', label: t('faq.categories.all') },
    { id: 'getting-started', label: t('faq.categories.gettingStarted') },
    { id: 'billing', label: t('faq.categories.billing') },
    { id: 'settings', label: t('faq.categories.settings') },
    { id: 'security', label: t('faq.categories.security') },
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Function to trigger the support widget
  const handleSupportClick = () => {
    // Create and dispatch a custom event to open the support widget
    const event = new CustomEvent('openSupport', { detail: { showContact: true } });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('faq.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder={t('faq.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {t('faq.noResults')}
              </p>
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div className="mt-12 text-center bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t('faq.support.title')}
          </h2>
          <p className="text-gray-600 mb-4">
            {t('faq.support.subtitle')}
          </p>
          <button
            onClick={handleSupportClick}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {t('faq.support.button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage; 