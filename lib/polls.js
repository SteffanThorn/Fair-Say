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
  {
    id: 'tax-priorities-2026',
    type: 'allocation',
    question: 'Where should your tax go?',
    note: 'Anonymous · Split 100% across categories · Tap ⓘ for what each covers',
    options: [
      {
        label: 'Social Welfare & Superannuation',
        color: '#f59e0b',
        description:
          "The single biggest area of government spending. Pays NZ Superannuation to retirees, Jobseeker and Sole Parent support, Working for Families tax credits, and disability support services.",
      },
      {
        label: 'Health',
        color: '#0ea5e9',
        description:
          'Funds public hospitals, GP visit subsidies, Pharmac-funded medicines, mental health and addiction services, and ambulance and public health services. Typically the second-largest slice of government spending.',
      },
      {
        label: 'Education',
        color: '#3b82f6',
        description:
          'Covers early childhood education subsidies, state primary and secondary schools, tertiary institutions, and student loans and allowances — including teacher salaries and school property.',
      },
      {
        label: 'Housing',
        color: '#a855f7',
        description:
          'Funds state housing through Kāinga Ora, the Accommodation Supplement and Income-Related Rent subsidies, and emergency, transitional, and homelessness support services.',
      },
      {
        label: 'Law & Order',
        color: '#ef4444',
        description:
          'Funds Police, Corrections (prisons and community sentences), the court system, legal aid, and victim support services.',
      },
      {
        label: 'Transport & Infrastructure',
        color: '#78716c',
        description:
          'Builds and maintains state highways and local roads, and funds public transport, rail, and road safety programmes — largely through the National Land Transport Fund.',
      },
      {
        label: 'Defence',
        color: '#6366f1',
        description:
          'Funds the New Zealand Defence Force — Army, Navy and Air Force — including equipment, peacekeeping deployments, and disaster relief capability.',
      },
      {
        label: 'Environment & Conservation',
        color: '#22c55e',
        description:
          'Funds conservation land and native species protection through DOC, biosecurity to keep out pests and disease, climate programmes, and environmental regulation.',
      },
      {
        label: 'Debt Servicing (Interest)',
        color: '#64748b',
        description:
          "Pays interest on government debt built up from past deficits, the COVID-19 response, and earthquake recovery. This isn't spent on services — it's the cost of past borrowing.",
      },
      {
        label: 'Core Government Services',
        color: '#14b8a6',
        description:
          'Funds Parliament, IRD tax collection, Stats NZ, elections, and the day-to-day running of government departments.',
      },
      {
        label: 'Economic Development & Business',
        color: '#ec4899',
        description:
          'Supports tourism promotion, trade negotiations, research and innovation funding, primary industry support (agriculture, fisheries, forestry), and business assistance programmes.',
      },
    ],
  },
];

export function getPollById(id) {
  return POLLS.find((p) => p.id === id) ?? null;
}
