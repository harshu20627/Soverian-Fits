import { useState } from 'react'
import { sendNewsletterEmails } from './emailNotifications'

export const useNewsletterSignup = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [notice, setNotice] = useState(null)

  const submitNewsletter = async (event) => {
    event.preventDefault()
    setNotice(null)
    setIsSubmitting(true)
    try {
      const result = await sendNewsletterEmails(email)
      if (result.notificationSent && result.confirmationSent) {
        setEmail('')
        setIsSubscribed(true)
        setNotice({ type: 'success', text: 'Your signup request and confirmation were emailed successfully.' })
      } else {
        const missing = [
          !result.notificationSent && 'store notification',
          !result.confirmationSent && 'subscriber confirmation',
        ].filter(Boolean).join(' and ')
        setNotice({ type: 'error', text: `We could not send the ${missing}. Please try again later.` })
      }
    } catch (error) {
      console.error('Unable to submit newsletter signup:', error)
      setNotice({ type: 'error', text: error.message || 'Newsletter signup could not be sent. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    email,
    setEmail,
    isSubmitting,
    isSubscribed,
    notice,
    submitNewsletter,
  }
}
