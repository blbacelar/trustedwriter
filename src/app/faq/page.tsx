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
      question: t('faq.questions.gettingStarted.question'),
      answer: t('faq.questions.gettingStarted.answer'),
      category: "getting-started"
    },
    {
      question: t('faq.questions.payment.question'),
      answer: t('faq.questions.payment.answer'),
      category: "billing"
    },
    {
      question: t('faq.questions.language.question'),
      answer: t('faq.questions.language.answer'),
      category: "settings"
    },
    {
      question: t('faq.questions.security.question'),
      answer: t('faq.questions.security.answer'),
      category: "security"
    },
    {
      question: t('faq.questions.rules.question'),
      answer: t('faq.questions.rules.answer'),
      category: "settings"
    }
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