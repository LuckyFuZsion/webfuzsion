"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"

type ConsentPreferences = {
  analytics: boolean
  marketing: boolean
  personalization: boolean
}

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    analytics: false,
    marketing: false,
    personalization: false,
  })

  useEffect(() => {
    // Check if consent has already been given
    const consentCookie = Cookies.get("cookie-consent")
    if (!consentCookie) {
      // Wait a moment before showing the banner for better UX
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // If consent exists, parse it
      try {
        const savedPreferences = JSON.parse(consentCookie) as ConsentPreferences
        setPreferences(savedPreferences)

        // Update Google's consent mode with saved preferences
        updateConsentState(savedPreferences)
      } catch (e) {
        console.error("Error parsing consent cookie:", e)
      }
    }
  }, [])

  const acceptAll = () => {
    const allConsent = {
      analytics: true,
      marketing: true,
      personalization: true,
    }
    saveConsent(allConsent)
  }

  const acceptNecessary = () => {
    const necessaryOnly = {
      analytics: false,
      marketing: false,
      personalization: false,
    }
    saveConsent(necessaryOnly)
  }

  const savePreferences = () => {
    saveConsent(preferences)
  }

  const saveConsent = (preferences: ConsentPreferences) => {
    Cookies.set("consent-preferences", JSON.stringify(preferences), {
      expires: 365,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    })
    setShowBanner(false)

    // Dispatch a custom event that Google Analytics was updated
    if (typeof window !== "undefined") {
      const event = new CustomEvent("consentUpdated", {
        detail: preferences,
      })
      document.dispatchEvent(event)
    }
  }

  const updateConsentState = (consentPreferences: ConsentPreferences) => {
    // Just dispatch the consent updated event
    if (typeof window !== "undefined") {
      const event = new CustomEvent("consentUpdated", {
        detail: consentPreferences,
      })
      document.dispatchEvent(event)
      console.log("Consent preferences updated:", consentPreferences)
    }
  }

  const togglePreferences = () => {
    setShowPreferences(!showPreferences)
  }

  const handlePreferenceChange = (key: keyof ConsentPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const openConsentManager = () => {
    setShowBanner(true)
    setShowPreferences(true)
  }

  // Add a global function to open consent manager
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.openConsentManager = openConsentManager
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.openConsentManager
      }
    }
  }, [])

  if (!showBanner)
    return (
      <button
        onClick={openConsentManager}
        className="fixed bottom-4 right-4 z-50 bg-brand-dark text-white text-[10px] px-2 py-0.5 rounded-full opacity-70 hover:opacity-100 transition-colors border border-brand-pink/30 hover:bg-brand-dark/90"
        aria-label="Manage Cookie Preferences"
      >
        Cookie Settings
      </button>
    )

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md rounded-lg bg-brand-dark shadow-xl border border-brand-pink/20 p-3 animate-slide-up text-white overflow-hidden">
      <div className="relative">
        <div className="absolute -top-24 -right-24 w-40 h-40 rounded-full bg-gradient-to-br from-brand-pink/20 to-brand-blue/20 blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-brand-orange/20 to-brand-purple/20 blur-xl"></div>
        <div className="relative">
          {!showPreferences ? (
            <div>
              <h2 className="text-base font-semibold mb-1 text-brand-pink">Cookie Consent</h2>
              <p className="text-xs text-gray-300 mb-3">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
                traffic. By clicking "Accept All", you consent to our use of cookies. You can manage your preferences by
                clicking "Preferences".
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={acceptAll}
                  className="bg-brand-pink hover:bg-brand-pink/90 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={acceptNecessary}
                  className="bg-brand-dark hover:bg-gray-800 text-white border border-gray-700 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                >
                  Necessary Only
                </button>
                <button
                  onClick={togglePreferences}
                  className="bg-transparent hover:bg-gray-800 text-white border border-gray-700 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                >
                  Preferences
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold text-brand-pink">Cookie Preferences</h2>
                <button
                  onClick={togglePreferences}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Back to main consent banner"
                >
                  &larr; Back
                </button>
              </div>

              <div className="space-y-4 mb-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium">Necessary</h3>
                    <p className="text-xs text-gray-500">Essential for the website to function. Cannot be disabled.</p>
                  </div>
                  <div className="bg-gray-200 px-3 py-1 rounded text-xs">Always Active</div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium">Analytics</h3>
                    <p className="text-xs text-gray-500">Help us understand how visitors interact with our website.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => handlePreferenceChange("analytics")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-pink/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium">Marketing</h3>
                    <p className="text-xs text-gray-500">
                      Used to track visitors across websites for advertising purposes.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => handlePreferenceChange("marketing")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-pink/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium">Personalization</h3>
                    <p className="text-xs text-gray-500">
                      Allow the website to remember your preferences and provide enhanced features.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.personalization}
                      onChange={() => handlePreferenceChange("personalization")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-pink/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
                  </label>
                </div>
              </div>

              <button
                onClick={savePreferences}
                className="bg-brand-pink hover:bg-brand-pink/90 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
              >
                Save Preferences
              </button>
            </div>
          )}

          <div className="mt-2 text-xs text-gray-400">
            <p>
              By using this site, you acknowledge that you have read our{" "}
              <a href="/privacy-policy" className="underline hover:text-brand-pink transition-colors">
                Privacy Policy
              </a>{" "}
              and agree to our{" "}
              <a href="/terms" className="underline hover:text-brand-pink transition-colors">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Update the Window interface to remove gtag
declare global {
  interface Window {
    openConsentManager?: () => void
  }
}
