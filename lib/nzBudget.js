// Official reference data for "how tax currently gets spent" — not survey
// data, not user input. Sourced from NZ Treasury's Budget 2026 "Budget at a
// Glance" (forecast core Crown expenses, year ending 30 June 2027).
// Update this alongside the annual Budget release.
export const NZ_CORE_CROWN_EXPENSES = {
  fiscalYear: '2026/27',
  totalBillions: 155,
  sourceLabel: 'NZ Treasury, Budget 2026 — "Budget at a Glance"',
  sourceUrl: 'https://www.treasury.govt.nz/sites/default/files/2026-05/b26-at-a-glance.pdf',
  otherIncludes:
    'Defence, housing, the environment, primary industries, and economic development are not broken out separately in this official summary — they sit inside "Other government spending."',
  categories: [
    { label: 'Health', billions: 34.2, color: '#0ea5e9' },
    { label: 'Social security and welfare (excl. NZ Super)', billions: 27.0, color: '#f59e0b' },
    { label: 'New Zealand Superannuation', billions: 26.5, color: '#fbbf24' },
    { label: 'Education', billions: 22.4, color: '#3b82f6' },
    { label: 'Other government spending', billions: 15.1, color: '#94a3b8' },
    { label: 'Finance costs (debt servicing)', billions: 10.2, color: '#64748b' },
    { label: 'Law and order', billions: 7.6, color: '#ef4444' },
    { label: 'Core government services', billions: 6.6, color: '#14b8a6' },
    { label: 'Transport and communications', billions: 5.1, color: '#78716c' },
  ],
};
