const emailJsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  notificationTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  confirmationTemplateId: import.meta.env.VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID,
  newsletterTemplateId: import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID,
  orderTemplateId: import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID,
}

const emailJsEndpoint = 'https://api.emailjs.com/api/v1.0/email/send'

const sendTemplate = async (templateId, templateParams, label) => {
  const { serviceId, publicKey } = emailJsConfig
  if (!serviceId || !publicKey || !templateId) {
    throw new Error(`${label} email is not configured. Add the required EmailJS settings and try again.`)
  }

  const response = await fetch(emailJsEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: templateParams,
    }),
  })

  if (!response.ok) {
    const responseText = await response.text()
    throw new Error(`${label} email could not be sent (HTTP ${response.status}${responseText ? `: ${responseText}` : ''}).`)
  }
}

const deliverEmailPair = async ({ notificationTemplateId, confirmationEmail, params, label }) => {
  const results = await Promise.allSettled([
    sendTemplate(notificationTemplateId, params, `${label} notification`),
    sendTemplate(emailJsConfig.confirmationTemplateId, {
      ...params,
      to_email: confirmationEmail,
      email: confirmationEmail,
    }, `${label} confirmation`),
  ])
  const [notification, confirmation] = results
  const result = {
    notificationSent: notification.status === 'fulfilled',
    confirmationSent: confirmation.status === 'fulfilled',
  }
  if (!result.notificationSent) console.error(`${label} notification email failed:`, notification.reason)
  if (!result.confirmationSent) console.error(`${label} confirmation email failed:`, confirmation.reason)
  return result
}

export const sendNewsletterEmails = async (email) => {
  const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT
  const subscriber = email.trim()
  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: subscriber, source: 'website-newsletter' }),
    })
    if (!response.ok) throw new Error(`Newsletter signup could not be submitted (HTTP ${response.status}).`)
    return { notificationSent: true, confirmationSent: true }
  }

  return deliverEmailPair({
    notificationTemplateId: emailJsConfig.newsletterTemplateId || emailJsConfig.notificationTemplateId,
    confirmationEmail: subscriber,
    label: 'Newsletter',
    params: {
      event_type: 'Newsletter signup',
      from_name: subscriber,
      from_email: subscriber,
      reply_to: subscriber,
      subject: 'New newsletter signup',
      message: `Newsletter signup request from ${subscriber}.`,
      details: `Subscriber email: ${subscriber}`,
      email: subscriber,
    },
  })
}

export const sendContactEmails = async ({ name, email, phone, subject, message }) => (
  deliverEmailPair({
    notificationTemplateId: emailJsConfig.notificationTemplateId,
    confirmationEmail: email,
    label: 'Contact form',
    params: {
      event_type: 'Contact form enquiry',
      from_name: name,
      from_email: email,
      reply_to: email,
      phone,
      subject,
      message,
      details: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`,
      email,
    },
  })
)

export const sendRegistrationWelcome = async ({ name, email }) => {
  await sendTemplate(emailJsConfig.confirmationTemplateId, {
    event_type: 'Welcome to Soverian Fit’s',
    from_name: name,
    from_email: email,
    to_email: email,
    email,
    subject: 'Welcome to Soverian Fit’s',
    message: 'Your account has been created. You can now sign in to manage your account, bag and wishlist.',
    details: `Welcome, ${name}. Your Soverian Fit’s account is ready.`,
  }, 'Account welcome')
}

export const sendReviewNotification = async ({ name, email, productName, rating, comment }) => {
  const { notificationTemplateId } = emailJsConfig
  await sendTemplate(notificationTemplateId, {
    event_type: 'Product review',
    from_name: name,
    from_email: email || 'Not provided',
    reply_to: email || '',
    subject: `New ${rating}-star product review: ${productName}`,
    message: comment,
    details: `Product: ${productName}\nReviewer: ${name}\nEmail: ${email || 'Not provided'}\nRating: ${rating}/5\nReview: ${comment}`,
    email: email || '',
  }, 'Product review notification')
}

export const sendTrackingConfirmation = async (order) => {
  const email = order.customer?.email ?? order.email
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false

  const itemDetails = (order.items ?? order.products ?? []).map((item) => (
    `${item.name ?? item.title ?? 'Product'} | Qty ${item.quantity ?? 1}${item.price === undefined ? '' : ` | ${money(item.price)} each`}`
  )).join('\n')
  await sendTemplate(emailJsConfig.confirmationTemplateId, {
    event_type: 'Order tracking update',
    from_name: order.customer?.fullName ?? order.customer?.name ?? 'Soverian Fit’s customer',
    from_email: email,
    to_email: email,
    email,
    reply_to: email,
    order_id: order.id ?? order.orderId,
    order_date: order.createdAt ?? order.orderDate ?? 'Not provided',
    order_status: order.status,
    payment_status: order.paymentStatus ?? 'Not provided',
    order_total: order.total === undefined ? 'Not provided' : money(order.total),
    delivery_address: formatOrderAddress(order.deliveryAddress ?? order.shippingAddress ?? order.customer?.address),
    order_items: itemDetails || 'Product details not provided by the tracking service.',
    subject: `Order ${order.id ?? order.orderId} tracking update`,
    message: `Your order status is ${order.status}.`,
    details: `Order ID: ${order.id ?? order.orderId}\nStatus: ${order.status}\nPayment status: ${order.paymentStatus ?? 'Not provided'}\nEstimated delivery: ${order.estimatedDelivery ?? 'Not available'}\nItems:\n${itemDetails || 'Not provided'}\nDelivery address: ${formatOrderAddress(order.deliveryAddress ?? order.shippingAddress ?? order.customer?.address)}`,
  }, 'Order tracking confirmation')
  return true
}

export const sendSupportEmails = async (request) => {
  const endpoint = import.meta.env.VITE_SUPPORT_API_ENDPOINT
  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) throw new Error(`Support request could not be submitted (HTTP ${response.status}).`)
    return { notificationSent: true, confirmationSent: true }
  }

  const result = await deliverEmailPair({
    notificationTemplateId: emailJsConfig.notificationTemplateId,
    confirmationEmail: request.email,
    label: 'Support request',
    params: {
      event_type: 'Customer support request',
      from_name: request.name,
      from_email: request.email,
      reply_to: request.email,
      order_id: request.orderId || 'Not provided',
      subject: request.subject,
      message: request.message,
      details: `Name: ${request.name}\nEmail: ${request.email}\nOrder ID: ${request.orderId || 'Not provided'}\nSubject: ${request.subject}\nMessage: ${request.message}`,
      email: request.email,
    },
  })

  if (!result.notificationSent && !result.confirmationSent) {
    throw new Error('Support email delivery is not configured. Please contact us directly by email.')
  }
  return result
}

export const sendOrderEmails = async (order) => {
  const endpoint = import.meta.env.VITE_ORDER_NOTIFICATION_ENDPOINT
  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    })
    if (!response.ok) throw new Error(`Order email notification could not be submitted (HTTP ${response.status}).`)
    return { notificationSent: true, confirmationSent: true }
  }

  const itemDetails = order.items.map((item) => (
    `${item.name} | Qty ${item.quantity} | Size ${item.size || 'One size'} | Colour ${item.color || 'Default'} | ${money(item.price)} each`
  )).join('\n')
  const params = {
    event_type: 'New COD order (local demo)',
    from_name: order.customer.fullName,
    from_email: order.customer.email,
    reply_to: order.customer.email,
    phone: order.customer.phone,
    order_id: order.id,
    order_date: new Date(order.createdAt).toLocaleString('en-IN'),
    order_status: order.status,
    payment_method: 'Cash on Delivery',
    payment_status: order.paymentStatus,
    order_total: money(order.total),
    delivery_address: order.customer.address,
    order_items: itemDetails,
    subject: `New COD order ${order.id}`,
    message: `Order ${order.id} was placed as a local demo COD order. It is not stored in a server-side order database.`,
    details: `DEMO LOCAL ORDER — not stored in a server-side order database.\nOrder ID: ${order.id}\nOrder date: ${new Date(order.createdAt).toLocaleString('en-IN')}\nCustomer: ${order.customer.fullName}\nEmail: ${order.customer.email}\nPhone: ${order.customer.phone}\nDelivery address: ${order.customer.address}\nPayment: Cash on Delivery (${order.paymentStatus})\nStatus: ${order.status}\nItems:\n${itemDetails}\nTotal: ${money(order.total)}`,
    email: order.customer.email,
  }

  return deliverEmailPair({
    notificationTemplateId: emailJsConfig.orderTemplateId,
    confirmationEmail: order.customer.email,
    label: 'Order',
    params,
  })
}

const money = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`

const formatOrderAddress = (address) => {
  if (!address) return 'Not provided'
  if (typeof address === 'string') return address
  return [address.fullName, address.house, address.street, address.city, address.state, address.pincode, address.postalCode, address.country]
    .filter(Boolean)
    .join(', ') || 'Not provided'
}
