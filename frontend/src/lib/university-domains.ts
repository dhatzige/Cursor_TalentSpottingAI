export const UNIVERSITY_EMAIL_DOMAINS = [
  // Generic Top-Level Domains (TLDs)
  '.edu',

  // Country-Specific Academic TLDs
  '.ac.uk', // United Kingdom
  '.edu.au', // Australia
  '.edu.ca', // Canada
  '.edu.cn', // China
  '.ac.in', // India
  '.ac.jp', // Japan
  '.ac.za', // South Africa

  // Add specific university domains if needed, for example:
  // 'stanford.edu',
  // 'mit.edu',
  // 'ox.ac.uk',
];

export const isUniversityEmail = (email: string): boolean => {
  if (!email) return false;
  const lowercasedEmail = email.toLowerCase();
  return UNIVERSITY_EMAIL_DOMAINS.some(domain => lowercasedEmail.endsWith(domain));
};
