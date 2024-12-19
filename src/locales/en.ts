const translations = {
  "landing": {
    "title": "Write your TrustedHousesitters application with AI",
    "description": "Get help writing your application for house sits. Our AI assistant helps you create personalized, engaging applications.",
    "cta": "Start Writing",
    "features": {
      "personalized": {
        "title": "Personalized Applications",
        "description": "Tailored to each house sit opportunity"
      },
      "ai": {
        "title": "AI-Powered",
        "description": "Advanced AI helps craft engaging messages"
      },
      "fast": {
        "title": "Quick & Easy",
        "description": "Write applications in minutes, not hours"
      }
    }
  },
  "promo": {
    "title": "Join TrustedHousesitters",
    "description": "Find house sitting opportunities worldwide",
    "cta": "Sign Up Now"
  },
  "footer": {
    "brand": {
      "description": "AI-powered application writer for TrustedHousesitters"
    },
    "quickLinks": {
      "title": "Quick Links",
      "settings": "Settings",
      "home": "Home",
      "faq": "FAQ"
    },
    "resources": {
      "title": "Resources",
      "join": "Join TrustedHousesitters"
    },
    "copyright": {
      "text": "© {year} TrustedWriter. All rights reserved.",
      "referral": "This site contains affiliate links to TrustedHousesitters."
    }
  },
  "errors": {
    "serviceUnavailable": {
      "title": "Partially Degraded Service",
      "funMessage": {
        "line1": "Our AI is taking a quick coffee break",
        "line2": "We'll be back to full power shortly!"
      }
    },
    "notFound": {
      "title": "Page Not Found",
      "description": "The page you're looking for doesn't exist or has been moved."
    }
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "subtitle": "Find answers to common questions about TrustedWriter",
    "searchPlaceholder": "Search FAQ...",
    "noResults": "No results found. Try adjusting your search or category filter.",
    "categories": {
      "all": "All Categories",
      "gettingStarted": "Getting Started",
      "billing": "Billing",
      "settings": "Settings",
      "security": "Security"
    },
    "support": {
      "title": "Still have questions?",
      "subtitle": "Can't find what you're looking for? Our support team is here to help.",
      "button": "Contact Support"
    }
  },
  credits: {
    unit: "credits",
  },
  dashboard: {
    title: "Generate Your Perfect House Sitting Application",
    subtitle: "Simply paste the TrustedHousesitters listing URL and let AI create a personalized application based on your profile.",
    generatedTitle: "Your Generated Application",
    copied: {
      title: "Copied!",
      description: "Application copied to clipboard"
    },
    urlInput: {
      label: "Listing URL",
      placeholder: "Paste TrustedHousesitters listing URL here",
      button: "Generate Application"
    },
    error: {
      invalidUrl: "Please enter a valid TrustedHousesitters listing URL",
      generic: "Something went wrong. Please try again."
    },
    searchbar: {
      placeholder: "Paste TrustedHousesitters listing URL here",
      button: "Generate",
      noProfile: "Please complete your profile first",
      failed: "Failed to check profile"
    },
    table: {
      title: "Your Applications",
      search: "Search applications...",
      date: "Date",
      content: "Content",
      listing: "Listing",
      actions: "Actions"
    }
  },
  search: {
    input: {
      label: "Search",
      placeholder: "Enter listing URL...",
      button: "Search",
      loading: "Searching..."
    },
    error: {
      invalid: "Please enter a valid URL",
      notFound: "No listing found at this URL"
    }
  },
  applications: {
    table: {
      date: "Date",
      actions: "Actions",
      noApplications: "No applications yet",
      copy: "Copy",
      copied: "Copied!",
      view: "View",
      edit: "Edit",
      delete: "Delete"
    }
  },
  nav: {
    settings: "Settings",
    signOut: "Sign Out",
    login: "Log In",
    signup: "Sign Up"
  },
  settings: {
    title: "Settings",
    profile: {
      title: "Your Profile",
      helper: "This profile will be used to generate your applications"
    },
    rules: {
      title: "Application Rules",
      placeholder: "Add a rule for generating applications...",
      add: "Add Rule",
      deleteButton: "Delete Rule"
    },
    save: {
      button: "Save Changes",
      saving: "Saving...",
      success: "Changes saved successfully",
      error: "Failed to save changes"
    }
  }
} as const;

export default translations; 