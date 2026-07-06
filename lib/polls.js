export const POLLS = [
  {
    id: 'biggest-worry-2026',
    type: 'ranked',
    question: 'What do you worry about most in New Zealand?',
    note: 'Verified voters only · One ranking per person',
    options: [
      { label: 'Cost of Living', color: '#f97316' },
      { label: 'Housing / Rent', color: '#a855f7' },
      { label: 'Environment', color: '#22c55e' },
      { label: 'Climate Change & Natural Disasters', color: '#14b8a6' },
      { label: 'Homelessness', color: '#f43f5e' },
      { label: 'Political Instability', color: '#6366f1' },
      { label: 'Safety', color: '#ef4444' },
      { label: 'Education', color: '#3b82f6' },
      { label: "Workers' Rights", color: '#f59e0b' },
      { label: 'Immigration', color: '#06b6d4' },
      { label: 'Māori Grievances', color: '#b5281e' },
      { label: 'Māori Co-Governance', color: '#d946ef' },
      { label: 'Tax Cuts', color: '#10b981' },
      { label: 'Tax Increases', color: '#ec4899' },
      { label: 'Healthcare', color: '#0ea5e9' },
      { label: 'Mental Health', color: '#8b5cf6' },
      { label: 'Emergency Services', color: '#84cc16' },
      { label: 'Roads', color: '#78716c' },
      { label: 'Public Transport', color: '#eab308' },
      { label: 'Racism', color: '#9f1239' },
      { label: 'Alcohol & Drugs Reform', color: '#a21caf' },
      { label: 'Conservation Land', color: '#15803d' },
    ],
  },
];

export function getPollById(id) {
  return POLLS.find((p) => p.id === id) ?? null;
}
