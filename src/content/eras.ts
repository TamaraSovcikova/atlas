import type { BankEra } from './types'

export const ERAS: BankEra[] = [
  {
    id: 'antiquity',
    name: 'Ancient World',
    startYear: -3000,
    endYear: -500,
    description:
      'Earliest civilisations through to the rise of classical Greece. The first cities, writing, law, and the roots of major religions.',
    displayOrder: 1,
  },
  {
    id: 'classical',
    name: 'Classical Antiquity',
    startYear: -500,
    endYear: 500,
    description:
      'Greece and Rome. The birth of philosophy and democracy, the largest empire of the ancient west, and the rise of Christianity.',
    displayOrder: 2,
  },
  {
    id: 'medieval',
    name: 'Medieval World',
    startYear: 500,
    endYear: 1300,
    description:
      'After Rome fell. The Islamic golden age, the Byzantine east, European feudalism, and the slow knitting-together of the medieval world.',
    displayOrder: 3,
  },
  {
    id: 'renaissance',
    name: 'Renaissance and Reformation',
    startYear: 1300,
    endYear: 1600,
    description:
      'Rebirth of classical learning, the printing press, the Protestant Reformation, and the beginning of European overseas expansion.',
    displayOrder: 4,
  },
  {
    id: 'enlightenment',
    name: 'Enlightenment and Early Modern',
    startYear: 1600,
    endYear: 1789,
    description:
      'Reason as the new authority. Newton, Locke, Montesquieu. The scientific revolution and the political ideas behind every modern republic.',
    displayOrder: 5,
  },
  {
    id: 'revolution',
    name: 'Age of Revolution',
    startYear: 1789,
    endYear: 1815,
    description:
      'French and Industrial Revolutions, American independence still echoing, Napoleon redrawing Europe. The hinge between old and modern.',
    displayOrder: 6,
  },
  {
    id: 'long19c',
    name: 'The Long 19th Century',
    startYear: 1815,
    endYear: 1914,
    description:
      'Industrial high tide. Railways, electricity, empires at their largest. Darwin, Marx, the Impressionists. The world the Great War swept away.',
    displayOrder: 7,
  },
  {
    id: 'worldwars',
    name: 'The World Wars Era',
    startYear: 1914,
    endYear: 1945,
    description:
      'Two world wars, the rise and fall of fascism, the Russian Revolution, the Great Depression, and the first nuclear weapons.',
    displayOrder: 8,
  },
  {
    id: 'coldwar',
    name: 'The Cold War',
    startYear: 1945,
    endYear: 1989,
    description:
      'US and USSR rivalry shaping every continent. Proxy wars, the nuclear standoff, the space race, decolonisation, and civil-rights movements.',
    displayOrder: 9,
  },
  {
    id: 'postcoldwar',
    name: 'After the Cold War',
    startYear: 1989,
    endYear: 2008,
    description:
      'The unipolar moment, the EU expanding east, the dot-com boom, 9/11 and its wars, and the early internet reshaping daily life.',
    displayOrder: 10,
  },
  {
    id: 'multipolar',
    name: 'Multipolar Present',
    startYear: 2008,
    endYear: 2030,
    description:
      'The 2008 crash, the Arab Spring, populism left and right, smartphones everywhere, climate change biting, and the AI inflection.',
    displayOrder: 11,
  },
]
