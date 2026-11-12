const readResponse = async (response) => {
  const body = await response.text()
  if (!body) return {}
  try {
    return JSON.parse(body)
  } catch {
    throw new Error('The service returned an unreadable response. Please try again later.')
  }
}

const responseError = (response, payload, fallback) => {
  const detail = typeof payload?.message === 'string' ? payload.message : ''
  return new Error(detail || `${fallback} (HTTP ${response.status}).`)
}

export const trackOrder = async ({ orderId, emailOrPhone }) => {
  const endpoint = import.meta.env.VITE_ORDER_TRACKING_ENDPOINT
  if (!endpoint) {
    throw new Error('Order tracking is not connected yet. Please contact Support for an order update.')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, emailOrPhone }),
  })
  const payload = await readResponse(response)
  if (!response.ok) throw responseError(response, payload, 'Unable to retrieve this order')
  const order = payload?.order ?? payload
  if (!order || typeof order !== 'object' || !order.id && !order.orderId || !order.status) {
    throw new Error('The tracking service returned incomplete order details. Please contact Support.')
  }
  return order
}

export const submitSupportRequest = async (request) => {
  const endpoint = import.meta.env.VITE_SUPPORT_API_ENDPOINT
  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    const payload = await readResponse(response)
    if (!response.ok) throw responseError(response, payload, 'Unable to send your message')
    return
  }

  const {
    VITE_EMAILJS_SERVICE_ID: serviceId,
    VITE_EMAILJS_TEMPLATE_ID: templateId,
    VITE_EMAILJS_PUBLIC_KEY: publicKey,
  } = import.meta.env
  if (!serviceId || !templateId || !publicKey) {
    throw new Error('Support message delivery is not configured. Please email support@soverianfits.com.')
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        from_name: request.name,
        from_email: request.email,
        reply_to: request.email,
        order_id: request.orderId || 'Not provided',
        subject: request.subject,
        message: request.message,
      },
    }),
  })
  if (!response.ok) throw new Error(`Unable to send your message (HTTP ${response.status}).`)
}
