'use client'

import { useState, useEffect } from 'react'
import { profile as defaultProfile, rules as defaultRules } from '@/utils/rules'

const SettingsPage = () => {
  const [profile, setProfile] = useState(defaultProfile)
  const [rules, setRules] = useState<string[]>(defaultRules)
  const [newRule, setNewRule] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile, rules }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()])
      setNewRule('')
    }
  }

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#1B1B1B] mb-8">Settings</h1>
        
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <textarea
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B5B4]"
            placeholder="Enter your profile description..."
          />
        </div>

        {/* Rules Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Application Rules</h2>
          
          {/* Add New Rule */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B5B4]"
              placeholder="Add a new rule..."
            />
            <button
              onClick={handleAddRule}
              className="px-6 py-2 bg-[#00B5B4] hover:bg-[#00A3A2] text-white rounded-lg transition-colors"
            >
              Add Rule
            </button>
          </div>

          {/* Rules List */}
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <span className="flex-1 p-3 bg-gray-50 rounded-lg">{rule}</span>
                <button
                  onClick={() => handleRemoveRule(index)}
                  className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-8 py-3 bg-[#00B5B4] hover:bg-[#00A3A2] text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage 