"use client"

import { useState, useEffect } from "react"
import { submitContactForm } from "@/actions/contact-form"
import { type FormState, initialState } from "@/lib/form-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ContactFormProps {
  onSubmit?: (data: any) => void
  showTitle?: boolean
}

export default function ContactForm({ onSubmit, showTitle = true }: ContactFormProps) {
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<FormState>(initialState)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true)
      setIsSubmitting(false)
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [state.success])

  const handleSubmit = async (formData: FormData) => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      setState(prev => ({ ...prev, message: "", errors: {} }))

      let result: FormState | undefined
      try {
        const submitPromise = submitContactForm(state, formData)
        const timeoutPromise = new Promise<FormState>((_, reject) => 
          setTimeout(() => reject(new Error("Form submission timed out")), 30000)
        )
        result = await Promise.race([submitPromise, timeoutPromise])
      } catch (error) {
        console.error("Form submission error:", error)
        result = {
          success: false,
          message: error instanceof Error ? error.message : "An error occurred while submitting the form. Please try again.",
          errors: {}
        }
      }

      if (!result) {
        result = {
          success: false,
          message: "No response received from the server. Please try again.",
          errors: {}
        }
      }

      setState(result)
      if (result.success) {
        toast.success(result.message || "Message sent successfully!")
      } else {
        toast.error(result.message || "Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error)
      const errorState: FormState = {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        errors: {}
      }
      setState(errorState)
      toast.error(errorState.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) {
    return (
      <div className="w-full max-w-2xl mx-auto h-[600px] animate-pulse bg-brand-dark/20 rounded-xl" />
    )
  }

  return (
    <Card 
      className={cn(
        "w-full max-w-2xl mx-auto",
        "bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl",
        "text-card-foreground shadow-sm"
      )}
    >
      <CardHeader className="p-6">
        {showTitle && (
          <>
            <CardTitle className="text-2xl font-bold text-white">Contact Us</CardTitle>
            <CardDescription className="text-white/80">
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {showSuccess && (
          <div className="mb-6">
            <Alert className="bg-green-500/10 border-green-500/20">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription>
                <span className="text-green-500">{state.message}</span>
              </AlertDescription>
            </Alert>
          </div>
        )}
        {!showSuccess && state.message && !state.success && (
          <div className="mb-6">
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription>
                <span className="text-destructive">{state.message}</span>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <form 
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(new FormData(e.currentTarget))
          }}
          className="space-y-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
                disabled={isSubmitting}
                aria-describedby="name-error"
              />
              {state.errors?.name && (
                <p className="text-sm text-red-500" id="name-error">
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                required
                disabled={isSubmitting}
                aria-describedby="email-error"
              />
              {state.errors?.email && (
                <p className="text-sm text-red-500" id="email-error">
                  {state.errors.email[0]}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="What is this regarding?"
              required
              disabled={isSubmitting}
              aria-describedby="subject-error"
            />
            {state.errors?.subject && (
              <p className="text-sm text-red-500" id="subject-error">
                {state.errors.subject[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="enquiryType" className="text-white">Type of Enquiry</Label>
            <Select name="enquiryType" defaultValue="Business Site" disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select type of enquiry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Business Site">Business Site</SelectItem>
                <SelectItem value="E-commerce Site">E-commerce Site</SelectItem>
                <SelectItem value="Landing Page">Landing Page</SelectItem>
                <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                <SelectItem value="Website Maintenance">Website Maintenance</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.enquiryType && (
              <p className="text-sm text-red-500" id="enquiryType-error">
                {state.errors.enquiryType[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your project..."
              required
              disabled={isSubmitting}
              className="min-h-[150px]"
              aria-describedby="message-error"
            />
            {state.errors?.message && (
              <p className="text-sm text-red-500" id="message-error">
                {state.errors.message[0]}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
