const checkoutEndpoint = import.meta.env.VITE_PAYMENT_CHECKOUT_ENDPOINT

export const startOnlineCheckout = async (orderDraft) => {
  if (!checkoutEndpoint) {
    throw new Error('Online payments are not configured. Please choose Cash on Delivery.')
  }

  const response = await fetch(checkoutEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderDraft),
  })

  if (!response.ok) {
    throw new Error('Could not start secure checkout. Please try again or choose Cash on Delivery.')
  }

  const checkout = await response.json()
  if (!checkout.checkoutUrl) {
    throw new Error('The payment service did not return a checkout URL.')
  }

  const checkoutUrl = new URL(checkout.checkoutUrl, window.location.origin)
  if (!['https:', 'http:'].includes(checkoutUrl.protocol)) {
    throw new Error('The payment service returned an invalid checkout URL.')
  }
  window.location.assign(checkoutUrl.href)
}
