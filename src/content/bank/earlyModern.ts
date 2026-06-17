import type { BankConcept } from '../types'

// Renaissance and Reformation, Enlightenment, Age of Revolution.

export const EARLY_MODERN: BankConcept[] = [
  {
    id: 'the-renaissance',
    name: 'The Renaissance',
    domain: 'culture',
    approxYear: 1450,
    eras: ['renaissance'],
    lat: 43.77,
    lng: 11.26,
    summary:
      'A cultural rebirth that began in Italy, especially Florence, in the 14th century and spread across Europe. It revived the art and learning of ancient Greece and Rome and put new emphasis on the individual, an outlook called humanism. It produced Leonardo, Michelangelo, and Raphael.',
    wikipedia: 'https://en.wikipedia.org/wiki/Renaissance',
    questions: [
      { format: 'cloze', prompt: 'The Renaissance began in 14th-century ____.', answer: 'Italy' },
      {
        format: 'contrast',
        prompt: 'The Renaissance emphasis on the individual and human potential is called what?',
        answer: 'Humanism',
        distractors: ['Romanticism', 'Realism', 'Rationalism'],
      },
    ],
    edges: [
      { to: 'leonardo-da-vinci', relation: 'caused' },
      { to: 'printing-press', relation: 'contemporary_of' },
      { to: 'scientific-revolution', relation: 'caused' },
    ],
  },
  {
    id: 'printing-press',
    name: 'The printing press',
    domain: 'science',
    approxYear: 1440,
    eras: ['renaissance'],
    summary:
      'Around 1440 the German goldsmith Johannes Gutenberg developed movable-type printing in Europe, making books cheap and plentiful for the first time. It spread ideas at unheard-of speed and was crucial to the Reformation and the scientific revolution that followed.',
    wikipedia: 'https://en.wikipedia.org/wiki/Printing_press',
    questions: [
      {
        format: 'cloze',
        prompt: 'The European movable-type printing press was developed by Johannes ____.',
        answer: 'Gutenberg',
      },
      {
        format: 'contrast',
        prompt: 'Whose invention made books cheap and spread ideas across Europe from the 1440s?',
        answer: 'Gutenberg',
        distractors: ['Leonardo da Vinci', 'Copernicus', 'Isaac Newton'],
      },
    ],
    edges: [
      { to: 'protestant-reformation', relation: 'caused' },
      { to: 'scientific-revolution', relation: 'caused' },
    ],
  },
  {
    id: 'leonardo-da-vinci',
    name: 'Leonardo da Vinci',
    domain: 'culture',
    approxYear: 1500,
    eras: ['renaissance'],
    summary:
      'The model of the Renaissance genius: painter of the Mona Lisa and The Last Supper, but also an anatomist, engineer, and inventor who filled notebooks with designs centuries ahead of their time. He embodied the era\'s belief that one mind could master art and science alike.',
    wikipedia: 'https://en.wikipedia.org/wiki/Leonardo_da_Vinci',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Leonardo da Vinci painted the Mona Lisa and The Last ____.',
        answer: 'Supper',
      },
      {
        format: 'contrast',
        prompt: 'Who painted the Mona Lisa?',
        answer: 'Leonardo da Vinci',
        distractors: ['Michelangelo', 'Raphael', 'Claude Monet'],
      },
    ],
    edges: [{ to: 'the-renaissance', relation: 'part_of' }],
  },
  {
    id: 'age-of-exploration',
    name: 'The Age of Exploration',
    domain: 'history',
    approxYear: 1492,
    eras: ['renaissance'],
    summary:
      'From the late 15th century European ships crossed the oceans for the first time, seeking trade routes and reaching the Americas. Christopher Columbus made landfall in the Caribbean in 1492. The voyages opened global trade, European empires, and the brutal Atlantic slave trade.',
    wikipedia: 'https://en.wikipedia.org/wiki/Age_of_Discovery',
    questions: [
      {
        format: 'cloze',
        prompt: 'Christopher Columbus reached the Americas in the year ____.',
        answer: '1492',
      },
    ],
    edges: [{ to: 'industrial-revolution', relation: 'caused' }],
  },
  {
    id: 'protestant-reformation',
    name: 'The Protestant Reformation',
    domain: 'religions',
    approxYear: 1517,
    eras: ['renaissance'],
    summary:
      'A split in western Christianity that began in 1517 when the German monk Martin Luther publicly challenged the Catholic Church. With the printing press spreading his ideas, the movement created the Protestant churches and broke the Church\'s unity in western Europe, triggering more than a century of religious war.',
    wikipedia: 'https://en.wikipedia.org/wiki/Reformation',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Protestant Reformation began in 1517 when ____ Luther challenged the Catholic Church.',
        answer: 'Martin',
      },
      {
        format: 'contrast',
        prompt: 'Who began the Protestant Reformation in 1517?',
        answer: 'Martin Luther',
        distractors: ['John Calvin', 'King Henry VIII', 'Charlemagne'],
      },
    ],
    edges: [
      { to: 'christianity-core', relation: 'successor_of' },
      { to: 'printing-press', relation: 'influenced_by' },
    ],
  },
  {
    id: 'copernicus',
    name: 'Nicolaus Copernicus',
    domain: 'science',
    approxYear: 1543,
    eras: ['renaissance'],
    summary:
      'A Polish astronomer who argued, in a book published in 1543, that the Earth and planets orbit the Sun, not the other way around. This Sun-centred model overturned a view held since antiquity and opened the scientific revolution.',
    wikipedia: 'https://en.wikipedia.org/wiki/Nicolaus_Copernicus',
    questions: [
      {
        format: 'cloze',
        prompt: 'Copernicus argued that the Earth and planets orbit the ____.',
        answer: 'Sun',
      },
      {
        format: 'contrast',
        prompt: 'Who proposed that the Earth orbits the Sun, not the reverse?',
        answer: 'Copernicus',
        distractors: ['Isaac Newton', 'Aristotle', 'Charles Darwin'],
      },
    ],
    edges: [{ to: 'scientific-revolution', relation: 'caused' }],
  },
  {
    id: 'scientific-revolution',
    name: 'The Scientific Revolution',
    domain: 'science',
    approxYear: 1600,
    eras: ['enlightenment'],
    summary:
      'A transformation in how Europeans understood nature, roughly from Copernicus to Newton, that replaced ancient authority with observation and experiment. It established the scientific method and produced modern astronomy, physics, and biology.',
    wikipedia: 'https://en.wikipedia.org/wiki/Scientific_Revolution',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Scientific Revolution replaced ancient authority with observation and ____.',
        answer: 'experiment',
      },
    ],
    edges: [
      { to: 'isaac-newton', relation: 'caused' },
      { to: 'enlightenment', relation: 'caused' },
      { to: 'copernicus', relation: 'influenced_by' },
    ],
  },
  {
    id: 'isaac-newton',
    name: 'Isaac Newton',
    domain: 'science',
    approxYear: 1687,
    eras: ['enlightenment'],
    summary:
      'An English physicist and mathematician whose 1687 book set out the laws of motion and universal gravitation, explaining both falling apples and orbiting planets with the same mathematics. He also co-invented calculus. His physics governed science for over two centuries until Einstein.',
    wikipedia: 'https://en.wikipedia.org/wiki/Isaac_Newton',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/GodfreyKneller-IsaacNewton-1689.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Isaac Newton described the laws of motion and universal ____.',
        answer: 'gravitation',
      },
      {
        format: 'contrast',
        prompt: 'Whose laws of motion and gravity governed physics until Einstein?',
        answer: 'Isaac Newton',
        distractors: ['Galileo Galilei', 'Copernicus', 'Albert Einstein'],
      },
    ],
    edges: [
      { to: 'scientific-revolution', relation: 'part_of' },
      { to: 'albert-einstein', relation: 'influenced_by' },
    ],
  },
  {
    id: 'enlightenment',
    name: 'The Enlightenment',
    domain: 'culture',
    approxYear: 1700,
    eras: ['enlightenment'],
    summary:
      'An 18th-century movement of thinkers who held that reason, not tradition or religious authority, should govern human affairs. Figures like Voltaire, Locke, and Montesquieu argued for rights, tolerance, and government by consent, providing the ideas behind the American and French revolutions.',
    wikipedia: 'https://en.wikipedia.org/wiki/Age_of_Enlightenment',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Enlightenment held that ____, not tradition, should govern human affairs.',
        answer: 'reason',
      },
    ],
    edges: [
      { to: 'separation-of-powers', relation: 'caused' },
      { to: 'french-revolution', relation: 'caused' },
      { to: 'american-revolution', relation: 'caused' },
    ],
  },
  {
    id: 'separation-of-powers',
    name: 'Separation of powers',
    domain: 'politics',
    approxYear: 1748,
    eras: ['enlightenment'],
    summary:
      'The principle that the three functions of government, making laws, carrying them out, and judging them, should be held by separate branches so none can dominate. The French thinker Montesquieu set it out in 1748, and the United States built it into its constitution.',
    wikipedia: 'https://en.wikipedia.org/wiki/Separation_of_powers',
    questions: [
      {
        format: 'cloze',
        prompt: 'Separation of powers splits government into legislative, executive, and ____ branches.',
        answer: 'judicial',
      },
      {
        format: 'contrast',
        prompt: 'Which French thinker set out the separation of powers in 1748?',
        answer: 'Montesquieu',
        distractors: ['Voltaire', 'Rousseau', 'John Locke'],
      },
    ],
    edges: [
      { to: 'enlightenment', relation: 'part_of' },
      { to: 'american-revolution', relation: 'influenced_by' },
      { to: 'parliamentary-vs-presidential', relation: 'caused' },
    ],
  },
  {
    id: 'american-revolution',
    name: 'The American Revolution',
    domain: 'history',
    approxYear: 1776,
    eras: ['enlightenment'],
    lat: 39.95,
    lng: -75.16,
    summary:
      'The thirteen British colonies in North America declared independence in 1776 and, after a war won with French help, founded the United States. Its Declaration of Independence put Enlightenment ideas of rights and consent of the governed into a founding document.',
    wikipedia: 'https://en.wikipedia.org/wiki/American_Revolution',
    questions: [
      {
        format: 'cloze',
        prompt: 'The American colonies declared independence from Britain in the year ____.',
        answer: '1776',
      },
    ],
    edges: [
      { to: 'enlightenment', relation: 'influenced_by' },
      { to: 'french-revolution', relation: 'influenced_by' },
      { to: 'separation-of-powers', relation: 'influenced_by' },
    ],
  },
  {
    id: 'french-revolution',
    name: 'The French Revolution',
    domain: 'history',
    approxYear: 1789,
    eras: ['revolution'],
    lat: 48.85,
    lng: 2.35,
    summary:
      'From 1789 France overthrew its monarchy in a decade of upheaval driven by debt, hunger, and Enlightenment ideas. The storming of the Bastille and the Declaration of the Rights of Man gave way to the Terror and then to Napoleon. It created the modern ideas of citizenship and secular government.',
    wikipedia: 'https://en.wikipedia.org/wiki/French_Revolution',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Prise_de_la_Bastille.jpg?width=300',
    questions: [
      { format: 'cloze', prompt: 'The French Revolution began in the year ____.', answer: '1789' },
      {
        format: 'contrast',
        prompt: 'The storming of which fortress-prison became the symbol of the French Revolution?',
        answer: 'The Bastille',
        distractors: ['The Tower of London', 'The Colosseum', 'Versailles'],
      },
    ],
    edges: [
      { to: 'enlightenment', relation: 'influenced_by' },
      { to: 'napoleon', relation: 'caused' },
      { to: 'parliamentary-vs-presidential', relation: 'caused' },
    ],
  },
  {
    id: 'napoleon',
    name: 'Napoleon Bonaparte',
    domain: 'history',
    approxYear: 1804,
    eras: ['revolution'],
    summary:
      'A general who rose in the French Revolution and crowned himself emperor in 1804. He conquered most of Europe and spread a reformed legal code, the Napoleonic Code, that still shapes law today. He was finally defeated at the Battle of Waterloo in 1815.',
    wikipedia: 'https://en.wikipedia.org/wiki/Napoleon',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Napoleon was finally defeated in 1815 at the Battle of ____.',
        answer: 'Waterloo',
      },
      {
        format: 'contrast',
        prompt: 'Which French emperor was defeated at Waterloo in 1815?',
        answer: 'Napoleon',
        distractors: ['Louis XVI', 'Charlemagne', 'Julius Caesar'],
      },
    ],
    edges: [{ to: 'french-revolution', relation: 'successor_of' }],
  },
  {
    id: 'industrial-revolution',
    name: 'The Industrial Revolution',
    domain: 'history',
    approxYear: 1800,
    eras: ['revolution', 'long19c'],
    summary:
      'From around 1760, beginning in Britain, production moved from hand and home to machine and factory. Steam power, the cotton mill, and the railway reorganised work, cities, and class. Almost everything about modern life, from urban living to climate change, traces back to it.',
    wikipedia: 'https://en.wikipedia.org/wiki/Industrial_Revolution',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Industrial Revolution began around 1760 in ____.',
        answer: 'Britain',
      },
      {
        format: 'contrast',
        prompt: 'What power source drove the first phase of the Industrial Revolution?',
        answer: 'Steam',
        distractors: ['Electricity', 'Oil', 'Coal gas'],
      },
    ],
    edges: [
      { to: 'uk-constituents', relation: 'located_in' },
      { to: 'karl-marx', relation: 'caused' },
      { to: 'nikola-tesla', relation: 'caused' },
    ],
  },
  {
    id: 'parliamentary-vs-presidential',
    name: 'Parliamentary vs presidential systems',
    domain: 'politics',
    approxYear: 1789,
    eras: ['revolution', 'long19c'],
    summary:
      'Two main ways democracies organise power. In a parliamentary system, like Britain\'s, the head of government comes from and depends on the legislature. In a presidential system, like the United States\', the president is elected separately and serves a fixed term.',
    wikipedia: 'https://en.wikipedia.org/wiki/Parliamentary_system',
    questions: [
      {
        format: 'cloze',
        prompt: 'In a ____ system the head of government is drawn from and depends on the legislature.',
        answer: 'parliamentary',
      },
      {
        format: 'contrast',
        prompt: 'In which system is the head of state elected separately and serves a fixed term?',
        answer: 'Presidential',
        distractors: ['Parliamentary', 'Monarchy', 'Federal'],
      },
    ],
    edges: [
      { to: 'separation-of-powers', relation: 'part_of' },
      { to: 'uk-government-structure', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'first-past-the-post',
    name: 'First-past-the-post voting',
    domain: 'politics',
    approxYear: 1700,
    eras: ['enlightenment', 'long19c'],
    summary:
      'A voting system where the candidate with the most votes in a district wins, even without a majority. Used in the UK and US, it tends to produce two big parties and can hand a party more seats than its share of votes. Most of continental Europe uses proportional representation instead.',
    wikipedia: 'https://en.wikipedia.org/wiki/First-past-the-post_voting',
    questions: [
      {
        format: 'cloze',
        prompt: 'First-past-the-post voting tends to produce a ____-party system.',
        answer: 'two',
        chipDistractors: ['three', 'one', 'multi'],
      },
    ],
    edges: [
      { to: 'uk-government-structure', relation: 'part_of' },
      { to: 'parliamentary-vs-presidential', relation: 'influenced_by' },
    ],
  },
]
