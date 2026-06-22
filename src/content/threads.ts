import type { BankThread } from './types'

export const THREADS: BankThread[] = [
  // ── Unit 1: Ancient foundations ───────────────────────────────────────────
  {
    id: 'ancient-world',
    name: 'The ancient world',
    description:
      'From the first cities of Mesopotamia to the fall of Rome. The civilisations that laid down law, philosophy, and empire — and what we still owe them.',
    displayOrder: 1,
    unit: 'Ancient foundations',
    members: [
      // Tier 1 — the skeleton: civilisations that defined the pattern
      { concept: 'mesopotamia', tier: 1 },
      { concept: 'ancient-egypt', tier: 1 },
      { concept: 'athenian-democracy', tier: 1 },
      { concept: 'alexander-the-great', tier: 1 },
      { concept: 'roman-republic', tier: 1 },
      { concept: 'roman-empire', tier: 1 },
      { concept: 'fall-of-western-rome', tier: 1 },
      // Tier 2 — connective tissue
      { concept: 'persian-empire', tier: 2 },
      { concept: 'julius-caesar', tier: 2 },
      { concept: 'great-pyramid-giza', tier: 2 },
      { concept: 'code-of-hammurabi', tier: 2 },
      { concept: 'socrates', tier: 2 },
      { concept: 'aristotle', tier: 2 },
      // Tier 3 — wider world
      { concept: 'ancient-china', tier: 3 },
      { concept: 'confucius', tier: 3 },
      { concept: 'byzantine-empire', tier: 3 },
    ],
  },
  {
    id: 'world-religions',
    name: "The world's great faiths",
    description:
      'How the major religions emerged, spread, and shaped everything from law to art to science. Judaism, Hinduism, Buddhism, Christianity, and Islam in one vertical read.',
    displayOrder: 2,
    unit: 'Ancient foundations',
    members: [
      // Tier 1 — the five roots
      { concept: 'hinduism-core', tier: 1 },
      { concept: 'judaism-core', tier: 1 },
      { concept: 'buddhism-core', tier: 1 },
      { concept: 'christianity-core', tier: 1 },
      { concept: 'islam-core', tier: 1 },
      // Tier 2 — their golden ages and fractures
      { concept: 'islamic-golden-age', tier: 2 },
      { concept: 'protestant-reformation', tier: 2 },
      { concept: 'the-renaissance', tier: 2 },
      // Tier 3 — texture
      { concept: 'zoroastrianism', tier: 3 },
      { concept: 'charlemagne', tier: 3 },
      { concept: 'crusades-overview', tier: 3 },
    ],
  },

  // ── Unit 2: The march of ideas ─────────────────────────────────────────────
  {
    id: 'age-of-ideas',
    name: 'Revolution in thought',
    description:
      'The Scientific Revolution, the Enlightenment, and the political revolutions they triggered. How thinkers remade the world between 1450 and 1850.',
    displayOrder: 3,
    unit: 'The march of ideas',
    members: [
      // Tier 1 — the hinge moments
      { concept: 'printing-press', tier: 1 },
      { concept: 'scientific-revolution', tier: 1 },
      { concept: 'enlightenment', tier: 1 },
      { concept: 'american-revolution', tier: 1 },
      { concept: 'french-revolution', tier: 1 },
      { concept: 'industrial-revolution', tier: 1 },
      // Tier 2 — the figures and concepts
      { concept: 'copernicus', tier: 2 },
      { concept: 'isaac-newton', tier: 2 },
      { concept: 'napoleon', tier: 2 },
      { concept: 'separation-of-powers', tier: 2 },
      { concept: 'age-of-exploration', tier: 2 },
      // Tier 3 — wider context
      { concept: 'humanism', tier: 3 },
      { concept: 'atlantic-slave-trade', tier: 3 },
      { concept: 'columbian-exchange', tier: 3 },
    ],
  },

  // ── Unit 3: Central European stories ──────────────────────────────────────
  {
    id: 'slovakia-history',
    name: 'Slovakia through the centuries',
    description:
      'From the first Slavic alphabet in Great Moravia to the Velvet Revolution and the EU. A vertical cut through 1,100 years of Slovak and Central-European history.',
    displayOrder: 4,
    unit: 'Central European stories',
    members: [
      // Tier 1 — turning points that defined who Slovaks are
      { concept: 'cyril-methodius', tier: 1 },
      { concept: 'great-moravia', tier: 1 },
      { concept: 'kingdom-of-hungary', tier: 1 },
      { concept: 'austria-hungary', tier: 1 },
      { concept: 'czechoslovakia-1918', tier: 1 },
      { concept: 'prague-spring', tier: 1 },
      { concept: 'velvet-revolution', tier: 1 },
      { concept: 'slovakia-neighbours', tier: 1 },
      // Tier 2 — connective tissue
      { concept: 'habsburg-monarchy', tier: 2 },
      { concept: 'ludovit-stur', tier: 2 },
      { concept: 'wwi-trigger', tier: 2 },
      { concept: 'world-war-two', tier: 2 },
      { concept: 'slovak-national-uprising', tier: 2 },
      { concept: 'cold-war', tier: 2 },
      // Tier 3 — the wider world it connects to
      { concept: 'european-union', tier: 3 },
      { concept: 'eu-member-states', tier: 3 },
    ],
  },

  // ── Unit 4: The twentieth century ─────────────────────────────────────────
  {
    id: 'modern-europe',
    name: 'The short twentieth century',
    description:
      'From the gunshot in Sarajevo to the fall of the Berlin Wall and after. The two world wars, the rise and fall of the Soviet Union, and the remaking of Europe.',
    displayOrder: 5,
    unit: 'The twentieth century',
    members: [
      // Tier 1 — the dozen turning points
      { concept: 'wwi-trigger', tier: 1 },
      { concept: 'russian-revolution', tier: 1 },
      { concept: 'world-war-two', tier: 1 },
      { concept: 'nuclear-weapons', tier: 1 },
      { concept: 'cold-war', tier: 1 },
      { concept: 'fall-of-berlin-wall', tier: 1 },
      { concept: 'fall-of-soviet-union', tier: 1 },
      { concept: 'european-union', tier: 1 },
      // Tier 2 — connective tissue
      { concept: 'treaty-of-versailles', tier: 2 },
      { concept: 'great-depression', tier: 2 },
      { concept: 'the-holocaust', tier: 2 },
      { concept: 'united-nations', tier: 2 },
      { concept: 'cuban-missile-crisis', tier: 2 },
      { concept: 'moon-landing', tier: 2 },
      { concept: 'velvet-revolution', tier: 2 },
      // Tier 3 — texture and the present it left behind
      { concept: 'decolonisation', tier: 3 },
      { concept: 'eu-member-states', tier: 3 },
      { concept: 'slovakia-neighbours', tier: 3 },
    ],
  },
]
