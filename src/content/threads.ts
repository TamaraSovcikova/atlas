import type { BankThread } from './types'

/**
 * Narrative threads -- storylines followed vertically through time, the way you
 * would walk someone through a country's history. Members reference existing
 * bank concepts by id. Tier 1 is the skeleton (the what/when/why anchors); tiers
 * 2 and 3 are the connective events and the texture, introduced once the
 * skeleton is in place.
 *
 * This first thread is built from concepts that already exist in the bank, so
 * the engine is exercisable now. The Slovak / Central-European anchors (Great
 * Moravia, Austria-Hungary, Czechoslovakia 1918, the 1968 and 1989 turns, the
 * 1993 split) are authored in the content phase that follows.
 */
export const THREADS: BankThread[] = [
  {
    id: 'slovakia-history',
    name: 'Slovakia through the centuries',
    description:
      'From the first Slavic alphabet in Great Moravia to the Velvet Revolution and the EU. A vertical cut through 1,100 years of Slovak and Central-European history.',
    displayOrder: 1,
    members: [
      // Tier 1 -- the skeleton: the turning points that defined who Slovaks are
      { concept: 'cyril-methodius', tier: 1 },
      { concept: 'great-moravia', tier: 1 },
      { concept: 'kingdom-of-hungary', tier: 1 },
      { concept: 'austria-hungary', tier: 1 },
      { concept: 'czechoslovakia-1918', tier: 1 },
      { concept: 'prague-spring', tier: 1 },
      { concept: 'velvet-revolution', tier: 1 },
      { concept: 'slovakia-neighbours', tier: 1 },
      // Tier 2 -- the connective tissue
      { concept: 'habsburg-monarchy', tier: 2 },
      { concept: 'ludovit-stur', tier: 2 },
      { concept: 'wwi-trigger', tier: 2 },
      { concept: 'world-war-two', tier: 2 },
      { concept: 'slovak-national-uprising', tier: 2 },
      { concept: 'cold-war', tier: 2 },
      // Tier 3 -- the wider world it connects to
      { concept: 'european-union', tier: 3 },
      { concept: 'eu-member-states', tier: 3 },
    ],
  },
  {
    id: 'modern-europe',
    name: 'The short twentieth century',
    description:
      'From the gunshot in Sarajevo to the fall of the Berlin Wall and after. The two world wars, the rise and fall of the Soviet Union, the nuclear standoff, and the remaking of Europe.',
    displayOrder: 2,
    members: [
      // Tier 1 -- the skeleton: the dozen turning points
      { concept: 'wwi-trigger', tier: 1 },
      { concept: 'russian-revolution', tier: 1 },
      { concept: 'world-war-two', tier: 1 },
      { concept: 'nuclear-weapons', tier: 1 },
      { concept: 'cold-war', tier: 1 },
      { concept: 'fall-of-berlin-wall', tier: 1 },
      { concept: 'fall-of-soviet-union', tier: 1 },
      { concept: 'european-union', tier: 1 },
      // Tier 2 -- the connective tissue between the anchors
      { concept: 'treaty-of-versailles', tier: 2 },
      { concept: 'great-depression', tier: 2 },
      { concept: 'the-holocaust', tier: 2 },
      { concept: 'united-nations', tier: 2 },
      { concept: 'cuban-missile-crisis', tier: 2 },
      { concept: 'moon-landing', tier: 2 },
      { concept: 'velvet-revolution', tier: 2 },
      // Tier 3 -- texture and the present it left behind
      { concept: 'decolonisation', tier: 3 },
      { concept: 'eu-member-states', tier: 3 },
      { concept: 'slovakia-neighbours', tier: 3 },
    ],
  },
]
