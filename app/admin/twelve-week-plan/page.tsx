"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Target, TrendingUp, Zap, CheckCircle, DollarSign, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TwelveWeekPlan() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if authenticated on client side
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-auth")
        if (!res.ok) {
          router.push("/admin/login")
        } else {
          setIsLoading(false)
        }
      } catch (err) {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">12-Week Business Growth Plan</h1>
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 bg-brand-blue/20 hover:bg-brand-blue/30 text-white rounded-lg transition-all duration-300"
            >
              <span className="mr-2">Back to Dashboard</span>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 w-full h-full opacity-5">
              <Image
                src="/images/webfuzsion-logo.png"
                alt="WebFuZsion Watermark"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Month 1: Launch Phase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6 bg-gradient-to-r from-brand-blue to-brand-purple p-4 rounded-lg">
                <Zap className="h-8 w-8 mr-3 text-white" />
                <h2 className="text-2xl font-bold text-white">Month 1: Launch Phase (Foundation)</h2>
              </div>

              {/* Week 1 */}
              <div className="mb-8 bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-brand-blue">Week 1: Business Setup</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>Finalize business name, branding (logo, colors, fonts)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>Set up your portfolio website (use your hobby projects as examples)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>
                      Create 3 service packages (e.g., Starter Site £500, Business Site £800, Premium Site £1200)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>Set up a professional email (yourname@yourdomain.com)</span>
                  </li>
                </ul>
              </div>

              {/* Week 2 */}
              <div className="mb-8 bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-brand-blue">Week 2: Initial Marketing</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>Post about your new business on all social media (LinkedIn, Facebook, Instagram)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>
                      Personally message friends, ex-colleagues, family: "I'm launching — if you know someone who needs
                      a website, please connect us!"
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>Offer an early bird discount or bonus (like a free month of support)</span>
                  </li>
                </ul>
              </div>

              {/* Week 3 */}
              <div className="mb-8 bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-brand-blue">Week 3: Networking & Content</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>
                      Join 2–3 local Facebook groups, business groups, or networking meetups online (to find first
                      clients)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>
                      Begin cold outreach: email or DM small businesses that have bad/no websites and offer a free
                      consultation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>
                      Publish your first blog post or LinkedIn article ("Why a Good Website Matters for Local
                      Businesses")
                    </span>
                  </li>
                </ul>
              </div>

              {/* Week 4 */}
              <div className="mb-8 bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-brand-blue">Week 4: First Clients</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>
                      Aim to secure <strong>your first 1–2 paid projects</strong> (even if slightly discounted)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>Get contracts signed, deposits paid</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>Start building client sites</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Month 2: Growth Phase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6 bg-gradient-to-r from-brand-purple to-brand-pink p-4 rounded-lg">
                <TrendingUp className="h-8 w-8 mr-3 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Month 2: Build, Deliver, and Boost Visibility (Growth)
                </h2>
              </div>

              {/* Week 5-6 */}
              <div className="mb-8 bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-brand-purple">Week 5-6: Delivery & Portfolio Building</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-purple flex-shrink-0 mt-0.5" />
                    <span>Deliver your first client projects (fast but high quality)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-purple flex-shrink-0 mt-0.5" />
                    <span>Collect testimonials right after each project is done</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-purple flex-shrink-0 mt-0.5" />
                    <span>
                      Update your website portfolio with <em>real</em> client work
                    </span>
                  </li>
                </ul>
              </div>

              {/* Week 7 */}
              <div className="mb-8 bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-brand-purple">Week 7: Referrals & Showcasing</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-purple flex-shrink-0 mt-0.5" />
                    <span>Launch a small referral offer: "£50 Amazon voucher for any successful client referral"</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-purple flex-shrink-0 mt-0.5" />
                    <span>Post new testimonials and case studies on social media and LinkedIn</span>
                  </li>
                </ul>
              </div>

              {/* Week 8 */}
              <div className="mb-8 bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-brand-purple">Week 8: Consistent Marketing</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-purple flex-shrink-0 mt-0.5" />
                    <span>
                      Spend a few hours each week doing outbound marketing (cold emails, networking, posting valuable
                      content)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-purple flex-shrink-0 mt-0.5" />
                    <span>
                      Start posting simple "before and after" web design examples to show the transformation you offer
                    </span>
                  </li>
                </ul>
              </div>

              {/* Month 2 Income Goal */}
              <div className="p-5 bg-brand-purple/20 border border-brand-purple/30 rounded-lg mb-8">
                <h3 className="flex items-center text-xl font-bold mb-3">
                  <Target className="h-6 w-6 mr-2 text-brand-pink" />
                  Income goal by end of Month 2:
                </h3>
                <ul className="space-y-3 ml-8">
                  <li className="flex items-start">
                    <DollarSign className="h-5 w-5 mr-2 text-brand-pink flex-shrink-0 mt-0.5" />
                    <span>3–4 projects completed or booked (~£1500-£2000 total so far)</span>
                  </li>
                  <li className="flex items-start">
                    <DollarSign className="h-5 w-5 mr-2 text-brand-pink flex-shrink-0 mt-0.5" />
                    <span>Target pricing: £500–£800 per project initially, raising after first few wins</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Month 3: Momentum Phase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center mb-6 bg-gradient-to-r from-brand-orange to-brand-pink p-4 rounded-lg">
                <Award className="h-8 w-8 mr-3 text-white" />
                <h2 className="text-2xl font-bold text-white">Month 3: Scale Up and Stabilize (Momentum)</h2>
              </div>

              {/* Week 9-10 */}
              <div className="mb-8 bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-brand-orange">Week 9-10: Marketing Push</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-orange flex-shrink-0 mt-0.5" />
                    <span>Push on marketing:</span>
                    <ul className="ml-7 mt-2 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-brand-orange flex-shrink-0 mt-0.5" />
                        <span>Offer "ready-to-go websites" (templates you can customize quickly) for faster sales</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-brand-orange flex-shrink-0 mt-0.5" />
                        <span>
                          Launch a basic ad campaign (small budget, Facebook or Google Ads targeting local businesses)
                        </span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* Week 11 */}
              <div className="mb-8 bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-brand-orange">Week 11: Recurring Revenue</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-orange flex-shrink-0 mt-0.5" />
                    <span>Upsell maintenance plans (£30–£50/month) to existing clients for ongoing income</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-orange flex-shrink-0 mt-0.5" />
                    <span>Send out a "Last Call" for discounted slots before your prices go up</span>
                  </li>
                </ul>
              </div>

              {/* Week 12 */}
              <div className="mb-8 bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-brand-orange">Week 12: Pipeline Building</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-orange flex-shrink-0 mt-0.5" />
                    <span>Focus on pipeline: book projects into Months 4–5</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-brand-orange flex-shrink-0 mt-0.5" />
                    <span>
                      Hit at least 4–5 projects by now = <strong>£2000+ this month</strong>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Final Income Goal */}
              <div className="p-5 bg-gradient-to-r from-brand-orange/20 to-brand-pink/20 border border-brand-orange/30 rounded-lg">
                <h3 className="flex items-center text-xl font-bold mb-3">
                  <Target className="h-6 w-6 mr-2 text-brand-orange" />
                  3-Month Achievement:
                </h3>
                <p className="ml-8 text-lg">
                  From zero to a functioning web design business with real clients, testimonials, and £2000+ monthly
                  income within 12 weeks!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
