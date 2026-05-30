import type { BankConcept } from '../types'

// The Long 19th Century, The World Wars Era.

export const INDUSTRIAL: BankConcept[] = [
  {
    id: 'karl-marx',
    name: 'Karl Marx',
    domain: 'politics',
    approxYear: 1848,
    eras: ['long19c'],
    summary:
      'A German philosopher whose 1848 Communist Manifesto and later book Das Kapital argued that history is driven by class struggle and that capitalism would be overthrown by the workers. His ideas inspired socialist and communist movements that shaped the 20th century.',
    wikipedia: 'https://en.wikipedia.org/wiki/Karl_Marx',
    questions: [
      {
        format: 'cloze',
        prompt: 'Karl Marx argued that history is driven by ____ struggle.',
        answer: 'class',
      },
      {
        format: 'contrast',
        prompt: 'Who wrote the Communist Manifesto and Das Kapital?',
        answer: 'Karl Marx',
        distractors: ['Vladimir Lenin', 'Adam Smith', 'Charles Darwin'],
      },
    ],
    edges: [
      { to: 'industrial-revolution', relation: 'influenced_by' },
      { to: 'russian-revolution', relation: 'caused' },
      { to: 'cold-war', relation: 'caused' },
    ],
  },
  {
    id: 'charles-darwin',
    name: 'Charles Darwin',
    domain: 'science',
    approxYear: 1859,
    eras: ['long19c'],
    summary:
      'An English naturalist whose 1859 book On the Origin of Species set out evolution by natural selection: individuals better suited to their environment leave more offspring, so species change over time. It reframed all of biology and the human place in nature.',
    wikipedia: 'https://en.wikipedia.org/wiki/Charles_Darwin',
    questions: [
      {
        format: 'cloze',
        prompt: 'Darwin explained how species change over time through natural ____.',
        answer: 'selection',
      },
      {
        format: 'contrast',
        prompt: 'Who proposed evolution by natural selection in On the Origin of Species?',
        answer: 'Charles Darwin',
        distractors: ['Gregor Mendel', 'Isaac Newton', 'Louis Pasteur'],
      },
    ],
    edges: [{ to: 'industrial-revolution', relation: 'contemporary_of' }],
  },
  {
    id: 'american-civil-war',
    name: 'The American Civil War',
    domain: 'history',
    approxYear: 1861,
    eras: ['long19c'],
    lat: 38.0,
    lng: -79.0,
    summary:
      'A war from 1861 to 1865 between the northern United States and eleven southern states that seceded to preserve slavery. The north\'s victory kept the country united and led to the abolition of slavery. It remains the deadliest war in American history.',
    wikipedia: 'https://en.wikipedia.org/wiki/American_Civil_War',
    questions: [
      {
        format: 'cloze',
        prompt: 'The American Civil War was fought largely over the issue of ____.',
        answer: 'slavery',
      },
    ],
    edges: [{ to: 'abolition-of-slavery', relation: 'caused' }],
  },
  {
    id: 'abolition-of-slavery',
    name: 'The abolition of slavery',
    domain: 'politics',
    approxYear: 1865,
    eras: ['long19c'],
    summary:
      'Across the 19th century the legal slave trade and slavery were abolished: Britain banned the slave trade in 1807 and slavery in its empire in 1833, and the United States abolished slavery in 1865 after its civil war. The fight against slavery reshaped law and ideas of human rights.',
    wikipedia: 'https://en.wikipedia.org/wiki/Abolitionism',
    questions: [
      {
        format: 'cloze',
        prompt: 'The United States abolished slavery in ____, after its civil war.',
        answer: '1865',
      },
    ],
    edges: [{ to: 'american-civil-war', relation: 'successor_of' }],
  },
  {
    id: 'unification-of-germany',
    name: 'The unification of Germany',
    domain: 'history',
    approxYear: 1871,
    eras: ['long19c'],
    summary:
      'In 1871 the many German states were united into a single empire, engineered by the Prussian chancellor Otto von Bismarck through a series of short wars. A powerful new Germany at the centre of Europe upset the old balance of power and helped set the stage for the First World War.',
    wikipedia: 'https://en.wikipedia.org/wiki/Unification_of_Germany',
    questions: [
      {
        format: 'cloze',
        prompt: 'German unification in 1871 was engineered by the chancellor Otto von ____.',
        answer: 'Bismarck',
      },
    ],
    edges: [{ to: 'wwi-trigger', relation: 'caused' }],
  },
  {
    id: 'nikola-tesla',
    name: 'Nikola Tesla',
    domain: 'science',
    approxYear: 1888,
    eras: ['long19c', 'worldwars'],
    summary:
      'A Serbian-American inventor whose alternating-current (AC) system became the way almost all electricity is delivered today. He won the "war of the currents" against Thomas Edison, who backed direct current. He held about 300 patents and died poor and underappreciated.',
    wikipedia: 'https://en.wikipedia.org/wiki/Nikola_Tesla',
    questions: [
      {
        format: 'cloze',
        prompt: 'Tesla championed alternating current against Edison\'s ____ current.',
        answer: 'direct',
      },
      {
        format: 'contrast',
        prompt: 'Whose alternating-current system became the standard for delivering electricity?',
        answer: 'Nikola Tesla',
        distractors: ['Thomas Edison', 'Albert Einstein', 'Michael Faraday'],
      },
    ],
    edges: [
      { to: 'industrial-revolution', relation: 'part_of' },
      { to: 'albert-einstein', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'impressionism',
    name: 'Impressionism',
    domain: 'culture',
    approxYear: 1874,
    eras: ['long19c'],
    summary:
      'A French art movement of the 1860s to 1880s that painted the fleeting impression of a scene, especially the play of light, with loose visible brushstrokes. Rejected by the official galleries at first, painters like Monet and Renoir became some of the most loved artists in the world.',
    wikipedia: 'https://en.wikipedia.org/wiki/Impressionism',
    questions: [
      {
        format: 'cloze',
        prompt: 'Impressionism was a ____ art movement of the 1860s-1880s.',
        answer: 'French',
      },
      {
        format: 'contrast',
        prompt: 'Which painter is most associated with Impressionism and works like Water Lilies?',
        answer: 'Claude Monet',
        distractors: ['Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'],
      },
    ],
    edges: [{ to: 'the-renaissance', relation: 'successor_of' }],
  },
  {
    id: 'marie-curie',
    name: 'Marie Curie',
    domain: 'science',
    approxYear: 1903,
    eras: ['long19c', 'worldwars'],
    summary:
      'A Polish-French physicist and chemist who discovered the elements polonium and radium and coined the term radioactivity. She is the only person to win Nobel Prizes in two different sciences, physics and chemistry. She died of an illness caused by her long exposure to radiation.',
    wikipedia: 'https://en.wikipedia.org/wiki/Marie_Curie',
    questions: [
      {
        format: 'cloze',
        prompt: 'Marie Curie coined the term ____ for what unstable atoms emit.',
        answer: 'radioactivity',
      },
      {
        format: 'contrast',
        prompt: 'Who is the only person to win Nobel Prizes in two different sciences?',
        answer: 'Marie Curie',
        distractors: ['Albert Einstein', 'Isaac Newton', 'Charles Darwin'],
      },
    ],
    edges: [{ to: 'albert-einstein', relation: 'contemporary_of' }],
  },
  {
    id: 'albert-einstein',
    name: 'Albert Einstein',
    domain: 'science',
    approxYear: 1915,
    eras: ['long19c', 'worldwars'],
    summary:
      'A German-born physicist who reshaped our picture of reality. His 1905 theory of special relativity gave the famous equation E=mc squared, and his 1915 general relativity recast gravity as the bending of space and time. He fled Nazi Germany and warned the US that nuclear weapons were possible.',
    wikipedia: 'https://en.wikipedia.org/wiki/Albert_Einstein',
    questions: [
      {
        format: 'cloze',
        prompt: 'Einstein\'s theory of relativity gave the equation E=mc____.',
        answer: 'squared',
        chipDistractors: ['cubed', 'plus one', 'over two'],
      },
      {
        format: 'contrast',
        prompt: 'Whose theory of general relativity recast gravity as the bending of space and time?',
        answer: 'Albert Einstein',
        distractors: ['Isaac Newton', 'Nikola Tesla', 'Niels Bohr'],
      },
    ],
    edges: [
      { to: 'isaac-newton', relation: 'successor_of' },
      { to: 'nuclear-weapons', relation: 'caused' },
    ],
  },
  {
    id: 'uk-government-structure',
    name: 'How the UK is governed',
    domain: 'politics',
    approxYear: 1700,
    eras: ['long19c'],
    summary:
      'The United Kingdom is a constitutional monarchy with a parliamentary democracy. The monarch is head of state but holds only ceremonial power; the prime minister, leader of the largest party in the elected House of Commons, runs the government. There is no single written constitution.',
    wikipedia: 'https://en.wikipedia.org/wiki/Government_of_the_United_Kingdom',
    questions: [
      {
        format: 'cloze',
        prompt: 'The UK head of government is the ____, not the monarch.',
        answer: 'prime minister',
      },
      {
        format: 'contrast',
        prompt: 'The UK lower house, whose largest party forms the government, is called the House of what?',
        answer: 'Commons',
        distractors: ['Lords', 'Representatives', 'Parliament'],
      },
    ],
    edges: [
      { to: 'parliamentary-vs-presidential', relation: 'part_of' },
      { to: 'magna-carta', relation: 'influenced_by' },
    ],
  },
  {
    id: 'uk-constituents',
    name: 'The four countries of the UK',
    domain: 'geography',
    approxYear: 1707,
    eras: ['long19c'],
    lat: 54.0,
    lng: -2.5,
    summary:
      'The United Kingdom is a union of four countries: England, Scotland, Wales, and Northern Ireland. England is by far the largest by population. Scotland, Wales, and Northern Ireland each have their own devolved parliament or assembly handling matters like health and education.',
    wikipedia: 'https://en.wikipedia.org/wiki/Countries_of_the_United_Kingdom',
    questions: [
      {
        format: 'cloze',
        prompt: 'The four UK countries are England, Scotland, Wales, and ____ Ireland.',
        answer: 'Northern',
      },
    ],
    edges: [
      { to: 'uk-government-structure', relation: 'part_of' },
      { to: 'industrial-revolution', relation: 'influenced_by' },
    ],
  },
  {
    id: 'wwi-trigger',
    name: 'The outbreak of World War I',
    domain: 'history',
    approxYear: 1914,
    eras: ['worldwars'],
    lat: 43.85,
    lng: 18.41,
    summary:
      'In June 1914 the assassination of Archduke Franz Ferdinand of Austria-Hungary in Sarajevo set off a chain of alliances that pulled Europe into war within weeks. The deeper causes were great-power rivalry and a tangle of mutual-defence treaties. The war lasted until 1918 and killed millions.',
    wikipedia: 'https://en.wikipedia.org/wiki/World_War_I',
    questions: [
      {
        format: 'cloze',
        prompt: 'World War I was triggered by an assassination in the city of ____ in 1914.',
        answer: 'Sarajevo',
      },
      {
        format: 'contrast',
        prompt: 'Whose assassination in 1914 set off the chain of events leading to World War I?',
        answer: 'Archduke Franz Ferdinand',
        distractors: ['Kaiser Wilhelm II', 'Tsar Nicholas II', 'Otto von Bismarck'],
      },
    ],
    edges: [
      { to: 'unification-of-germany', relation: 'successor_of' },
      { to: 'treaty-of-versailles', relation: 'caused' },
      { to: 'russian-revolution', relation: 'caused' },
    ],
  },
  {
    id: 'russian-revolution',
    name: 'The Russian Revolution',
    domain: 'history',
    approxYear: 1917,
    eras: ['worldwars'],
    lat: 59.93,
    lng: 30.34,
    summary:
      'In 1917, amid the suffering of World War I, revolution swept away the Russian monarchy and brought Lenin\'s Bolsheviks to power, the first communist government. It created the Soviet Union and made Marx\'s ideas a world force, setting up the Cold War decades later.',
    wikipedia: 'https://en.wikipedia.org/wiki/Russian_Revolution',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Russian Revolution of 1917 brought ____ and the Bolsheviks to power.',
        answer: 'Lenin',
      },
      {
        format: 'contrast',
        prompt: 'The 1917 Russian Revolution created which country?',
        answer: 'The Soviet Union',
        distractors: ['Yugoslavia', 'The Russian Empire', 'East Germany'],
      },
    ],
    edges: [
      { to: 'karl-marx', relation: 'influenced_by' },
      { to: 'cold-war', relation: 'caused' },
      { to: 'fall-of-soviet-union', relation: 'caused' },
    ],
  },
  {
    id: 'treaty-of-versailles',
    name: 'The Treaty of Versailles',
    domain: 'modern_world',
    approxYear: 1919,
    eras: ['worldwars'],
    summary:
      'The 1919 treaty that ended World War I. It blamed Germany for the war, demanded heavy reparations, and stripped it of territory. Most historians agree it humiliated Germany without crippling it, feeding the resentment that helped Hitler rise and led to World War II twenty years later.',
    wikipedia: 'https://en.wikipedia.org/wiki/Treaty_of_Versailles',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Treaty of Versailles, signed in ____, ended World War I.',
        answer: '1919',
      },
    ],
    edges: [
      { to: 'wwi-trigger', relation: 'successor_of' },
      { to: 'world-war-two', relation: 'caused' },
    ],
  },
  {
    id: 'great-depression',
    name: 'The Great Depression',
    domain: 'history',
    approxYear: 1929,
    eras: ['worldwars'],
    summary:
      'The worst economic slump of the 20th century, beginning with the Wall Street crash of 1929 and spreading worldwide. Banks failed, trade collapsed, and unemployment soared for a decade. The hardship it caused helped extremist movements, including the Nazis, gain support.',
    wikipedia: 'https://en.wikipedia.org/wiki/Great_Depression',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Great Depression began with the Wall Street crash of ____.',
        answer: '1929',
      },
    ],
    edges: [{ to: 'world-war-two', relation: 'caused' }],
  },
  {
    id: 'world-war-two',
    name: 'World War II',
    domain: 'history',
    approxYear: 1939,
    eras: ['worldwars'],
    summary:
      'The deadliest conflict in history, from 1939 to 1945, fought between the Allies and the Axis powers led by Nazi Germany, Italy, and Japan. It killed an estimated 70 to 85 million people, included the Holocaust, and ended with the first use of nuclear weapons. It reshaped the entire world order.',
    wikipedia: 'https://en.wikipedia.org/wiki/World_War_II',
    questions: [
      {
        format: 'cloze',
        prompt: 'World War II was fought between the Allies and the ____ powers.',
        answer: 'Axis',
      },
      {
        format: 'contrast',
        prompt: 'World War II ended in which year?',
        answer: '1945',
        distractors: ['1918', '1939', '1949'],
      },
    ],
    edges: [
      { to: 'treaty-of-versailles', relation: 'successor_of' },
      { to: 'the-holocaust', relation: 'caused' },
      { to: 'nuclear-weapons', relation: 'caused' },
      { to: 'cold-war', relation: 'caused' },
      { to: 'united-nations', relation: 'caused' },
    ],
  },
  {
    id: 'the-holocaust',
    name: 'The Holocaust',
    domain: 'history',
    approxYear: 1942,
    eras: ['worldwars'],
    summary:
      'The systematic murder of about six million Jews by Nazi Germany and its collaborators during World War II, along with millions of others. It was carried out in ghettos and death camps such as Auschwitz. It stands as the defining genocide of the modern age and shaped postwar human-rights law.',
    wikipedia: 'https://en.wikipedia.org/wiki/The_Holocaust',
    questions: [
      {
        format: 'cloze',
        prompt: 'In the Holocaust, Nazi Germany murdered about six million ____.',
        answer: 'Jews',
      },
    ],
    edges: [{ to: 'world-war-two', relation: 'part_of' }],
  },
  {
    id: 'nuclear-weapons',
    name: 'Nuclear weapons',
    domain: 'science',
    approxYear: 1945,
    eras: ['worldwars'],
    lat: 34.39,
    lng: 132.45,
    summary:
      'The first atomic bombs were developed by the United States in the Manhattan Project and dropped on the Japanese cities of Hiroshima and Nagasaki in August 1945, ending World War II. Their terrifying power defined the Cold War, when the US and USSR built enough to destroy the world many times over.',
    wikipedia: 'https://en.wikipedia.org/wiki/Nuclear_weapon',
    questions: [
      {
        format: 'cloze',
        prompt: 'The first atomic bomb used in war was dropped on the Japanese city of ____ in 1945.',
        answer: 'Hiroshima',
      },
    ],
    edges: [
      { to: 'world-war-two', relation: 'part_of' },
      { to: 'cold-war', relation: 'caused' },
    ],
  },
  {
    id: 'western-canon',
    name: 'The Western canon',
    domain: 'culture',
    approxYear: 1900,
    eras: ['long19c', 'worldwars'],
    summary:
      'A loose, much-debated list of the books, art, and music considered most influential in Western culture, running from Homer and Shakespeare to Tolstoy and beyond. There is no official version, and since the late 20th century it has been criticised for being too narrow and defended for preserving lasting works.',
    wikipedia: 'https://en.wikipedia.org/wiki/Western_canon',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Western canon traditionally begins with the ancient Greek poet ____.',
        answer: 'Homer',
      },
    ],
    edges: [{ to: 'the-renaissance', relation: 'influenced_by' }],
  },
]
