// src/domain/campaign.js

export const ageGroupOptions = ['All', '18-24', '25-34', '35-44', '45+']

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}