export const SITE_CONFIG = {
  name: 'Bölen Otomotiv',
  description: 'Güvenilir ve kaliteli araçlar için doğru adres. Hayalinizdeki aracı bulmanız için buradayız.',
  url: 'https://dynamic-chimera-6ea2ff.netlify.app',
} as const;

export const FUEL_TYPES = ['Benzin', 'Dizel', 'Hibrit', 'Elektrik', 'LPG'] as const;

export const TRANSMISSION_TYPES = ['Manuel', 'Otomatik'] as const;

export const CAR_STATUS = {
  available: 'Satışta',
  sold: 'Satıldı',
  reserved: 'Rezerve',
} as const;

export const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Fiyat (Düşükten Yükseğe)' },
  { value: 'price-desc', label: 'Fiyat (Yüksekten Düşüğe)' },
  { value: 'year-asc', label: 'Yıl (Eskiden Yeniye)' },
  { value: 'year-desc', label: 'Yıl (Yeniden Eskiye)' },
  { value: 'km-asc', label: 'Kilometre (Azdan Çoğa)' },
  { value: 'km-desc', label: 'Kilometre (Çoktan Aza)' },
] as const;

export const CONTACT_INFO = {
  phone: '+90 545 214 13 08',
  email: 'info@bolenotomotiv.com',
  address: 'Alpağut, İzzet Baysal Devlet Hst. Blv. no:177 D:1, 14100 Bolu Merkez/Bolu',
  whatsapp: '+905452141308',
} as const;
