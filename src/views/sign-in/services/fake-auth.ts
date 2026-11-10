import type { Session } from '@/store/session-store';

export type Credentials = {
  email: string;
  password: string;
};

export const MIN_PASSWORD_LENGTH = 8;
const LATENCY_MS = 800;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Stands in for an auth API: it answers after a network-like delay and rejects input the way a
// server would, so the screen gets real loading and error states to handle.
export async function authenticate({ email, password }: Credentials): Promise<Session> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

  const address = email.trim().toLowerCase();

  if (!EMAIL.test(address)) {
    throw new Error('Enter a valid email address.');
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Use at least ${MIN_PASSWORD_LENGTH} characters for the password.`);
  }

  return {
    token: `fake.${Date.now().toString(36)}`,
    user: { email: address, name: nameFrom(address) },
  };
}

// "jane.doe@mail.com" → "Jane Doe"
function nameFrom(email: string) {
  return email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}
