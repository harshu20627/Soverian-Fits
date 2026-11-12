export const storePolicies = {
  shipping: {
    processing: 'Orders are prepared after placement and confirmation. Processing time can vary by item and order volume.',
    delivery: 'Any delivery estimate is shown at checkout or in the carrier update and can vary by destination and carrier.',
    charges: 'Applicable shipping charges are calculated and displayed before you place the order.',
    locations: 'Available delivery locations are confirmed when you enter your address at checkout.',
    dispatch: 'Tracking details are shared when shipment information is available from the carrier.',
  },
  returns: {
    eligibility: 'Return eligibility, the request window and item condition depend on the policy shown for your order. Please check those details before purchase or contact Support.',
    exchange: 'Exchange availability depends on the item and stock. Contact Support with your order ID to confirm options before sending anything back.',
    damaged: 'If an item arrives damaged or incorrect, contact Support with your order ID and clear photos so the case can be reviewed.',
    refund: 'Approved refunds are initiated after the return is received and reviewed. The time for funds to appear depends on the original payment provider.',
  },
}

export const sizeGuideMeasurements = {
  men: {
    label: "Men's",
    charts: {
      'T-Shirt': [
        ['S', 96, 43, 68, null], ['M', 102, 45, 70, null], ['L', 108, 47, 72, null],
        ['XL', 114, 49, 74, null], ['XXL', 120, 51, 76, null],
      ],
      Hoodie: [
        ['S', 102, 45, 66, null], ['M', 108, 47, 68, null], ['L', 114, 49, 70, null],
        ['XL', 120, 51, 72, null], ['XXL', 126, 53, 74, null],
      ],
      Shirt: [
        ['S', 96, 43, 70, 88], ['M', 102, 45, 72, 94], ['L', 108, 47, 74, 100],
        ['XL', 114, 49, 76, 106], ['XXL', 120, 51, 78, 112],
      ],
      Jacket: [
        ['S', 102, 45, 68, 94], ['M', 108, 47, 70, 100], ['L', 114, 49, 72, 106],
        ['XL', 120, 51, 74, 112], ['XXL', 126, 53, 76, 118],
      ],
    },
  },
  women: {
    label: "Women's",
    charts: {
      'T-Shirt': [
        ['XS', 82, 35, 58, null], ['S', 88, 37, 60, null], ['M', 94, 39, 62, null],
        ['L', 100, 41, 64, null], ['XL', 106, 43, 66, null],
      ],
      Hoodie: [
        ['XS', 90, 38, 60, null], ['S', 96, 40, 62, null], ['M', 102, 42, 64, null],
        ['L', 108, 44, 66, null], ['XL', 114, 46, 68, null],
      ],
      Shirt: [
        ['XS', 82, 35, 60, 76], ['S', 88, 37, 62, 82], ['M', 94, 39, 64, 88],
        ['L', 100, 41, 66, 94], ['XL', 106, 43, 68, 100],
      ],
      Jacket: [
        ['XS', 88, 37, 60, 80], ['S', 94, 39, 62, 86], ['M', 100, 41, 64, 92],
        ['L', 106, 43, 66, 98], ['XL', 112, 45, 68, 104],
      ],
    },
  },
}
