'use client'

import { scrapeAndGetApplication } from '@/lib/actions/index'
import { FormEvent, useState } from 'react'
import { useLanguage } from "@/contexts/LanguageContext"
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface SearchbarProps {
  onApplicationData: (data: string | null) => void
}

const isValidTrustedHouseSitterURL = (url: string) => {
  try {
    const parsedURL = new URL(url)
    return parsedURL.hostname.includes('trustedhousesitters.com')
  } catch (error) {
    return false
  }
}

const Searchbar: React.FC<SearchbarProps> = ({ onApplicationData }) => {
  const { t } = useLanguage()
  const [searchPrompt, setSearchPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await fetch("/api/applications", {
        method: "POST",
        // ... rest of fetch config
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 403) {
          toast.error(data.error);
          router.push("/settings");
          return;
        }
        throw new Error(data.error || "Failed to generate application");
      }

      // ... rest of success handling
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate application");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full max-w-2xl" onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={searchPrompt}
          onChange={e => setSearchPrompt(e.target.value)}
          placeholder={t("dashboard.searchbar.placeholder")}
          className="flex-1 px-6 py-4 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/40"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={searchPrompt === '' || isLoading}
          className="px-8 py-4 bg-[#00B5B4] hover:bg-[#00A3A2] text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm relative"
        >
          {isLoading ? (
            <>
              <span className="opacity-0">{t("dashboard.searchbar.button")}</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-l-transparent rounded-full" />
              </div>
            </>
          ) : (
            t("dashboard.searchbar.button")
          )}
        </button>
      </div>
    </form>
  )
}

export default Searchbar
