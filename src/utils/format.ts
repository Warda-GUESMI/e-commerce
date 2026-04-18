// Formatting utilities

// Currency formatting
export const formatPrice = (price: number, currency: string = 'TND'): string => {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 3,
  }).format(price);
};

// Discount formatting
export const formatDiscount = (originalPrice: number, currentPrice: number): string => {
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return `-${Math.round(discount)}%`;
};

// Date formatting
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-TN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

// Time formatting
export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-TN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d);
};

// DateTime formatting
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(d)} à ${formatTime(d)}`;
};

// Rating formatting
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

// Phone number formatting (Tunisian)
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `+216 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// Text truncation
export const truncate = (text: string, length: number = 100): string => {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

// Convert to title case
export const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Capitalize first letter
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// URL slug
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-');
};
