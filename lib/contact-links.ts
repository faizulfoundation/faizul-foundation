export function digitsOnly(value: string): string {
  return value.replace(/\D+/g, '');
}

export function buildTelHref(mobileNumber: string): string | null {
  const cleaned = mobileNumber.trim();
  const digits = digitsOnly(cleaned);
  if (digits.length < 7) return null;
  if (cleaned.startsWith('+')) {
    return `tel:+${digits}`;
  }
  return `tel:${digits}`;
}

export function buildWhatsAppHref(whatsappNumber: string): string | null {
  const digits = digitsOnly(whatsappNumber);
  if (digits.length < 10) return null;
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${normalized}`;
}

export function buildMailtoHref(emailAddress: string, subject = 'Inquiry - Faizul Foundation'): string | null {
  const trimmed = emailAddress.trim();
  if (!trimmed.includes('@') || trimmed.includes('To be updated')) return null;
  return `mailto:${encodeURIComponent(trimmed)}?subject=${encodeURIComponent(subject)}`;
}
