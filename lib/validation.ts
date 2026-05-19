// ─── Field length limits ──────────────────────────────────────────────────────

export const LIMITS = {
  DISPLAY_NAME: 80,
  BIO: 500,
  CITY: 100,
  SLUG: 60,
  EMAIL: 254,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  MESSAGE_BODY: 2000,
  PROPOSAL_NAME: 120,
  PROPOSAL_TAGLINE: 200,
  REVIEW_BODY: 1000,
  URL: 500,
  SOCIAL_HANDLE: 100,
  TAG: 50,
  TAGS_MAX: 10,
  GENRES_MAX: 8,
} as const;

// ─── Validators ───────────────────────────────────────────────────────────────

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Email is required';
  if (trimmed.length > LIMITS.EMAIL) return 'Email address is too long';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed)) return 'Enter a valid email address';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < LIMITS.PASSWORD_MIN) return `Password must be at least ${LIMITS.PASSWORD_MIN} characters`;
  if (password.length > LIMITS.PASSWORD_MAX) return 'Password is too long';
  return null;
}

export function validateDisplayName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Display name is required';
  if (trimmed.length > LIMITS.DISPLAY_NAME) return `Display name must be ${LIMITS.DISPLAY_NAME} characters or less`;
  if (/<script|javascript:|on\w+=/i.test(trimmed)) return 'Display name contains invalid characters';
  return null;
}

export function validateBio(bio: string): string | null {
  if (bio.length > LIMITS.BIO) return `Bio must be ${LIMITS.BIO} characters or less`;
  if (/<script|javascript:/i.test(bio)) return 'Bio contains invalid content';
  return null;
}

export function validateCity(city: string): string | null {
  if (city.length > LIMITS.CITY) return 'City name is too long';
  return null;
}

export function validateUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.length > LIMITS.URL) return 'URL is too long';
  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'URL must start with http:// or https://';
    }
    if (parsed.hostname === 'localhost' || parsed.hostname.startsWith('127.') || parsed.hostname.startsWith('192.168.')) {
      return 'URL references a local address';
    }
  } catch {
    return 'Enter a valid URL (e.g., https://example.com)';
  }
  return null;
}

export function validateMessageBody(body: string): string | null {
  const trimmed = body.trim();
  if (!trimmed) return 'Message cannot be empty';
  if (trimmed.length > LIMITS.MESSAGE_BODY) return `Message must be ${LIMITS.MESSAGE_BODY} characters or less`;
  return null;
}

export function validateProposalName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Show name is required';
  if (trimmed.length > LIMITS.PROPOSAL_NAME) return `Show name must be ${LIMITS.PROPOSAL_NAME} characters or less`;
  return null;
}

export function validateReviewBody(body: string): string | null {
  const trimmed = body.trim();
  if (!trimmed) return 'Review text is required';
  if (trimmed.length > LIMITS.REVIEW_BODY) return `Review must be ${LIMITS.REVIEW_BODY} characters or less`;
  return null;
}

// ─── Role validation ──────────────────────────────────────────────────────────

export const VALID_ROLES = [
  'solo_artist', 'band', 'dj', 'producer', 'venue_manager',
  'promoter', 'creative', 'photographer', 'videographer', 'sound_engineer',
] as const;

export type ValidRole = typeof VALID_ROLES[number];

export function validateRole(role: string): string | null {
  if (!VALID_ROLES.includes(role as ValidRole)) return 'Invalid role selection';
  return null;
}

// ─── Social link platform validation ─────────────────────────────────────────

const ALLOWED_SOCIAL_DOMAINS: Record<string, string[]> = {
  Instagram: ['instagram.com', 'www.instagram.com'],
  Twitter: ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'],
  SoundCloud: ['soundcloud.com', 'www.soundcloud.com'],
  Spotify: ['open.spotify.com', 'spotify.com'],
  YouTube: ['youtube.com', 'www.youtube.com', 'youtu.be'],
  Bandcamp: ['bandcamp.com'],
  TikTok: ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com'],
  Facebook: ['facebook.com', 'www.facebook.com', 'fb.com'],
  LinkedIn: ['linkedin.com', 'www.linkedin.com'],
  Website: [],
};

export function validateSocialLink(platform: string, url: string): string | null {
  if (!url) return null;
  const baseError = validateUrl(url);
  if (baseError) return baseError;

  const allowedDomains = ALLOWED_SOCIAL_DOMAINS[platform];
  if (!allowedDomains) return null;
  if (allowedDomains.length === 0) return null;

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    if (!allowedDomains.some(d => hostname === d || hostname.endsWith('.' + d))) {
      return `URL must be from ${allowedDomains[0]}`;
    }
  } catch {
    return 'Enter a valid URL';
  }
  return null;
}

// ─── Generic sanitize ─────────────────────────────────────────────────────────

export function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
}

// ─── Batch validator helper ───────────────────────────────────────────────────

export type ValidationErrors = Record<string, string>;

export function collectErrors(checks: [string, string | null][]): ValidationErrors {
  const errors: ValidationErrors = {};
  checks.forEach(([field, error]) => {
    if (error) errors[field] = error;
  });
  return errors;
}
