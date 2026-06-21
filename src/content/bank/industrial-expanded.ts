import type { BankConcept } from '../types'

export const INDUSTRIAL_EXPANDED: BankConcept[] = [
  // â”€â”€â”€ Industrial & Technological â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'steam-engine',
    name: 'The Steam Engine',
    domain: 'science',
    approxYear: 1769,
    eras: ['revolution', 'long19c'],
    summary:
      'A machine that converts heat from burning fuel into mechanical motion, perfected by James Watt in 1769 with a separate condenser that made it far more efficient. It powered the textile mills, mines, and railways of the Industrial Revolution, multiplying human productive capacity by orders of magnitude. By 1800 there were over 500 Watt engines running in British mines and factories alone.',
    wikipedia: 'https://en.wikipedia.org/wiki/Steam_engine',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Boulton_and_Watt_steam_engine_1784.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The steam engine was perfected by James ____ in 1769.',
        answer: 'Watt',
      },
      {
        format: 'contrast',
        prompt: 'What did the steam engine convert into mechanical motion?',
        answer: 'Heat from burning fuel',
        distractors: ['Wind', 'Water pressure', 'Animal muscle power'],
      },
    ],
    edges: [
      { to: 'industrial-revolution', relation: 'caused' },
      { to: 'railways-locomotive', relation: 'caused' },
      { to: 'textile-mills', relation: 'caused' },
    ],
  },

  {
    id: 'railways-locomotive',
    name: 'Railways and the Locomotive',
    domain: 'science',
    approxYear: 1825,
    eras: ['long19c'],
    summary:
      "George Stephenson's Locomotion hauled the world's first passenger steam railway in England in 1825, and by 1850 Britain had 6,000 miles of track. Railways collapsed travel times, opened national markets, and were the single largest investment of the 19th century, demanding iron, coal, and a new industrial workforce.",
    wikipedia: 'https://en.wikipedia.org/wiki/History_of_rail_transport',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Stephenson%27s_Rocket.png?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: "The world's first passenger steam railway opened in ____ in 1825.",
        answer: 'England',
      },
      {
        format: 'contrast',
        prompt: 'Who built the Locomotion, the first steam railway engine to carry passengers?',
        answer: 'George Stephenson',
        distractors: ['James Watt', 'Isambard Kingdom Brunel', 'Richard Trevithick'],
      },
    ],
    edges: [
      { to: 'steam-engine', relation: 'influenced_by' },
      { to: 'industrial-revolution', relation: 'part_of' },
      { to: 'urbanisation', relation: 'caused' },
    ],
  },

  {
    id: 'cotton-gin',
    name: 'The Cotton Gin',
    domain: 'science',
    approxYear: 1793,
    eras: ['revolution', 'long19c'],
    summary:
      'Invented by Eli Whitney in 1793, the cotton gin mechanised the separation of cotton fibres from their seeds, making cotton cultivation enormously profitable in the American South. It accelerated the expansion of plantation slavery just as Northern voices were beginning to question it, deepening the contradictions that led to the American Civil War.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cotton_gin',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cotton_gin_EWM_2007.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The cotton gin was invented by Eli ____ in 1793.',
        answer: 'Whitney',
      },
      {
        format: 'contrast',
        prompt: 'What did the cotton gin mechanise?',
        answer: 'Separating cotton fibres from seeds',
        distractors: ['Spinning cotton into thread', 'Weaving cotton into cloth', 'Harvesting cotton from plants'],
      },
    ],
    edges: [
      { to: 'american-civil-war', relation: 'caused' },
      { to: 'abolition-of-slavery', relation: 'influenced_by' },
      { to: 'textile-mills', relation: 'caused' },
    ],
  },

  {
    id: 'textile-mills',
    name: 'Textile Mills and the Factory System',
    domain: 'history',
    approxYear: 1771,
    eras: ['revolution', 'long19c'],
    lat: 53.0,
    lng: -1.5,
    summary:
      "Richard Arkwright's water-powered spinning frame, installed at Cromford in 1771, created the template for the factory system: large buildings, specialised machines, and hundreds of workers all co-ordinated under one roof. Within a generation, Britain's cotton output increased a hundredfold and artisan spinning was economically dead.",
    wikipedia: 'https://en.wikipedia.org/wiki/Factory_system',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cottonopolis.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The factory system was pioneered by Richard Arkwright at ____ in 1771.',
        answer: 'Cromford',
      },
      {
        format: 'contrast',
        prompt: 'What was the key innovation of the factory system compared to earlier craft production?',
        answer: 'Concentrating workers and machines in one building',
        distractors: ['Using horses instead of water power', 'Training workers as all-round craftsmen', 'Selling goods directly to customers'],
      },
    ],
    edges: [
      { to: 'steam-engine', relation: 'influenced_by' },
      { to: 'industrial-revolution', relation: 'part_of' },
      { to: 'luddites', relation: 'caused' },
      { to: 'child-labour', relation: 'caused' },
      { to: 'urbanisation', relation: 'caused' },
    ],
  },

  {
    id: 'luddites',
    name: 'The Luddites',
    domain: 'history',
    approxYear: 1811,
    eras: ['revolution', 'long19c'],
    lat: 53.8,
    lng: -1.5,
    summary:
      'English textile workers who from 1811 to 1816 smashed the new machinery they believed was destroying their livelihoods. Named after the mythical "General Ludd," they were not opposed to technology in principle but to wage-cutting and the destruction of skilled trades. The British government sent more troops to suppress them than it had deployed against Napoleon.',
    wikipedia: 'https://en.wikipedia.org/wiki/Luddite',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Luddites were English textile workers who smashed ____ from 1811 to 1816.',
        answer: 'machinery',
      },
      {
        format: 'contrast',
        prompt: 'What were the Luddites primarily protesting?',
        answer: 'Loss of skilled jobs and wages to machinery',
        distractors: ['High food prices during the war with France', 'The lack of voting rights for workers', 'Child labour in factories'],
      },
    ],
    edges: [
      { to: 'textile-mills', relation: 'successor_of' },
      { to: 'trade-unions', relation: 'caused' },
    ],
  },

  {
    id: 'child-labour',
    name: 'Child Labour and the Factory Acts',
    domain: 'history',
    approxYear: 1833,
    eras: ['long19c'],
    summary:
      "Children as young as five worked in the early factories and mines, sometimes for 14-hour days. The British Factory Act of 1833 was the first effective legislation, prohibiting children under nine from textile mills and requiring two hours of schooling a day. A series of further acts across the century progressively extended protection and established the state's duty to regulate working conditions.",
    wikipedia: 'https://en.wikipedia.org/wiki/Factory_Acts',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Coal_mine_child_miners.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The British Factory Act of ____ was the first to effectively restrict child labour in textile mills.',
        answer: '1833',
      },
      {
        format: 'contrast',
        prompt: 'What did the 1833 Factory Act require for child workers?',
        answer: 'Two hours of schooling per day',
        distractors: ['A minimum wage', 'A maximum of eight working hours', 'Parental consent to work'],
      },
    ],
    edges: [
      { to: 'textile-mills', relation: 'successor_of' },
      { to: 'trade-unions', relation: 'influenced_by' },
    ],
  },

  {
    id: 'urbanisation',
    name: 'Urbanisation',
    domain: 'history',
    approxYear: 1850,
    eras: ['long19c'],
    summary:
      'The 19th century saw the most rapid shift from rural to urban living in history. England became the first country where more than half the population lived in towns (around 1850), driven by factory work. By 1900, London had four million people and cities like Manchester and Chicago had grown from small towns in a single lifetime, creating new problems of sanitation, poverty, and public order.',
    wikipedia: 'https://en.wikipedia.org/wiki/Urbanization_in_Europe',
    questions: [
      {
        format: 'cloze',
        prompt: 'England was the first country where over half the population lived in ____ by around 1850.',
        answer: 'towns',
      },
      {
        format: 'contrast',
        prompt: 'What primarily drove people into cities during the 19th century?',
        answer: 'Factory work',
        distractors: ['Famine', 'Military conscription', 'Religious pilgrimage'],
      },
    ],
    edges: [
      { to: 'industrial-revolution', relation: 'part_of' },
      { to: 'railways-locomotive', relation: 'influenced_by' },
      { to: 'germ-theory', relation: 'caused' },
    ],
  },

  {
    id: 'telegraph',
    name: 'The Electric Telegraph',
    domain: 'science',
    approxYear: 1844,
    eras: ['long19c'],
    summary:
      "Samuel Morse's electromagnetic telegraph sent the first long-distance message in 1844, and within twenty years wires crossed continents and oceans. The telegraph was the internet of the 19th century: it allowed stock markets, governments, and newspapers to communicate in minutes rather than days, shrinking the effective size of the world.",
    wikipedia: 'https://en.wikipedia.org/wiki/Electrical_telegraph',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Morse_telegraph_register.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Samuel Morse sent the first long-distance telegraph message in ____.',
        answer: '1844',
      },
      {
        format: 'contrast',
        prompt: 'What was the key advantage of the electric telegraph over previous communication?',
        answer: 'Near-instant long-distance communication',
        distractors: ['Lower cost than postal letters', 'The ability to send images', 'No need for skilled operators'],
      },
    ],
    edges: [
      { to: 'industrial-revolution', relation: 'part_of' },
      { to: 'telephone-bell', relation: 'caused' },
    ],
  },

  {
    id: 'telephone-bell',
    name: 'The Telephone',
    domain: 'science',
    approxYear: 1876,
    eras: ['long19c'],
    summary:
      'Alexander Graham Bell patented the telephone in 1876, transmitting the human voice over electrical wire for the first time. Within a decade telephone exchanges opened in major cities, and by 1900 there were over a million telephones in the United States. It transformed business, social life, and emergency services.',
    wikipedia: 'https://en.wikipedia.org/wiki/Telephone',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Alexander_Graham_Bell.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Alexander Graham Bell patented the telephone in ____.',
        answer: '1876',
      },
      {
        format: 'contrast',
        prompt: 'What did the telephone transmit that the telegraph could not?',
        answer: 'The human voice',
        distractors: ['Images', 'Written text', 'Morse code automatically'],
      },
    ],
    edges: [
      { to: 'telegraph', relation: 'successor_of' },
      { to: 'electromagnetism-faraday', relation: 'influenced_by' },
    ],
  },

  {
    id: 'photography',
    name: 'Photography',
    domain: 'culture',
    approxYear: 1839,
    eras: ['long19c'],
    summary:
      "Louis Daguerre's daguerreotype process, announced in Paris in 1839, made it possible for the first time to capture a permanent image of the world. Photography democratised portraiture, transformed journalism, and challenged painting to reinvent itself, contributing to the rise of Impressionism and modern art.",
    wikipedia: 'https://en.wikipedia.org/wiki/History_of_photography',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Boulevard_du_Temple_by_Daguerre.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: "The daguerreotype, the first practical photographic process, was announced in ____ in 1839.",
        answer: 'Paris',
      },
      {
        format: 'contrast',
        prompt: 'Who invented the daguerreotype, the first widely used photographic process?',
        answer: 'Louis Daguerre',
        distractors: ['George Eastman', 'NicÃ©phore NiÃ©pce', 'William Fox Talbot'],
      },
    ],
    edges: [
      { to: 'impressionism', relation: 'caused' },
      { to: 'xray-rontgen', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'xray-rontgen',
    name: 'X-rays',
    domain: 'science',
    approxYear: 1895,
    eras: ['long19c'],
    summary:
      'Wilhelm RÃ¶ntgen discovered X-rays in 1895 while experimenting with cathode-ray tubes, and within weeks produced the first X-ray image of his wife\'s hand, bones clearly visible. The discovery won the first Nobel Prize in Physics and transformed medicine by allowing doctors to see inside the body without surgery.',
    wikipedia: 'https://en.wikipedia.org/wiki/X-ray',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Xray_of_hand_by_Roentgen.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'X-rays were discovered by Wilhelm ____ in 1895.',
        answer: 'RÃ¶ntgen',
      },
      {
        format: 'contrast',
        prompt: 'What was the immediate medical application of X-rays?',
        answer: 'Imaging bones and organs without surgery',
        distractors: ['Killing bacteria', 'Anaesthetising patients', 'Detecting chemical elements'],
      },
    ],
    edges: [
      { to: 'marie-curie', relation: 'contemporary_of' },
      { to: 'germ-theory', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'germ-theory',
    name: 'Germ Theory',
    domain: 'science',
    approxYear: 1865,
    eras: ['long19c'],
    summary:
      'Louis Pasteur and Robert Koch proved in the 1860s and 1870s that specific microorganisms cause specific diseases, overturning the ancient idea of miasma (bad air) as the cause of illness. Koch identified the bacteria responsible for tuberculosis and cholera; Pasteur developed vaccines for anthrax and rabies. Together they founded modern microbiology and transformed medicine.',
    wikipedia: 'https://en.wikipedia.org/wiki/Germ_theory_of_disease',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Pasteur,_foto_av_FÃ©lix_Nadar.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Germ theory replaced the ancient belief that disease was caused by ____.',
        answer: 'miasma',
      },
      {
        format: 'contrast',
        prompt: 'Who developed vaccines for anthrax and rabies while proving germ theory?',
        answer: 'Louis Pasteur',
        distractors: ['Robert Koch', 'Joseph Lister', 'Edward Jenner'],
      },
    ],
    edges: [
      { to: 'urbanisation', relation: 'influenced_by' },
      { to: 'anaesthesia', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'anaesthesia',
    name: 'Anaesthesia',
    domain: 'science',
    approxYear: 1846,
    eras: ['long19c'],
    summary:
      'The first public demonstration of surgical anaesthesia using ether took place in Boston in 1846, and within months the technique spread worldwide. For the first time surgeons could operate without the patient thrashing in agony, making longer and more complex procedures survivable. Chloroform followed quickly and was used by Queen Victoria in childbirth in 1853.',
    wikipedia: 'https://en.wikipedia.org/wiki/History_of_general_anesthesia',
    questions: [
      {
        format: 'cloze',
        prompt: 'The first public surgical anaesthesia using ether was demonstrated in ____ in 1846.',
        answer: 'Boston',
      },
      {
        format: 'contrast',
        prompt: 'Why was anaesthesia a revolution in surgery?',
        answer: 'It allowed operations without the patient being conscious and in pain',
        distractors: ['It prevented infections after surgery', 'It reduced the need for blood transfusions', 'It allowed surgeons to work faster'],
      },
    ],
    edges: [
      { to: 'germ-theory', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'periodic-table',
    name: 'The Periodic Table',
    domain: 'science',
    approxYear: 1869,
    eras: ['long19c'],
    summary:
      'Dmitri Mendeleev published his periodic table in 1869, arranging all known elements by atomic weight and valency in a grid that revealed repeating patterns of chemical properties. Crucially, he left gaps for undiscovered elements and correctly predicted their properties. When gallium, scandium, and germanium were found in the following decade, exactly matching his predictions, the table was universally accepted.',
    wikipedia: 'https://en.wikipedia.org/wiki/Periodic_table',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mendeleev%27s_1869_periodic_table.png?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Dmitri ____ published the first periodic table of elements in 1869.',
        answer: 'Mendeleev',
      },
      {
        format: 'contrast',
        prompt: 'How did Mendeleev prove the predictive power of his periodic table?',
        answer: 'He left gaps for undiscovered elements and correctly predicted their properties',
        distractors: ['He synthesised new elements in his laboratory', 'He explained why atoms bond together', 'He showed elements could be converted into one another'],
      },
    ],
    edges: [
      { to: 'marie-curie', relation: 'caused' },
      { to: 'albert-einstein', relation: 'caused' },
    ],
  },

  {
    id: 'thermodynamics',
    name: 'Thermodynamics',
    domain: 'science',
    approxYear: 1850,
    eras: ['long19c'],
    summary:
      'The science of heat and energy, formalised by Sadi Carnot, James Joule, and Lord Kelvin in the mid-19th century. Its two great laws state that energy can neither be created nor destroyed, and that entropy always increases, meaning all processes waste some heat. Thermodynamics underpinned the design of steam engines, refrigerators, and eventually the entire power industry.',
    wikipedia: 'https://en.wikipedia.org/wiki/History_of_thermodynamics',
    questions: [
      {
        format: 'cloze',
        prompt: 'The first law of thermodynamics states that energy can neither be created nor ____.',
        answer: 'destroyed',
      },
      {
        format: 'contrast',
        prompt: 'What does the second law of thermodynamics state always increases?',
        answer: 'Entropy',
        distractors: ['Temperature', 'Pressure', 'Energy'],
      },
    ],
    edges: [
      { to: 'steam-engine', relation: 'influenced_by' },
      { to: 'industrial-revolution', relation: 'part_of' },
    ],
  },

  {
    id: 'electromagnetism-faraday',
    name: 'Electromagnetism',
    domain: 'science',
    approxYear: 1865,
    eras: ['long19c'],
    summary:
      'Michael Faraday demonstrated in 1831 that a moving magnetic field generates an electric current, the principle behind every electric generator and transformer. James Clerk Maxwell then unified electricity, magnetism, and light into a single mathematical theory in 1865, predicting radio waves twenty years before Hertz detected them. Their work laid the foundation for the electrical age.',
    wikipedia: 'https://en.wikipedia.org/wiki/Electromagnetism',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Michael_Faraday_sitting_crop.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Michael Faraday showed that a moving ____ field generates an electric current.',
        answer: 'magnetic',
      },
      {
        format: 'contrast',
        prompt: 'Who unified electricity, magnetism, and light into a single mathematical theory?',
        answer: 'James Clerk Maxwell',
        distractors: ['Michael Faraday', 'Nikola Tesla', 'Lord Kelvin'],
      },
    ],
    edges: [
      { to: 'nikola-tesla', relation: 'caused' },
      { to: 'telephone-bell', relation: 'caused' },
      { to: 'albert-einstein', relation: 'caused' },
    ],
  },

  // â”€â”€â”€ Political & Social 19th Century â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'congress-of-vienna',
    name: 'The Congress of Vienna',
    domain: 'history',
    approxYear: 1815,
    eras: ['revolution', 'long19c'],
    lat: 48.2,
    lng: 16.37,
    summary:
      'A conference of European great powers meeting in Vienna from 1814 to 1815 to redraw the map of Europe after Napoleon\'s defeat. Led by the Austrian minister Metternich, it restored conservative monarchies, created buffer states, and inaugurated a system of regular great-power consultation known as the Concert of Europe. For a generation it kept major European wars at bay.',
    wikipedia: 'https://en.wikipedia.org/wiki/Congress_of_Vienna',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Congress_of_Vienna.PNG?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Congress of Vienna in 1814-15 redrew the map of Europe after the defeat of ____.',
        answer: 'Napoleon',
      },
      {
        format: 'contrast',
        prompt: 'What system of diplomatic management did the Congress of Vienna create?',
        answer: 'The Concert of Europe',
        distractors: ['The League of Nations', 'The Holy Alliance of Monarchs', 'The European Balance Sheet'],
      },
    ],
    edges: [
      { to: 'napoleon', relation: 'successor_of' },
      { to: 'metternich-concert', relation: 'caused' },
      { to: 'revolutions-1848', relation: 'caused' },
    ],
  },

  {
    id: 'metternich-concert',
    name: 'Metternich and the Concert of Europe',
    domain: 'politics',
    approxYear: 1820,
    eras: ['long19c'],
    summary:
      'Klemens von Metternich, Austrian foreign minister from 1809 to 1848, was the dominant statesman of post-Napoleonic Europe. He used the Concert of Europe -- the system of great-power conferences -- to suppress liberal and nationalist revolutions across the continent. His era ended in 1848 when revolts swept him from power, forcing him to flee Vienna in disguise.',
    wikipedia: 'https://en.wikipedia.org/wiki/Klemens_von_Metternich',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Klemens_von_Metternich.PNG?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Metternich used the Concert of Europe to suppress ____ and nationalist revolutions.',
        answer: 'liberal',
      },
      {
        format: 'contrast',
        prompt: 'What ended Metternich\'s era as the dominant statesman of Europe?',
        answer: 'The 1848 revolutions that swept him from power',
        distractors: ['His defeat in the Crimean War', 'Napoleon III\'s coup in France', 'The unification of Germany'],
      },
    ],
    edges: [
      { to: 'congress-of-vienna', relation: 'part_of' },
      { to: 'revolutions-1848', relation: 'caused' },
    ],
  },

  {
    id: 'greek-independence',
    name: 'Greek War of Independence',
    domain: 'history',
    approxYear: 1821,
    eras: ['long19c'],
    lat: 37.97,
    lng: 23.73,
    summary:
      'Greece rose against Ottoman rule in 1821 in a war that captured the imagination of Romantic Europe: Byron died there, and writers across the continent hailed the Greeks as heirs of ancient democracy. After nine years of brutal fighting, the Great Powers intervened and Greece became the first nation to win independence from the Ottoman Empire in 1830.',
    wikipedia: 'https://en.wikipedia.org/wiki/Greek_War_of_Independence',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Delacroix-greece-expiring-on-the-ruins-of-missolonghi.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Greece won independence from the Ottoman Empire in ____.',
        answer: '1830',
      },
      {
        format: 'contrast',
        prompt: 'Which British Romantic poet died fighting for Greek independence?',
        answer: 'Lord Byron',
        distractors: ['Percy Shelley', 'John Keats', 'William Wordsworth'],
      },
    ],
    edges: [
      { to: 'romanticism', relation: 'contemporary_of' },
      { to: 'ottoman-empire-context', relation: 'influenced_by' },
      { to: 'romantic-nationalism', relation: 'influenced_by' },
    ],
  },

  {
    id: 'decembrist-revolt',
    name: 'The Decembrist Revolt',
    domain: 'history',
    approxYear: 1825,
    eras: ['long19c'],
    lat: 59.93,
    lng: 30.32,
    summary:
      'In December 1825 a group of liberal Russian army officers attempted a coup to prevent Tsar Nicholas I from taking the throne, demanding a constitution and an end to serfdom. The revolt was quickly crushed, the leaders hanged or exiled to Siberia, and Nicholas became the most reactionary ruler of his age. The Decembrists became martyrs to Russian liberals for the rest of the century.',
    wikipedia: 'https://en.wikipedia.org/wiki/Decembrist_revolt',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Decembrist revolt of 1825 tried to prevent ____ I from becoming Tsar of Russia.',
        answer: 'Nicholas',
      },
      {
        format: 'contrast',
        prompt: 'What did the Decembrist officers demand?',
        answer: 'A constitution and the end of serfdom',
        distractors: ['The return of Napoleon\'s son as emperor', 'Independence for Poland and Finland', 'Free trade with Britain and France'],
      },
    ],
    edges: [
      { to: 'russian-revolution', relation: 'caused' },
      { to: 'revolutions-1848', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'revolutions-1848',
    name: 'The 1848 Revolutions',
    domain: 'history',
    approxYear: 1848,
    eras: ['long19c'],
    summary:
      'In 1848 revolutions exploded across Europe in a matter of weeks, toppling or shaking governments in France, the German states, Austria, Hungary, and Italy. Driven by liberal demands for constitutions and nationalist demands for self-rule, they briefly seemed to promise a new Europe. Within two years almost all had been crushed, but the old order was never quite the same.',
    wikipedia: 'https://en.wikipedia.org/wiki/Revolutions_of_1848',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Revolutions of ____ swept across France, the German states, Austria, Hungary, and Italy.',
        answer: '1848',
      },
      {
        format: 'contrast',
        prompt: 'What two main forces drove the 1848 revolutions?',
        answer: 'Liberalism and nationalism',
        distractors: ['Socialism and anarchism', 'Republicanism and imperialism', 'Communism and conservatism'],
      },
    ],
    edges: [
      { to: 'metternich-concert', relation: 'successor_of' },
      { to: 'karl-marx', relation: 'contemporary_of' },
      { to: 'romantic-nationalism', relation: 'influenced_by' },
      { to: 'italian-risorgimento', relation: 'caused' },
    ],
  },

  {
    id: 'irish-famine',
    name: 'The Irish Famine',
    domain: 'history',
    approxYear: 1845,
    eras: ['long19c'],
    lat: 53.3,
    lng: -8.0,
    summary:
      'The failure of the potato crop in Ireland from 1845 to 1852 caused approximately one million deaths from starvation and disease and drove another million to emigrate in those years alone. The British government\'s inadequate response was widely blamed, and Irish resentment deepened the campaign for independence. Ireland\'s population, eight million before the famine, had not recovered to that level by the 21st century.',
    wikipedia: 'https://en.wikipedia.org/wiki/Great_Famine_(Ireland)',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Illustrated_London_News_-_Skibbereen.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Irish Famine of 1845-52 was caused by the failure of the ____ crop.',
        answer: 'potato',
      },
      {
        format: 'contrast',
        prompt: 'Approximately how many died in the Irish Famine?',
        answer: 'One million',
        distractors: ['Ten thousand', 'One hundred thousand', 'Five million'],
      },
    ],
    edges: [
      { to: 'urbanisation', relation: 'caused' },
    ],
  },

  {
    id: 'chartism',
    name: 'Chartism and Working-Class Movements',
    domain: 'politics',
    approxYear: 1838,
    eras: ['long19c'],
    summary:
      'Chartism was the first mass working-class political movement, active in Britain from 1838 to 1857, demanding the vote for all men, a secret ballot, and payment for Members of Parliament. The movement gathered millions of signatures on petitions and held mass rallies. Though Parliament rejected all three petitions, five of the six Chartist demands eventually became law by 1918.',
    wikipedia: 'https://en.wikipedia.org/wiki/Chartism',
    questions: [
      {
        format: 'cloze',
        prompt: 'Chartism demanded votes for all ____ and a secret ballot, among other democratic reforms.',
        answer: 'men',
      },
      {
        format: 'contrast',
        prompt: 'What was Chartism\'s main method of political pressure?',
        answer: 'Mass petitions to Parliament',
        distractors: ['Armed revolution', 'General strikes', 'Electoral campaigns'],
      },
    ],
    edges: [
      { to: 'trade-unions', relation: 'caused' },
      { to: 'womens-suffrage', relation: 'caused' },
      { to: 'industrial-revolution', relation: 'influenced_by' },
    ],
  },

  {
    id: 'trade-unions',
    name: 'Trade Unions',
    domain: 'politics',
    approxYear: 1868,
    eras: ['long19c'],
    summary:
      'Workers began forming unions to collectively bargain with employers for better wages and conditions throughout the 19th century. In Britain, the Trades Union Congress formed in 1868; in the United States, the American Federation of Labor in 1886. Unions won limits on working hours, safe working conditions, and eventually political representation, underpinning the rise of labour and social-democratic parties.',
    wikipedia: 'https://en.wikipedia.org/wiki/History_of_trade_unions',
    questions: [
      {
        format: 'cloze',
        prompt: 'Workers formed trade unions to collectively ____ with employers for better wages and conditions.',
        answer: 'bargain',
      },
      {
        format: 'contrast',
        prompt: 'When did the Trades Union Congress, the umbrella body for British unions, form?',
        answer: '1868',
        distractors: ['1832', '1848', '1900'],
      },
    ],
    edges: [
      { to: 'chartism', relation: 'influenced_by' },
      { to: 'luddites', relation: 'influenced_by' },
      { to: 'child-labour', relation: 'caused' },
      { to: 'socialism-early', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'womens-suffrage',
    name: "Women's Suffrage Movement",
    domain: 'politics',
    approxYear: 1848,
    eras: ['long19c'],
    summary:
      'Organised campaigns for women\'s right to vote began at the Seneca Falls Convention in New York in 1848, which produced the Declaration of Sentiments demanding equal rights. In Britain the movement split between the constitutional suffragists and the militant Suffragettes led by Emmeline Pankhurst, who chained themselves to railings and went on hunger strikes. New Zealand became the first country to grant women the vote in 1893.',
    wikipedia: "https://en.wikipedia.org/wiki/Women%27s_suffrage",
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Suffragette_leaders,_1913.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: "The organised campaign for women's suffrage began at the ____ Convention in New York in 1848.",
        answer: 'Seneca Falls',
      },
      {
        format: 'contrast',
        prompt: 'Which country was the first to grant women the right to vote?',
        answer: 'New Zealand',
        distractors: ['United Kingdom', 'United States', 'Australia'],
      },
    ],
    edges: [
      { to: 'chartism', relation: 'influenced_by' },
      { to: 'civil-rights-movement', relation: 'caused' },
    ],
  },

  {
    id: 'paris-commune',
    name: 'The Paris Commune',
    domain: 'history',
    approxYear: 1871,
    eras: ['long19c'],
    lat: 48.85,
    lng: 2.35,
    summary:
      'For 72 days in 1871 the workers of Paris seized control of the city and set up a radical self-governing commune following France\'s defeat in the Franco-Prussian War. The French government in Versailles sent the army in, and during the "Bloody Week" around 10,000 communards were killed. The Commune became the model for later socialist and communist revolutionaries including Marx and Lenin.',
    wikipedia: 'https://en.wikipedia.org/wiki/Paris_Commune',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Paris_Commune_Barricade.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Paris Commune lasted ____ days in 1871 before being crushed by the French army.',
        answer: '72',
      },
      {
        format: 'contrast',
        prompt: 'What inspired the Paris Commune to seize power in 1871?',
        answer: "France's defeat in the Franco-Prussian War",
        distractors: ['The assassination of the French emperor', 'A general strike called by trade unions', 'Bread riots caused by famine'],
      },
    ],
    edges: [
      { to: 'karl-marx', relation: 'influenced_by' },
      { to: 'socialism-early', relation: 'part_of' },
      { to: 'russian-revolution', relation: 'caused' },
    ],
  },

  // â”€â”€â”€ Nationalism & Empires â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'romantic-nationalism',
    name: 'Romantic Nationalism',
    domain: 'culture',
    approxYear: 1830,
    eras: ['long19c'],
    summary:
      'A movement holding that each "nation" -- defined by shared language, history, and culture -- deserved its own state. It inspired the collection of folk tales by the Brothers Grimm, the composition of national anthems and operas, and the political revolutions of 1848. By the end of the century it had reshaped the map of Europe and was destabilising the great multi-ethnic empires.',
    wikipedia: 'https://en.wikipedia.org/wiki/Romantic_nationalism',
    questions: [
      {
        format: 'cloze',
        prompt: 'Romantic nationalism held that each nation defined by shared language and culture deserved its own ____.',
        answer: 'state',
      },
      {
        format: 'contrast',
        prompt: 'Which cultural project was driven by Romantic nationalism?',
        answer: 'Collecting folk tales and composing national anthems',
        distractors: ['Building cathedrals and sponsoring classical art', 'Translating the Bible into local languages', 'Mapping trade routes across the continent'],
      },
    ],
    edges: [
      { to: 'revolutions-1848', relation: 'caused' },
      { to: 'italian-risorgimento', relation: 'caused' },
      { to: 'unification-of-germany', relation: 'caused' },
      { to: 'romanticism', relation: 'part_of' },
    ],
  },

  {
    id: 'latin-american-independence',
    name: 'Latin American Independence',
    domain: 'history',
    approxYear: 1821,
    eras: ['revolution', 'long19c'],
    lat: 4.7,
    lng: -74.0,
    summary:
      'Between 1808 and 1826 almost all of Spain\'s and Portugal\'s American colonies won independence, inspired by the American and French revolutions and the opportunity created by Napoleon\'s invasion of the Iberian Peninsula. SimÃ³n BolÃ­var liberated what is now Venezuela, Colombia, Ecuador, Peru, and Bolivia in the north; JosÃ© de San MartÃ­n led campaigns in the south. Brazil peacefully separated from Portugal in 1822.',
    wikipedia: 'https://en.wikipedia.org/wiki/Latin_American_wars_of_independence',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sim%C3%B3n_Bol%C3%ADvar_by_Arturo_Michelena.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'SimÃ³n BolÃ­var liberated much of northern South America; JosÃ© de San ____ led campaigns in the south.',
        answer: 'MartÃ­n',
      },
      {
        format: 'contrast',
        prompt: 'What event in Europe created the opportunity for Latin American independence?',
        answer: "Napoleon's invasion of Spain and Portugal",
        distractors: ['The French Revolution of 1789', 'The British defeat of the Spanish Armada', 'The Congress of Vienna in 1815'],
      },
    ],
    edges: [
      { to: 'french-revolution', relation: 'influenced_by' },
      { to: 'american-revolution', relation: 'influenced_by' },
      { to: 'napoleon', relation: 'influenced_by' },
      { to: 'haitian-revolution', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'haitian-revolution',
    name: 'The Haitian Revolution',
    domain: 'history',
    approxYear: 1804,
    eras: ['revolution', 'long19c'],
    lat: 18.9,
    lng: -72.3,
    summary:
      'The Haitian Revolution of 1791 to 1804 was the only successful slave revolt in history and produced the world\'s first Black republic. Led by Toussaint Louverture and then Jean-Jacques Dessalines, the enslaved population of the French colony of Saint-Domingue defeated both the colonial army and Napoleon\'s expedition sent to restore slavery. Haiti\'s independence was a direct challenge to every slave-owning society in the Americas.',
    wikipedia: 'https://en.wikipedia.org/wiki/Haitian_Revolution',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toussaint_L%27Ouverture.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Haitian Revolution produced the world\'s first ____ republic in 1804.',
        answer: 'Black',
      },
      {
        format: 'contrast',
        prompt: 'What makes the Haitian Revolution unique in history?',
        answer: 'It was the only successful slave revolt that created an independent nation',
        distractors: ['It was the first revolution inspired by the French Revolution', 'It was the first to use guerrilla warfare', 'It overthrew a monarchy and established a republic'],
      },
    ],
    edges: [
      { to: 'french-revolution', relation: 'influenced_by' },
      { to: 'abolition-of-slavery', relation: 'caused' },
      { to: 'latin-american-independence', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'italian-risorgimento',
    name: 'Italian Risorgimento',
    domain: 'history',
    approxYear: 1861,
    eras: ['long19c'],
    lat: 41.9,
    lng: 12.5,
    summary:
      'The Risorgimento -- "resurgence" -- was the movement that unified the patchwork of Italian states into a single kingdom between 1848 and 1871. Giuseppe Garibaldi led the military campaigns in the south with his famous Red Shirts; Cavour handled the diplomacy in the north; and Victor Emmanuel II became the first king of unified Italy in 1861. Rome was added in 1870 when French troops withdrew.',
    wikipedia: 'https://en.wikipedia.org/wiki/Risorgimento',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Giuseppe_Garibaldi.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Italian Risorgimento unified Italy under Victor Emmanuel II in ____.',
        answer: '1861',
      },
      {
        format: 'contrast',
        prompt: 'Who led the military campaigns in southern Italy during the Risorgimento?',
        answer: 'Giuseppe Garibaldi',
        distractors: ['Count Cavour', 'Victor Emmanuel II', 'Giuseppe Mazzini'],
      },
    ],
    edges: [
      { to: 'revolutions-1848', relation: 'influenced_by' },
      { to: 'romantic-nationalism', relation: 'influenced_by' },
      { to: 'unification-of-germany', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'crimean-war',
    name: 'The Crimean War',
    domain: 'history',
    approxYear: 1853,
    eras: ['long19c'],
    lat: 44.9,
    lng: 34.1,
    summary:
      'From 1853 to 1856, Britain, France, and the Ottoman Empire fought Russia in the Crimean Peninsula, largely to check Russian expansion towards Constantinople. It was one of the first wars covered by telegraph and photography, making it visible to the public in a new way. Florence Nightingale\'s nursing reforms were a direct result, and Russia\'s humiliation accelerated reforms including the emancipation of the serfs in 1861.',
    wikipedia: 'https://en.wikipedia.org/wiki/Crimean_War',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Crimean War was fought mainly to prevent ____ expansion towards Constantinople.',
        answer: 'Russian',
      },
      {
        format: 'contrast',
        prompt: 'What civilian reform directly resulted from the Crimean War\'s exposure of military medical failures?',
        answer: "Florence Nightingale's nursing reforms",
        distractors: ['The creation of the Red Cross', 'Universal military conscription', 'The abolition of serfdom in Britain'],
      },
    ],
    edges: [
      { to: 'germ-theory', relation: 'caused' },
      { to: 'ottoman-empire-context', relation: 'part_of' },
    ],
  },

  {
    id: 'scramble-for-africa',
    name: 'The Scramble for Africa',
    domain: 'history',
    approxYear: 1884,
    eras: ['long19c'],
    summary:
      'Between 1880 and 1914 the European powers partitioned almost the entire African continent among themselves, claiming territories and drawing borders with little regard for existing kingdoms, ethnic groups, or geography. The Berlin Conference of 1884-85 set the rules for this division. By 1914 only Ethiopia and Liberia remained independent, and Africa\'s arbitrary borders remained a source of conflict after independence.',
    wikipedia: 'https://en.wikipedia.org/wiki/Scramble_for_Africa',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Scramble_for_Africa_1880_to_1913.png?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Berlin Conference of 1884-85 set the rules for European powers dividing ____ among themselves.',
        answer: 'Africa',
      },
      {
        format: 'contrast',
        prompt: 'Which African countries remained independent after the Scramble for Africa?',
        answer: 'Ethiopia and Liberia',
        distractors: ['Egypt and Sudan', 'Morocco and Tunisia', 'South Africa and Rhodesia'],
      },
    ],
    edges: [
      { to: 'decolonisation', relation: 'caused' },
      { to: 'british-india', relation: 'contemporary_of' },
      { to: 'suez-canal', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'british-india',
    name: 'British India: the Raj',
    domain: 'history',
    approxYear: 1858,
    eras: ['long19c'],
    lat: 20.5,
    lng: 78.9,
    summary:
      'The British East India Company had traded and gradually conquered large parts of India since the 1600s. After the 1857 Indian Rebellion -- called the Mutiny by the British -- the Company was abolished and the British Crown took direct control, creating the Indian Raj. India became "the jewel in the crown" of the British Empire, its largest colonial possession, and a source of cotton, tea, and soldiers.',
    wikipedia: 'https://en.wikipedia.org/wiki/British_Raj',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Queen_Victoria_-_Empress_of_India.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'After the 1857 Indian Rebellion, the British ____ took over direct control from the East India Company.',
        answer: 'Crown',
      },
      {
        format: 'contrast',
        prompt: 'What event in 1857 ended the East India Company\'s rule and created the British Raj?',
        answer: 'The Indian Rebellion',
        distractors: ['The Treaty of Paris', 'The Sepoy Mutiny against French forces', 'The Indian National Congress founding conference'],
      },
    ],
    edges: [
      { to: 'scramble-for-africa', relation: 'contemporary_of' },
      { to: 'decolonisation', relation: 'caused' },
    ],
  },

  {
    id: 'opium-wars',
    name: 'The Opium Wars',
    domain: 'history',
    approxYear: 1842,
    eras: ['long19c'],
    lat: 22.3,
    lng: 114.2,
    summary:
      'Britain fought two wars against China (1839-42 and 1856-60) to force it to allow the sale of opium produced in British India. China lost both, ceding Hong Kong to Britain and opening treaty ports to foreign trade. The Opium Wars began a "century of humiliation" for China, as Western powers carved out spheres of influence that weakened the Qing dynasty and fuelled the nationalism that shaped modern China.',
    wikipedia: 'https://en.wikipedia.org/wiki/Opium_Wars',
    questions: [
      {
        format: 'cloze',
        prompt: 'After the First Opium War, China ceded ____ to Britain.',
        answer: 'Hong Kong',
      },
      {
        format: 'contrast',
        prompt: 'What did Britain force China to accept in the Opium Wars?',
        answer: 'The legal trade of opium into China',
        distractors: ['The opening of Chinese ports to British missionaries', 'Chinese recognition of British sovereignty over India', 'The extradition of Chinese criminals to British courts'],
      },
    ],
    edges: [
      { to: 'boxer-rebellion', relation: 'caused' },
      { to: 'british-india', relation: 'influenced_by' },
    ],
  },

  {
    id: 'meiji-restoration',
    name: 'The Meiji Restoration',
    domain: 'history',
    approxYear: 1868,
    eras: ['long19c'],
    lat: 35.7,
    lng: 139.7,
    summary:
      'In 1868, Japanese reformers ended the centuries-long rule of the shoguns and restored power to Emperor Meiji, launching a rapid modernisation of Japan. They built a Western-style army and navy, railways, a constitution, and industries, transforming Japan from a feudal society to an industrial and imperial power in a single generation. By 1905, Japan defeated Russia in war, shocking the world.',
    wikipedia: 'https://en.wikipedia.org/wiki/Meiji_Restoration',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_Meiji_Emperor_of_Japan.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Meiji Restoration of 1868 ended the rule of the ____ and began Japan\'s rapid modernisation.',
        answer: 'shoguns',
      },
      {
        format: 'contrast',
        prompt: 'What demonstrated Japan\'s successful modernisation after the Meiji Restoration?',
        answer: 'Defeating Russia in the Russo-Japanese War of 1905',
        distractors: ['Conquering China in the Opium Wars', 'Joining the Concert of Europe in 1885', 'Building the first railway in Asia in 1875'],
      },
    ],
    edges: [
      { to: 'opium-wars', relation: 'influenced_by' },
      { to: 'wwi-trigger', relation: 'caused' },
    ],
  },

  {
    id: 'boxer-rebellion',
    name: 'The Boxer Rebellion',
    domain: 'history',
    approxYear: 1900,
    eras: ['long19c'],
    lat: 39.9,
    lng: 116.4,
    summary:
      'In 1900, Chinese nationalists known as Boxers, supported by the Qing Empress Dowager, besieged the foreign legations in Peking for 55 days, killing thousands of Chinese Christians and foreigners. An international force of eight nations crushed the rebellion. The resulting Boxer Protocol imposed a massive indemnity on China and humiliated the Qing dynasty, accelerating its collapse in 1911.',
    wikipedia: 'https://en.wikipedia.org/wiki/Boxer_Rebellion',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Boxer_Rebellion.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Boxer Rebellion of 1900 besieged the foreign legations in ____.',
        answer: 'Peking',
      },
      {
        format: 'contrast',
        prompt: 'What was the political consequence of the Boxer Rebellion for China?',
        answer: 'A massive indemnity that weakened the Qing dynasty',
        distractors: ['China winning recognition as a Great Power', 'The expulsion of all foreign missionaries', 'The opening of China to Japanese trade'],
      },
    ],
    edges: [
      { to: 'opium-wars', relation: 'successor_of' },
    ],
  },

  {
    id: 'suez-canal',
    name: 'The Suez Canal',
    domain: 'history',
    approxYear: 1869,
    eras: ['long19c'],
    lat: 30.0,
    lng: 32.5,
    summary:
      'The Suez Canal opened in Egypt in 1869, cutting the sea route from Britain to India by 4,000 miles by linking the Mediterranean to the Red Sea. Britain bought a controlling stake in 1875 and made Egypt effectively a protectorate. The canal became a symbol of imperial power and its nationalisation by Egypt in 1956 triggered the Suez Crisis, one of the defining moments of decolonisation.',
    wikipedia: 'https://en.wikipedia.org/wiki/Suez_Canal',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/SuezCanal.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Suez Canal, opened in 1869, linked the Mediterranean to the ____ Sea.',
        answer: 'Red',
      },
      {
        format: 'contrast',
        prompt: 'Why was the Suez Canal strategically vital to Britain?',
        answer: 'It shortened the sea route to India by 4,000 miles',
        distractors: ['It controlled access to oil fields in Persia', 'It gave Britain a naval base in the Middle East', 'It allowed steamships to avoid African pirates'],
      },
    ],
    edges: [
      { to: 'british-india', relation: 'part_of' },
      { to: 'scramble-for-africa', relation: 'contemporary_of' },
      { to: 'decolonisation', relation: 'caused' },
    ],
  },

  // â”€â”€â”€ Culture & Thought â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'romanticism',
    name: 'Romanticism',
    domain: 'culture',
    approxYear: 1800,
    eras: ['revolution', 'long19c'],
    summary:
      'A broad cultural movement from roughly 1780 to 1850 that reacted against Enlightenment rationalism with emotion, imagination, the sublime in nature, and the heroic individual. Its poets (Byron, Shelley, Keats in England; Goethe in Germany), painters (Delacroix, Turner), and composers (Beethoven, Schubert) made feeling and personal authenticity the highest values in art. It also fed political Romanticism and nationalist movements across Europe.',
    wikipedia: 'https://en.wikipedia.org/wiki/Romanticism',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Romanticism reacted against Enlightenment ____ by emphasising emotion and the heroic individual.',
        answer: 'rationalism',
      },
      {
        format: 'contrast',
        prompt: 'Which composer is most closely associated with the Romantic movement?',
        answer: 'Ludwig van Beethoven',
        distractors: ['Johann Sebastian Bach', 'Wolfgang Amadeus Mozart', 'Handel'],
      },
    ],
    edges: [
      { to: 'enlightenment', relation: 'successor_of' },
      { to: 'romantic-nationalism', relation: 'caused' },
      { to: 'realism-literature', relation: 'caused' },
      { to: 'greek-independence', relation: 'influenced_by' },
    ],
  },

  {
    id: 'realism-literature',
    name: 'Realism in Literature',
    domain: 'culture',
    approxYear: 1850,
    eras: ['long19c'],
    summary:
      'From the 1840s onwards, novelists turned away from Romantic idealism to depict ordinary life with unflinching accuracy. Charles Dickens exposed the misery of industrial England; Leo Tolstoy captured the vastness of Russian society; Ã‰mile Zola documented poverty and heredity with almost scientific rigour. Realist novels became vehicles for social criticism and laid the foundation for modern literature.',
    wikipedia: 'https://en.wikipedia.org/wiki/Realism_(arts)',
    questions: [
      {
        format: 'cloze',
        prompt: 'The realist novel turned from Romantic idealism to depict ____ life with unflinching accuracy.',
        answer: 'ordinary',
      },
      {
        format: 'contrast',
        prompt: 'Which novelist is most associated with exposing poverty and industrial misery in Victorian England?',
        answer: 'Charles Dickens',
        distractors: ['Leo Tolstoy', 'Ã‰mile Zola', 'George Eliot'],
      },
    ],
    edges: [
      { to: 'romanticism', relation: 'successor_of' },
      { to: 'industrial-revolution', relation: 'influenced_by' },
    ],
  },

  {
    id: 'sigmund-freud',
    name: 'Sigmund Freud',
    domain: 'science',
    approxYear: 1900,
    eras: ['long19c'],
    summary:
      'An Austrian neurologist who founded psychoanalysis, arguing that the unconscious mind -- with its repressed desires and childhood experiences -- drives human behaviour. His 1900 book The Interpretation of Dreams made the analysis of dreams a clinical tool. Though many of his specific theories have been revised or rejected, Freud\'s insight that we are not fully aware of our own mental processes transformed how Western culture thinks about the self.',
    wikipedia: 'https://en.wikipedia.org/wiki/Sigmund_Freud',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sigmund_Freud,_by_Max_Halberstadt_(cropped).jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Freud argued that the ____ mind, with its repressed desires, drives human behaviour.',
        answer: 'unconscious',
      },
      {
        format: 'contrast',
        prompt: 'What did Freud use as a clinical tool for understanding the unconscious mind?',
        answer: 'The analysis of dreams',
        distractors: ['Hypnosis alone', 'Drug-induced confessions', 'Measuring brain electrical activity'],
      },
    ],
    edges: [
      { to: 'nietzsche', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    domain: 'culture',
    approxYear: 1883,
    eras: ['long19c'],
    summary:
      'A German philosopher who declared that "God is dead" and that European culture had lost the values that once sustained it. He called for the creation of new values by exceptional individuals he called Ãœbermenschen, or "supermen." His work was hugely influential on existentialism and modernist art, but was also grotesquely distorted by the Nazis after his death.',
    wikipedia: 'https://en.wikipedia.org/wiki/Friedrich_Nietzsche',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nietzsche187a.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Nietzsche famously declared that "God is ____" in his 1882 work The Gay Science.',
        answer: 'dead',
      },
      {
        format: 'contrast',
        prompt: 'What did Nietzsche call individuals who would create new values to replace lost religious ones?',
        answer: 'Ãœbermenschen',
        distractors: ['Proletarians', 'Nationalists', 'Philosophers-kings'],
      },
    ],
    edges: [
      { to: 'sigmund-freud', relation: 'contemporary_of' },
      { to: 'the-holocaust', relation: 'influenced_by' },
    ],
  },

  {
    id: 'utilitarianism',
    name: 'Utilitarianism',
    domain: 'culture',
    approxYear: 1789,
    eras: ['revolution', 'long19c'],
    summary:
      'The ethical theory that the right action is whichever produces the greatest happiness for the greatest number, developed by Jeremy Bentham from the late 18th century and refined by John Stuart Mill. Utilitarianism provided the philosophical foundation for democratic reform, anti-slavery arguments, women\'s rights, and animal welfare. Mill\'s On Liberty (1859) remains the classic defence of individual freedom against the state.',
    wikipedia: 'https://en.wikipedia.org/wiki/Utilitarianism',
    questions: [
      {
        format: 'cloze',
        prompt: 'Utilitarianism holds that the right action produces the greatest happiness for the greatest ____.',
        answer: 'number',
      },
      {
        format: 'contrast',
        prompt: 'Who refined utilitarianism and wrote On Liberty in 1859?',
        answer: 'John Stuart Mill',
        distractors: ['Jeremy Bentham', 'John Locke', 'David Hume'],
      },
    ],
    edges: [
      { to: 'enlightenment', relation: 'influenced_by' },
      { to: 'womens-suffrage', relation: 'caused' },
      { to: 'abolition-of-slavery', relation: 'influenced_by' },
    ],
  },

  {
    id: 'socialism-early',
    name: 'Early and Utopian Socialism',
    domain: 'politics',
    approxYear: 1820,
    eras: ['long19c'],
    summary:
      'Before Marx, socialist thinkers like Robert Owen, Henri de Saint-Simon, and Charles Fourier proposed that society should be reorganised around cooperation rather than competition. Owen built model factory communities in Scotland and Indiana; Fourier designed elaborate "phalansteries." Marx dismissed these as "utopian" compared to his own "scientific" socialism, but they pioneered the idea that capitalism\'s ills could be cured by collective organisation.',
    wikipedia: 'https://en.wikipedia.org/wiki/Utopian_socialism',
    questions: [
      {
        format: 'cloze',
        prompt: 'Marx called earlier socialist thinkers like Owen and Fourier "____" socialists.',
        answer: 'utopian',
      },
      {
        format: 'contrast',
        prompt: 'What did early socialists like Robert Owen propose as an alternative to capitalism?',
        answer: 'Cooperative communities organised around shared labour',
        distractors: ['Revolution by the working class', 'Reform of the monarchy', 'Free trade between nations'],
      },
    ],
    edges: [
      { to: 'karl-marx', relation: 'caused' },
      { to: 'trade-unions', relation: 'caused' },
      { to: 'industrial-revolution', relation: 'influenced_by' },
    ],
  },

  {
    id: 'anarchism',
    name: 'Anarchism',
    domain: 'politics',
    approxYear: 1840,
    eras: ['long19c'],
    summary:
      'The political philosophy that all coercive authority -- including the state -- should be abolished in favour of free association and mutual aid. Pierre-Joseph Proudhon, who coined the term in 1840, argued "property is theft"; Mikhail Bakunin organised the anarchist wing of the labour movement. Anarchists were linked to a wave of political assassinations in the 1890s, including those of a US president, a French president, and an Austrian empress.',
    wikipedia: 'https://en.wikipedia.org/wiki/Anarchism',
    questions: [
      {
        format: 'cloze',
        prompt: 'Anarchism holds that all coercive authority, including the ____, should be abolished.',
        answer: 'state',
      },
      {
        format: 'contrast',
        prompt: 'Who coined the term "anarchism" and declared "property is theft" in 1840?',
        answer: 'Pierre-Joseph Proudhon',
        distractors: ['Mikhail Bakunin', 'Karl Marx', 'Peter Kropotkin'],
      },
    ],
    edges: [
      { to: 'socialism-early', relation: 'contemporary_of' },
      { to: 'karl-marx', relation: 'contemporary_of' },
      { to: 'paris-commune', relation: 'part_of' },
    ],
  },

  {
    id: 'social-darwinism',
    name: 'Social Darwinism',
    domain: 'culture',
    approxYear: 1870,
    eras: ['long19c'],
    summary:
      'The misapplication of Darwin\'s biological theory of natural selection to human society, arguing that social inequality, economic competition, and imperial conquest were natural expressions of the "survival of the fittest." Herbert Spencer coined the phrase; Social Darwinism was widely used to justify laissez-faire economics, colonialism, and later racial hierarchy. Darwin himself never endorsed these uses of his ideas.',
    wikipedia: 'https://en.wikipedia.org/wiki/Social_Darwinism',
    questions: [
      {
        format: 'cloze',
        prompt: 'Social Darwinism misapplied Darwin\'s theory to justify social inequality as the "survival of the ____".',
        answer: 'fittest',
      },
      {
        format: 'contrast',
        prompt: 'What was Social Darwinism primarily used to justify?',
        answer: 'Colonialism and economic inequality',
        distractors: ["Votes for women", 'Public education systems', 'Workers\' rights legislation'],
      },
    ],
    edges: [
      { to: 'charles-darwin', relation: 'influenced_by' },
      { to: 'scramble-for-africa', relation: 'influenced_by' },
      { to: 'antisemitism-modern', relation: 'caused' },
    ],
  },

  {
    id: 'antisemitism-modern',
    name: 'Modern Antisemitism',
    domain: 'history',
    approxYear: 1879,
    eras: ['long19c'],
    summary:
      'The word "antisemitism" was coined in Germany in 1879 to give racial-scientific respectability to old religious hatred of Jews. New pseudo-scientific theories held that Jews were a dangerous racial group rather than merely adherents of a religion, making conversion no protection. The Dreyfus Affair in France (1894-1906), in which a Jewish army officer was falsely convicted of treason, exposed how deep this new racism ran and radicalised Theodor Herzl into founding modern Zionism.',
    wikipedia: 'https://en.wikipedia.org/wiki/Antisemitism',
    questions: [
      {
        format: 'cloze',
        prompt: 'The word "antisemitism" was coined in Germany in ____ to give racial language to hatred of Jews.',
        answer: '1879',
      },
      {
        format: 'contrast',
        prompt: 'What was the Dreyfus Affair\'s significance for antisemitism?',
        answer: 'It revealed institutional antisemitism in France and inspired Zionism',
        distractors: ['It led to the first anti-Jewish pogrom in Russia', 'It proved Jewish officers were disloyal to their countries', 'It ended legal discrimination against Jews in Western Europe'],
      },
    ],
    edges: [
      { to: 'social-darwinism', relation: 'influenced_by' },
      { to: 'the-holocaust', relation: 'caused' },
    ],
  },

  // â”€â”€â”€ Ottoman Empire (context node) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'ottoman-empire-context',
    name: 'The Ottoman Empire',
    domain: 'history',
    approxYear: 1800,
    eras: ['long19c'],
    lat: 39.0,
    lng: 35.0,
    summary:
      'At its peak the Ottoman Empire controlled Anatolia, the Middle East, North Africa, and much of south-eastern Europe, but by 1800 it was in slow decline, called the "sick man of Europe" by Tsar Nicholas I. It lost territory steadily through the 19th century, with Greece, Serbia, Romania, and Bulgaria all winning independence. The empire finally collapsed after World War I and was replaced by the Turkish Republic in 1923.',
    wikipedia: 'https://en.wikipedia.org/wiki/Ottoman_Empire',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ottoman_Empire_%281683%29-fr.svg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Tsar Nicholas I called the Ottoman Empire the "sick man of ____" in 1853.',
        answer: 'Europe',
      },
      {
        format: 'contrast',
        prompt: 'What replaced the Ottoman Empire after World War I?',
        answer: 'The Turkish Republic',
        distractors: ['The Arab League', 'A League of Nations mandate', 'The Byzantine Empire restored'],
      },
    ],
    edges: [
      { to: 'greek-independence', relation: 'caused' },
      { to: 'crimean-war', relation: 'part_of' },
      { to: 'balkan-wars', relation: 'caused' },
      { to: 'wwi-trigger', relation: 'caused' },
    ],
  },

  // â”€â”€â”€ Pre-WWI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'balkan-wars',
    name: 'The Balkan Wars',
    domain: 'history',
    approxYear: 1912,
    eras: ['long19c'],
    lat: 42.0,
    lng: 21.5,
    summary:
      'Two rapid wars in 1912-13 in which the Balkan states first united to drive the Ottoman Empire almost entirely out of Europe, then fought each other over the spoils. Bulgaria, Serbia, Greece, and Montenegro gained large territories in the first war; Bulgaria lost most of them to its former allies in the second. The wars left unresolved territorial grievances and inflamed the tensions that exploded into World War I in 1914.',
    wikipedia: 'https://en.wikipedia.org/wiki/Balkan_Wars',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Balkan Wars of 1912-13 drove the ____ Empire almost entirely out of Europe.',
        answer: 'Ottoman',
      },
      {
        format: 'contrast',
        prompt: 'Why did the Balkan Wars contribute to the outbreak of World War I?',
        answer: 'They left unresolved territorial grievances that inflamed great-power tensions',
        distractors: ['They caused a refugee crisis that destabilised Austria-Hungary', 'They gave Russia a warm-water port in the Mediterranean', 'They allowed Germany to station troops in the Balkans'],
      },
    ],
    edges: [
      { to: 'ottoman-empire-context', relation: 'successor_of' },
      { to: 'wwi-trigger', relation: 'caused' },
      { to: 'triple-alliance-entente', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'triple-alliance-entente',
    name: 'Triple Alliance and Triple Entente',
    domain: 'history',
    approxYear: 1907,
    eras: ['long19c'],
    summary:
      'By 1907 Europe was divided into two armed alliance blocs: the Triple Alliance of Germany, Austria-Hungary, and Italy, and the Triple Entente of France, Russia, and Britain. These alliances were meant to deter war by making aggression too costly, but they had the opposite effect: when Austria-Hungary attacked Serbia in 1914, the alliance chains pulled every great power into the conflict within weeks.',
    wikipedia: 'https://en.wikipedia.org/wiki/Triple_Alliance_(1882)',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Triple ____ grouped Germany, Austria-Hungary, and Italy; the Triple Entente grouped France, Russia, and Britain.',
        answer: 'Alliance',
      },
      {
        format: 'contrast',
        prompt: 'Why did the alliance system accelerate rather than prevent World War I?',
        answer: 'A local conflict between Austria and Serbia automatically drew in all the great powers',
        distractors: ['Countries were legally obliged to declare war before consulting their allies', 'Germany secretly had agreements with both blocs', 'The alliances provided money but not troops'],
      },
    ],
    edges: [
      { to: 'unification-of-germany', relation: 'influenced_by' },
      { to: 'dreadnought-race', relation: 'contemporary_of' },
      { to: 'wwi-trigger', relation: 'caused' },
    ],
  },

  {
    id: 'dreadnought-race',
    name: 'The Dreadnought Naval Race',
    domain: 'history',
    approxYear: 1906,
    eras: ['long19c'],
    summary:
      "Britain launched HMS Dreadnought in 1906, a battleship so powerful it made every other warship in the world obsolete overnight. Germany immediately began building its own dreadnoughts to challenge British naval supremacy. The resulting arms race consumed enormous national resources and deepened Anglo-German hostility, contributing to the atmosphere of rivalry and fear that made war more likely.",
    wikipedia: 'https://en.wikipedia.org/wiki/Dreadnought',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/HMS_Dreadnought_(1906)_profile.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The launch of HMS ____ in 1906 made every existing battleship in the world obsolete.',
        answer: 'Dreadnought',
      },
      {
        format: 'contrast',
        prompt: 'Which two countries were the main rivals in the dreadnought naval arms race?',
        answer: 'Britain and Germany',
        distractors: ['France and Russia', 'USA and Japan', 'Austria-Hungary and Italy'],
      },
    ],
    edges: [
      { to: 'triple-alliance-entente', relation: 'contemporary_of' },
      { to: 'wwi-trigger', relation: 'caused' },
    ],
  },

  {
    id: 'archduke-franz-ferdinand',
    name: 'Archduke Franz Ferdinand',
    domain: 'history',
    approxYear: 1914,
    eras: ['long19c'],
    lat: 43.86,
    lng: 18.42,
    summary:
      'Franz Ferdinand was the heir to the Austro-Hungarian throne, a cautious reformer who favoured giving Slavic peoples within the empire more autonomy. His assassination in Sarajevo on 28 June 1914 by Gavrilo Princip, a Bosnian Serb nationalist backed by Serbian intelligence, gave Austria-Hungary the pretext it had sought to crush Serbian nationalism and set off the chain of mobilisations that became World War I.',
    wikipedia: 'https://en.wikipedia.org/wiki/Archduke_Franz_Ferdinand_of_Austria',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Erzherzog_Franz_Ferdinand_von_%C3%B6sterreich_este.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Archduke Franz Ferdinand was assassinated in Sarajevo on 28 June ____.',
        answer: '1914',
      },
      {
        format: 'contrast',
        prompt: 'Who assassinated Archduke Franz Ferdinand?',
        answer: 'Gavrilo Princip, a Bosnian Serb nationalist',
        distractors: ['A Hungarian nationalist officer', 'An Austrian anarchist', 'A Serbian army general'],
      },
    ],
    edges: [
      { to: 'wwi-trigger', relation: 'caused' },
      { to: 'triple-alliance-entente', relation: 'part_of' },
      { to: 'balkan-wars', relation: 'influenced_by' },
    ],
  },
]
