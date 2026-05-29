import type { Concept, Domain, RelationType, Lesson, RecallQuestion, Era } from './schema'
import { db } from './schema'
import { newReview } from '../lib/fsrs'

interface SeedConcept {
  id: string
  name: string
  domain: Domain
  approxYear: number | null
  eras: string[]
  summary: string
  wikipediaUrl: string
  questions: RecallQuestion[]
  edges: { to: string; relation: RelationType }[]
}

const ERAS: Era[] = [
  {
    id: 'antiquity',
    name: 'Ancient World',
    startYear: -3000,
    endYear: -500,
    description: 'Earliest civilisations through to the rise of classical Greece. Origins of major religions and the first written law.',
    displayOrder: 1,
  },
  {
    id: 'classical',
    name: 'Classical Antiquity',
    startYear: -500,
    endYear: 500,
    description: 'Greece and Rome. The birth of philosophy and democracy. Rise of Christianity. The intellectual ground modern Europe still walks on.',
    displayOrder: 2,
  },
  {
    id: 'medieval',
    name: 'Medieval World',
    startYear: 500,
    endYear: 1300,
    description: 'After Rome fell. The Islamic golden age, Byzantine continuity, the European feudal system, the slow Christianisation of the north.',
    displayOrder: 3,
  },
  {
    id: 'renaissance',
    name: 'Renaissance and Reformation',
    startYear: 1300,
    endYear: 1600,
    description: 'Rebirth of classical learning, the printing press, the Protestant Reformation, the beginning of European overseas expansion.',
    displayOrder: 4,
  },
  {
    id: 'enlightenment',
    name: 'Enlightenment and Early Modern',
    startYear: 1600,
    endYear: 1789,
    description: 'Reason as the new authority. Newton, Locke, Montesquieu, Voltaire. The political ideas that would underwrite every modern republic.',
    displayOrder: 5,
  },
  {
    id: 'revolution',
    name: 'Age of Revolution',
    startYear: 1789,
    endYear: 1815,
    description: 'French and Industrial Revolutions, American independence still echoing, Napoleon redrawing the map. The hinge between old and modern Europe.',
    displayOrder: 6,
  },
  {
    id: 'long19c',
    name: 'The Long 19th Century',
    startYear: 1815,
    endYear: 1914,
    description: 'Industrial high tide. Railways, electricity, empires at their largest. Darwin, Marx, the Impressionists. The world the Great War swept away.',
    displayOrder: 7,
  },
  {
    id: 'worldwars',
    name: 'The World Wars Era',
    startYear: 1914,
    endYear: 1945,
    description: 'Two world wars, the rise and fall of European fascism, the Great Depression, decolonisation beginning, the first nuclear weapons.',
    displayOrder: 8,
  },
  {
    id: 'coldwar',
    name: 'The Cold War',
    startYear: 1945,
    endYear: 1989,
    description: 'US and USSR rivalry shaping every continent. Proxy wars, nuclear standoff, the space race, decolonisation completing, civil-rights movements.',
    displayOrder: 9,
  },
  {
    id: 'postcoldwar',
    name: 'After the Cold War',
    startYear: 1989,
    endYear: 2008,
    description: 'Unipolar moment, the EU expanding east, the dot-com boom, 9/11 and its wars, the early internet shaping daily life.',
    displayOrder: 10,
  },
  {
    id: 'multipolar',
    name: 'Multipolar Present',
    startYear: 2008,
    endYear: 2030,
    description: 'The 2008 crisis, the Arab Spring, populism on both sides, smartphones everywhere, climate change biting, the AI inflection.',
    displayOrder: 11,
  },
]

function cloze(prompt: string, answer: string, hint?: string): RecallQuestion {
  return { format: 'cloze', prompt, expectedAnswer: answer, hint: hint ?? null }
}
function contrast(prompt: string, correct: string, distractors: string[]): RecallQuestion {
  return { format: 'contrast', prompt, expectedAnswer: correct, distractors }
}
function free(prompt: string, answer: string): RecallQuestion {
  return { format: 'free', prompt, expectedAnswer: answer }
}

const SEED: SeedConcept[] = [
  // ============ HISTORY ============
  {
    id: 'french-revolution',
    name: 'The French Revolution',
    domain: 'history',
    approxYear: 1789,
    eras: ['revolution'],
    summary:
      'From 1789, France overturned a centuries-old monarchy in a decade of upheaval. Royal debt, bad harvests, and Enlightenment ideas about rights and reason set the conditions. The Bastille fell in July 1789, the Declaration of the Rights of Man followed weeks later, and the king was executed in 1793. A radical phase known as the Terror killed tens of thousands before Napoleon ended the revolution by becoming emperor in 1804. Modern ideas of citizenship, secular government, and constitutional rights trace to it.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/French_Revolution',
    questions: [
      cloze('In ____ the French Revolution overthrew the monarchy.', '1789'),
      free(
        'What set the conditions for the French Revolution to begin?',
        'Royal debt, bad harvests, and Enlightenment ideas about rights and reason. The state was bankrupt while ordinary people were hungry, and a new way of thinking about legitimacy was already in circulation.',
      ),
    ],
    edges: [
      { to: 'industrial-revolution', relation: 'contemporary_of' },
      { to: 'separation-of-powers', relation: 'influenced_by' },
      { to: 'parliamentary-vs-presidential', relation: 'caused' },
    ],
  },
  {
    id: 'industrial-revolution',
    name: 'The Industrial Revolution',
    domain: 'history',
    approxYear: 1800,
    eras: ['revolution', 'long19c'],
    summary:
      'Roughly 1760 to 1840, starting in Britain and spreading outward, the Industrial Revolution moved production from hand and home to machine and factory. Steam power, the cotton mill, the railway, and later electricity reorganised work, cities, and class structure. Average people moved from villages to industrial towns; wages, child labour, and life expectancy all shifted. Almost everything about how we live today (urban density, mass-produced goods, the working week, climate change) traces to here.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Industrial_Revolution',
    questions: [
      cloze('The Industrial Revolution began in ____, around 1760.', 'Britain'),
    ],
    edges: [
      { to: 'uk-constituents', relation: 'located_in' },
      { to: 'french-revolution', relation: 'contemporary_of' },
      { to: 'nikola-tesla', relation: 'caused' },
    ],
  },
  {
    id: 'wwi-trigger',
    name: 'The trigger of World War I',
    domain: 'history',
    approxYear: 1914,
    eras: ['worldwars'],
    summary:
      'On 28 June 1914 in Sarajevo, a Bosnian Serb named Gavrilo Princip shot Archduke Franz Ferdinand of Austria-Hungary. A web of mutual-defence alliances (Germany behind Austria, Russia behind Serbia, France behind Russia, Britain behind France and Belgium) turned a regional crisis into a continental war within weeks. The deeper causes were older: militarised great-power rivalry, colonial competition, and the unresolved tensions of unified Germany pressing against an established balance.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Causes_of_World_War_I',
    questions: [
      cloze(
        'World War I was triggered by the assassination of Archduke Franz Ferdinand in ____ in 1914.',
        'Sarajevo',
      ),
      contrast(
        'Which treaty most directly set the conditions for World War II?',
        'The Treaty of Versailles',
        ['The French Revolution', 'The Industrial Revolution', 'The Cold War'],
      ),
    ],
    edges: [
      { to: 'treaty-of-versailles', relation: 'caused' },
      { to: 'albert-einstein', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'fall-of-berlin-wall',
    name: 'The fall of the Berlin Wall',
    domain: 'history',
    approxYear: 1989,
    eras: ['coldwar'],
    summary:
      'On 9 November 1989, after weeks of pressure across Eastern Europe and a confused televised announcement by an East German official, crowds began crossing the Berlin Wall and the border guards did not stop them. The wall had divided East and West Berlin since 1961 and stood as the most physical symbol of the Cold War. Its fall did not by itself end the Cold War but accelerated everything that did: German reunification within a year, the collapse of communist regimes across Eastern Europe within months, and the dissolution of the Soviet Union by 1991.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Fall_of_the_Berlin_Wall',
    questions: [
      cloze('The Berlin Wall fell on ____ November 1989.', '9'),
      contrast(
        'Which event ended the Cold War symbolically on 9 November 1989?',
        'The fall of the Berlin Wall',
        ['The fall of the Soviet Union', 'The Velvet Revolution', 'The Treaty of Versailles'],
      ),
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'velvet-revolution', relation: 'contemporary_of' },
      { to: 'fall-of-soviet-union', relation: 'caused' },
    ],
  },
  {
    id: 'velvet-revolution',
    name: 'The Velvet Revolution',
    domain: 'history',
    approxYear: 1989,
    eras: ['coldwar'],
    summary:
      'From 17 November to 29 December 1989, mass non-violent protests in Czechoslovakia toppled four decades of one-party communist rule. The name reflects how peaceful it was: police beat student protesters on day one, a general strike followed within days, and the regime negotiated its own exit within weeks. Václav Havel, a dissident playwright, became president by year-end. Three years later Czechoslovakia split peacefully (the Velvet Divorce) into the Czech Republic and Slovakia.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Velvet_Revolution',
    questions: [
      cloze('Czechoslovakia\'s non-violent 1989 transition is called the ____ Revolution.', 'Velvet'),
    ],
    edges: [
      { to: 'fall-of-berlin-wall', relation: 'contemporary_of' },
      { to: 'cold-war', relation: 'part_of' },
      { to: 'slovakia-neighbours', relation: 'caused' },
    ],
  },

  // ============ GEOGRAPHY ============
  {
    id: 'uk-constituents',
    name: 'The United Kingdom: four constituent countries',
    domain: 'geography',
    approxYear: 1707,
    eras: ['enlightenment', 'long19c'],
    summary:
      "The UK is a union of four countries: England, Scotland, Wales, and Northern Ireland. England is the largest by population (about 56 million of the UK's 67 million). The political union dates to the 1707 Act of Union (England and Scotland) and 1801 (Ireland, most of which left in 1922). Each country has some devolved powers; Scotland, Wales, and Northern Ireland have their own parliaments or assemblies handling areas like health and education, while Westminster handles foreign policy, defence, and tax.",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Countries_of_the_United_Kingdom',
    questions: [
      cloze(
        'The four constituent countries of the United Kingdom are England, Scotland, Wales, and ____.',
        'Northern Ireland',
      ),
    ],
    edges: [
      { to: 'industrial-revolution', relation: 'influenced_by' },
      { to: 'uk-government-structure', relation: 'part_of' },
      { to: 'european-union', relation: 'opposed' },
    ],
  },
  {
    id: 'slovakia-neighbours',
    name: 'Slovakia and its neighbours',
    domain: 'geography',
    approxYear: 1993,
    eras: ['postcoldwar'],
    summary:
      'Slovakia is a landlocked Central European country bordering five others: Czech Republic (northwest), Poland (north), Ukraine (east), Hungary (south), and Austria (southwest). It became independent in 1993 after splitting peacefully from the Czech Republic. Capital: Bratislava, on the Danube, unusually close to the Austrian border. Slovakia joined the EU and NATO in 2004 and adopted the euro in 2009. Population about 5.4 million.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Slovakia',
    questions: [
      cloze('Slovakia borders ____ countries.', 'five'),
    ],
    edges: [
      { to: 'european-union', relation: 'part_of' },
      { to: 'eu-member-states', relation: 'located_in' },
      { to: 'velvet-revolution', relation: 'caused' },
    ],
  },
  {
    id: 'eu-member-states',
    name: 'EU member states',
    domain: 'geography',
    approxYear: 1993,
    eras: ['postcoldwar', 'multipolar'],
    summary:
      'As of 2026 the European Union has 27 member states, down from 28 after the UK left in 2020 (Brexit). The largest by population: Germany, France, Italy, Spain, Poland. Membership in the EU is not the same as membership in the eurozone (20 countries use the euro) or the Schengen Area (most but not all EU members plus a few non-members like Switzerland). The eastward expansion in 2004 brought in ten countries at once, including Slovakia, Poland, the Baltics, and others.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Member_state_of_the_European_Union',
    questions: [
      cloze('After Brexit, the EU has ____ member states.', '27'),
    ],
    edges: [
      { to: 'european-union', relation: 'part_of' },
      { to: 'uk-constituents', relation: 'opposed' },
    ],
  },
  {
    id: 'korean-peninsula',
    name: 'The Korean peninsula',
    domain: 'geography',
    approxYear: 1953,
    eras: ['coldwar'],
    summary:
      "A peninsula in East Asia divided since 1948 into North Korea (DPRK, capital Pyongyang) and South Korea (ROK, capital Seoul). The split followed Japanese surrender in 1945 when the US and USSR agreed to divide the peninsula along the 38th parallel as a temporary administrative line. The Korean War (1950-53) made the division permanent, ending in armistice rather than peace treaty. The Demilitarised Zone (DMZ) between them is one of the most militarised borders in the world. North Korea has nuclear weapons; South Korea is one of the world's largest economies.",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Korea',
    questions: [
      cloze(
        'The Korean peninsula was divided after Japanese surrender along the ____ parallel.',
        '38th',
      ),
      contrast(
        'Which conflict was technically never ended by a peace treaty?',
        'The Korean War',
        ['World War I', 'The Cold War', 'The Velvet Revolution'],
      ),
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'cold-war', relation: 'caused' },
    ],
  },
  {
    id: 'sahel',
    name: 'The Sahel',
    domain: 'geography',
    approxYear: 2020,
    eras: ['multipolar'],
    summary:
      'A semi-arid band stretching across Africa just south of the Sahara, roughly 1,000 km wide, from Senegal in the west to Sudan in the east. Countries along it include Mali, Burkina Faso, Niger, Chad, and parts of Mauritania, Senegal, Nigeria, and Sudan. The region faces three compounding crises: climate change (desertification pushing south), jihadist insurgencies (especially in Mali, Burkina, Niger), and political instability (a string of coups since 2020). It is also a major source region for migration toward Europe.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Sahel',
    questions: [
      cloze('The Sahel is a semi-arid band just south of the ____.', 'Sahara'),
    ],
    edges: [{ to: 'industrial-revolution', relation: 'influenced_by' }],
  },

  // ============ POLITICS ============
  {
    id: 'parliamentary-vs-presidential',
    name: 'Parliamentary vs presidential systems',
    domain: 'politics',
    approxYear: 1789,
    eras: ['revolution', 'long19c'],
    summary:
      'Two main ways modern democracies organise executive power. In a parliamentary system (UK, Germany, India), the executive (the Prime Minister and Cabinet) is drawn from and accountable to the legislature; they hold office only as long as they keep a majority. In a presidential system (US, Brazil, most of Latin America), the President is elected separately from the legislature and serves a fixed term regardless of legislative support; checks come through divided powers rather than confidence votes. France uses a semi-presidential hybrid.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Parliamentary_system',
    questions: [
      cloze(
        'In a ____ system, the executive is drawn from and depends on the legislature.',
        'parliamentary',
      ),
    ],
    edges: [
      { to: 'separation-of-powers', relation: 'part_of' },
      { to: 'uk-government-structure', relation: 'contemporary_of' },
      { to: 'french-revolution', relation: 'influenced_by' },
    ],
  },
  {
    id: 'european-union',
    name: 'The European Union',
    domain: 'politics',
    approxYear: 1957,
    eras: ['coldwar', 'postcoldwar'],
    summary:
      "A treaty-based political and economic union of 27 European states. The EU has its own institutions (Commission, Parliament, Council, Court of Justice), its own laws (which override national law in EU-competence areas), and its own budget. The 'four freedoms' of the single market are free movement of goods, services, capital, and people. Member states retain sovereignty over most things (defence, taxation, education) but have pooled it for trade, regulation, and some foreign policy. The EU emerged from a deliberate post-WWII project to make another European war between France and Germany impossible by tying their economies together.",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/European_Union',
    questions: [
      cloze(
        "The EU's four freedoms are free movement of goods, services, capital, and ____.",
        'people',
      ),
    ],
    edges: [
      { to: 'treaty-of-versailles', relation: 'successor_of' },
      { to: 'eu-member-states', relation: 'part_of' },
      { to: 'uk-constituents', relation: 'opposed' },
    ],
  },
  {
    id: 'first-past-the-post',
    name: 'First-past-the-post voting',
    domain: 'politics',
    approxYear: 1700,
    eras: ['enlightenment', 'long19c'],
    summary:
      "A voting system where each constituency elects whichever candidate gets the most votes (a plurality), even without an outright majority. Used in the UK, US (most elections), Canada, and India. The big effect on politics: it tends toward a two-party system (Duverger's law) because votes for smaller parties feel 'wasted.' It can also produce very lopsided outcomes: a party with 40% of the vote can win 60% of the seats. Alternatives include proportional representation (used in most of continental Europe) and ranked-choice voting.",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/First-past-the-post_voting',
    questions: [
      cloze(
        "First-past-the-post tends to produce ____-party politics (Duverger's law).",
        'two',
      ),
    ],
    edges: [
      { to: 'uk-government-structure', relation: 'part_of' },
      { to: 'parliamentary-vs-presidential', relation: 'influenced_by' },
    ],
  },
  {
    id: 'uk-government-structure',
    name: "The UK's government structure",
    domain: 'politics',
    approxYear: 1700,
    eras: ['enlightenment', 'long19c'],
    summary:
      'The UK is a constitutional monarchy with a parliamentary democracy. The Monarch (currently King Charles III) is head of state but ceremonial. The Prime Minister is head of government, normally the leader of the largest party in the House of Commons. Parliament has two chambers: the elected House of Commons (650 MPs) and the appointed House of Lords. The Cabinet (about 20 senior ministers) runs the executive. There is no written constitution; instead, a mix of statutes, common law, conventions, and treaties. The civil service is permanent and politically neutral; ministers come and go, civil servants stay.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Government_of_the_United_Kingdom',
    questions: [
      cloze('The UK head of government is the ____, not the monarch.', 'Prime Minister'),
    ],
    edges: [
      { to: 'parliamentary-vs-presidential', relation: 'part_of' },
      { to: 'separation-of-powers', relation: 'influenced_by' },
      { to: 'european-union', relation: 'opposed' },
    ],
  },
  {
    id: 'separation-of-powers',
    name: 'Separation of powers',
    domain: 'politics',
    approxYear: 1748,
    eras: ['enlightenment'],
    summary:
      'The principle that the three core functions of government (making laws, executing laws, judging laws) should be in separate hands so none can dominate. Articulated by the French philosopher Montesquieu in 1748, drawing on the English example. The US Constitution built it in explicitly: Congress (legislative), President (executive), Supreme Court (judicial). Parliamentary systems blend the executive and legislative more (the PM and Cabinet are MPs) but still separate the judiciary. The principle\'s purpose: liberty, by making tyranny harder to assemble.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Separation_of_powers',
    questions: [
      cloze(
        'The three powers being separated are legislative, executive, and ____.',
        'judicial',
      ),
    ],
    edges: [
      { to: 'french-revolution', relation: 'influenced_by' },
      { to: 'uk-government-structure', relation: 'part_of' },
    ],
  },

  // ============ RELIGIONS ============
  {
    id: 'christianity-core',
    name: 'Christianity: the core',
    domain: 'religions',
    approxYear: 30,
    eras: ['classical'],
    summary:
      'A monotheistic religion centred on the life and teachings of Jesus of Nazareth (early 1st century CE), whom Christians believe is the Son of God and the messiah promised in the Hebrew scriptures. Core beliefs: one God in three persons (the Trinity: Father, Son, Holy Spirit); Jesus died by crucifixion, rose again, and his death reconciles humanity to God. The Bible (Old Testament inherited from Judaism, plus the New Testament) is scripture. About 2.4 billion adherents worldwide, the largest religion. Three main branches: Catholic, Orthodox, Protestant.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Christianity',
    questions: [
      cloze('Christianity is centred on the life and teachings of ____.', 'Jesus'),
    ],
    edges: [
      { to: 'islam-core', relation: 'contemporary_of' },
      { to: 'the-renaissance', relation: 'part_of' },
    ],
  },
  {
    id: 'islam-core',
    name: 'Islam: the core',
    domain: 'religions',
    approxYear: 622,
    eras: ['medieval'],
    summary:
      "A monotheistic religion founded in 7th-century Arabia by the prophet Muhammad. Muslims believe Muhammad is the final prophet in a line including Abraham, Moses, and Jesus, and that he received the Quran (Islam's scripture) as direct revelation from God (Allah, the Arabic word for God). The Five Pillars are the core practices: declaration of faith (shahada), prayer five times daily, charity (zakat), fasting in Ramadan, and pilgrimage to Mecca (hajj) once if able. About 1.9 billion adherents, the second-largest religion. Two main branches: Sunni (majority) and Shia.",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Islam',
    questions: [
      cloze('Islam was founded in 7th-century Arabia by the prophet ____.', 'Muhammad'),
      contrast(
        'Which religion has the Five Pillars as core practices?',
        'Islam',
        ['Christianity', 'Hinduism', 'Buddhism'],
      ),
    ],
    edges: [
      { to: 'christianity-core', relation: 'successor_of' },
      { to: 'christianity-core', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'hinduism-core',
    name: 'Hinduism: the core',
    domain: 'religions',
    approxYear: -1500,
    eras: ['antiquity'],
    summary:
      "The oldest of the world's major religions, with roots in the Indian subcontinent going back over 3,000 years. Hinduism has no single founder, no single scripture, and no single creed. Core ideas include dharma (one's duty or path), karma (actions and their consequences), and moksha (release from the cycle of rebirth, the ultimate goal). Most Hindus believe in many forms of one ultimate reality (Brahman); deities like Vishnu, Shiva, and Devi are different aspects of it. The Vedas, Upanishads, and epics like the Mahabharata and Ramayana are core texts. About 1.2 billion adherents, mostly in India.",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Hinduism',
    questions: [
      cloze(
        'Hindu thought is organised around dharma, karma, and ____ (release from rebirth).',
        'moksha',
      ),
    ],
    edges: [{ to: 'buddhism-core', relation: 'contemporary_of' }],
  },
  {
    id: 'buddhism-core',
    name: 'Buddhism: the core',
    domain: 'religions',
    approxYear: -500,
    eras: ['antiquity', 'classical'],
    summary:
      'A religion and philosophy founded in 5th-century BCE India by Siddhartha Gautama (the Buddha, "the awakened one"). Core teaching: the Four Noble Truths. Life involves suffering (dukkha); suffering is caused by attachment and craving; suffering can end; the way to end it is the Eightfold Path (right view, intention, speech, action, livelihood, effort, mindfulness, concentration). The goal is nirvana, release from the cycle of rebirth. Major branches: Theravada (Southeast Asia), Mahayana (East Asia, including Zen), and Vajrayana (Tibet). About 500 million adherents.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Buddhism',
    questions: [
      cloze('The Buddha taught the Four Noble Truths and the ____ Path.', 'Eightfold'),
      contrast(
        'Which religion is organised around the Four Noble Truths and the Eightfold Path?',
        'Buddhism',
        ['Hinduism', 'Islam', 'Christianity'],
      ),
    ],
    edges: [
      { to: 'hinduism-core', relation: 'successor_of' },
      { to: 'hinduism-core', relation: 'contemporary_of' },
    ],
  },

  // ============ CULTURE ============
  {
    id: 'the-renaissance',
    name: 'The Renaissance',
    domain: 'culture',
    approxYear: 1450,
    eras: ['renaissance'],
    summary:
      'A cultural movement from roughly the 14th to the 17th century, beginning in Italy (Florence first) and spreading across Europe. Renaissance means "rebirth": a deliberate revival of classical Greek and Roman learning, art, and ideas after the medieval period. Core themes: humanism (the dignity and potential of the individual), realism in art (perspective, anatomy), and a renewed interest in the natural world that would lead to the Scientific Revolution. Defining figures: Leonardo da Vinci, Michelangelo, Raphael in art; Petrarch in literature; Erasmus in scholarship. Wealthy patrons (the Medici in Florence) funded the work.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Renaissance',
    questions: [
      cloze('The Renaissance began in 14th-century ____.', 'Italy'),
    ],
    edges: [
      { to: 'christianity-core', relation: 'influenced_by' },
      { to: 'industrial-revolution', relation: 'caused' },
    ],
  },
  {
    id: 'impressionism',
    name: 'Impressionism',
    domain: 'culture',
    approxYear: 1872,
    eras: ['long19c'],
    summary:
      "A French art movement from the 1860s to 1880s. Impressionists painted the impression of a scene at a specific moment, especially the way light fell on it, rather than a precise reproduction. They worked outdoors (en plein air), used loose visible brushstrokes, and chose modern subjects (railway stations, cafes, bourgeois leisure) over historical or mythological ones. The name came from a critic mocking Monet's painting 'Impression, Sunrise' in 1872. Core figures: Claude Monet, Edgar Degas, Pierre-Auguste Renoir, Camille Pissarro, Berthe Morisot. They were rejected by the official Salon and held their own exhibitions starting 1874.",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Impressionism',
    questions: [
      cloze('Impressionism was a ____ art movement of the 1860s-1880s.', 'French'),
      contrast(
        "Which French art movement was named for a mocking review of Monet's 'Impression, Sunrise'?",
        'Impressionism',
        ['The Renaissance', 'The Western canon', 'Hip-hop'],
      ),
    ],
    edges: [{ to: 'the-renaissance', relation: 'successor_of' }],
  },
  {
    id: 'western-canon',
    name: 'The Western canon',
    domain: 'culture',
    approxYear: 1850,
    eras: ['long19c', 'worldwars'],
    summary:
      'A contested term for the works of literature, philosophy, music, and art considered most influential in Western civilisation. The classic version starts with Homer (8th-c BCE Greek), runs through Plato and Aristotle, the Bible, Augustine, Dante, Shakespeare, Cervantes, Goethe, Tolstoy, Joyce. The list is loosely held: there is no official version, and what counts has shifted over time. The canon has been criticised since the late 20th century for being narrow (mostly European, male, and Christian) and defended as preserving works of lasting depth. The debate itself is part of contemporary cultural literacy.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Western_canon',
    questions: [
      cloze('The Western canon traditionally starts with the Greek poet ____.', 'Homer'),
    ],
    edges: [
      { to: 'the-renaissance', relation: 'part_of' },
      { to: 'christianity-core', relation: 'influenced_by' },
    ],
  },
  {
    id: 'hip-hop',
    name: 'Hip-hop',
    domain: 'culture',
    approxYear: 1973,
    eras: ['coldwar', 'postcoldwar'],
    summary:
      "A cultural movement that began in the South Bronx, New York, in the early 1970s. It has four traditional elements: DJing, MCing (rapping), graffiti, and breakdancing. DJ Kool Herc's parties in 1973 are often cited as the origin point. From a local Black and Latino youth culture it became the most commercially dominant popular music genre worldwide by the 2010s and now shapes global fashion, language, and politics. Major eras: old-school (mid 1970s-mid 80s), golden age (late 80s-early 90s), gangsta and the East-West rivalry (mid 1990s), Southern rise (2000s), trap and streaming era (2010s onward).",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Hip_hop',
    questions: [
      cloze('Hip-hop began in the South ____ in the early 1970s.', 'Bronx'),
    ],
    edges: [{ to: 'cold-war', relation: 'contemporary_of' }],
  },

  // ============ SCIENCE FIGURES ============
  {
    id: 'nikola-tesla',
    name: 'Nikola Tesla',
    domain: 'science',
    approxYear: 1888,
    eras: ['long19c', 'worldwars'],
    summary:
      "Serbian-American inventor and electrical engineer (1856-1943), born in modern-day Croatia, worked mainly in the US. His central contribution: the alternating-current (AC) electrical system that powers almost all electricity grids today. He worked briefly for Edison (DC) before falling out and joining Westinghouse, leading to the 'War of Currents' of the 1880s-1890s. AC won because it transmits efficiently over long distances. He held about 300 patents. He died poor and underappreciated and was rediscovered as a popular figure in the late 20th century. Eccentric, ascetic, never married.",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Nikola_Tesla',
    questions: [
      cloze("Tesla championed ____ current over Edison's direct current.", 'alternating'),
      contrast(
        'Who championed AC current and fought the War of Currents with Edison?',
        'Nikola Tesla',
        ['Albert Einstein', 'Marie Curie', 'Charles Darwin'],
      ),
    ],
    edges: [
      { to: 'industrial-revolution', relation: 'part_of' },
      { to: 'marie-curie', relation: 'contemporary_of' },
      { to: 'albert-einstein', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'albert-einstein',
    name: 'Albert Einstein',
    domain: 'science',
    approxYear: 1915,
    eras: ['long19c', 'worldwars'],
    summary:
      "German-born theoretical physicist (1879-1955), Swiss and later American citizen. Two main contributions: special relativity (1905), which showed that time and space are intertwined and that nothing can exceed the speed of light; and general relativity (1915), which reframed gravity as the curvature of spacetime caused by mass. The famous equation E=mc² (energy equals mass times the speed of light squared) is from special relativity. Together these ended classical (Newtonian) physics' dominance. Jewish; left Germany when the Nazis came to power; later signed the letter that warned President Roosevelt about the possibility of nuclear weapons.",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Albert_Einstein',
    questions: [
      cloze("Einstein's 1905 theory of ____ relativity introduced E=mc².", 'special'),
    ],
    edges: [
      { to: 'nikola-tesla', relation: 'contemporary_of' },
      { to: 'marie-curie', relation: 'contemporary_of' },
      { to: 'wwi-trigger', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'marie-curie',
    name: 'Marie Curie',
    domain: 'science',
    approxYear: 1903,
    eras: ['long19c', 'worldwars'],
    summary:
      'Polish-French physicist and chemist (1867-1934), born Maria Skłodowska in Warsaw, worked in Paris. With her husband Pierre Curie she discovered the elements polonium (named for Poland) and radium, and coined the term "radioactivity." She is the only person to have won Nobel Prizes in two different sciences: Physics 1903 (shared with Pierre and Henri Becquerel) for radioactivity research, and Chemistry 1911 (alone) for isolating radium. She founded radiation research institutes in Paris and Warsaw. She died of leukaemia caused by long-term radiation exposure, before its dangers were understood.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Marie_Curie',
    questions: [
      cloze(
        'Marie Curie won Nobel Prizes in two different sciences: physics and ____.',
        'chemistry',
      ),
      contrast(
        'Which scientist discovered radioactivity?',
        'Marie Curie',
        ['Albert Einstein', 'Charles Darwin', 'Nikola Tesla'],
      ),
    ],
    edges: [
      { to: 'nikola-tesla', relation: 'contemporary_of' },
      { to: 'albert-einstein', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'charles-darwin',
    name: 'Charles Darwin',
    domain: 'science',
    approxYear: 1859,
    eras: ['long19c'],
    summary:
      'English naturalist (1809-1882), best known for the theory of evolution by natural selection. His five-year voyage on HMS Beagle (1831-1836), especially observations in the Galápagos Islands, gave him the evidence he sat on for over twenty years before publishing. "On the Origin of Species" (1859) argued that species change over time as individuals with traits better suited to their environment leave more descendants. The Origin reframed biology and the human place in nature. Darwin avoided the topic of human evolution in the Origin, addressing it directly only in "The Descent of Man" (1871).',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Charles_Darwin',
    questions: [
      cloze('Darwin published On the Origin of Species in ____.', '1859'),
    ],
    edges: [{ to: 'industrial-revolution', relation: 'contemporary_of' }],
  },

  // ============ MODERN WORLD SPINE ============
  {
    id: 'treaty-of-versailles',
    name: 'The Treaty of Versailles',
    domain: 'modern_world',
    approxYear: 1919,
    eras: ['worldwars'],
    summary:
      'Signed 28 June 1919 at the Palace of Versailles, the treaty ended World War I and reorganised Europe. It blamed Germany for the war (the "war guilt clause"), required massive reparations, shrank German territory, and limited the German military. New states (Poland, Czechoslovakia, Yugoslavia) were carved out. Most historians now agree the treaty was harsh enough to humiliate Germany without being harsh enough to stop it recovering, and the economic ruin and political resentment it produced were major causes of the rise of Nazism and World War II within twenty years.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Treaty_of_Versailles',
    questions: [
      cloze('The Treaty of Versailles was signed in ____, ending World War I.', '1919'),
    ],
    edges: [
      { to: 'wwi-trigger', relation: 'successor_of' },
      { to: 'cold-war', relation: 'caused' },
    ],
  },
  {
    id: 'cold-war',
    name: 'The Cold War',
    domain: 'modern_world',
    approxYear: 1960,
    eras: ['coldwar'],
    summary:
      "The geopolitical rivalry between the United States and the Soviet Union, and their respective blocs, from roughly 1947 to 1991. 'Cold' because the two superpowers never fought each other directly; their conflict ran through proxy wars (Korea, Vietnam, Afghanistan, much of Africa and Latin America), arms races (nuclear and conventional), space competition, propaganda, and economic blocs (the Warsaw Pact vs NATO; capitalism vs state socialism). The Cuban Missile Crisis (1962) was the closest the world came to nuclear war. The Cold War ended with the fall of the Berlin Wall (1989) and dissolution of the USSR (1991).",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Cold_War',
    questions: [
      cloze('The Cold War ran roughly from 1947 to ____.', '1991'),
    ],
    edges: [
      { to: 'treaty-of-versailles', relation: 'successor_of' },
      { to: 'korean-peninsula', relation: 'caused' },
      { to: 'fall-of-berlin-wall', relation: 'caused' },
      { to: 'fall-of-soviet-union', relation: 'caused' },
      { to: 'hip-hop', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'fall-of-soviet-union',
    name: 'The fall of the Soviet Union',
    domain: 'modern_world',
    approxYear: 1991,
    eras: ['postcoldwar'],
    summary:
      "The Soviet Union formally dissolved on 26 December 1991, splitting into 15 independent states (Russia, Ukraine, the Baltic states, Belarus, the Central Asian republics, and more). The causes were stacked: a stagnant centrally-planned economy unable to keep up with the West, the costs of the Cold War arms race and the Afghan war, Mikhail Gorbachev's reforms (glasnost and perestroika) opening criticism the regime could not contain, the independence movements in the Baltic states, and a failed coup against Gorbachev in August 1991 that fatally weakened central authority. With the USSR gone, the Cold War ended definitively.",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Dissolution_of_the_Soviet_Union',
    questions: [
      cloze(
        'The Soviet Union dissolved into ____ independent states.',
        '15',
      ),
    ],
    edges: [
      { to: 'cold-war', relation: 'successor_of' },
      { to: 'fall-of-berlin-wall', relation: 'contemporary_of' },
      { to: 'european-union', relation: 'caused' },
    ],
  },
  {
    id: '2008-financial-crisis',
    name: 'The 2008 financial crisis',
    domain: 'modern_world',
    approxYear: 2008,
    eras: ['multipolar'],
    summary:
      "The worst global economic crisis since the 1930s. The proximate trigger: a US housing bubble built on subprime mortgages (loans to people who could not really afford them) that were repackaged and sold worldwide as supposedly safe investments. When US house prices fell from 2006, the mortgages defaulted in waves, the investment banks that held them imploded (Lehman Brothers collapsed in September 2008), and credit froze globally. Governments bailed out banks at vast cost; unemployment rose sharply; a decade of 'austerity' politics followed in Europe. The eurozone debt crisis (Greece, 2010-onwards) was a direct downstream effect. Political consequences include the rise of populist movements on both left and right.",
    wikipediaUrl: 'https://en.wikipedia.org/wiki/2008_financial_crisis',
    questions: [
      cloze('The 2008 financial crisis was triggered by a US ____ mortgage bubble.', 'subprime'),
    ],
    edges: [{ to: 'european-union', relation: 'influenced_by' }],
  },
]

const SEED_FLAG_KEY = 'seed:v2:loaded'

export async function loadSeedIfNeeded(): Promise<void> {
  const flag = await db.settings.get(SEED_FLAG_KEY)
  if (flag) return

  const now = Date.now()

  await db.transaction(
    'rw',
    [db.concepts, db.lessons, db.edges, db.reviews, db.settings, db.eras],
    async () => {
      for (const era of ERAS) {
        await db.eras.put(era)
      }

      for (const seed of SEED) {
        const lessonId = `${seed.id}--lesson`

        const concept: Concept = {
          id: seed.id,
          name: seed.name,
          domain: seed.domain,
          lessonId,
          summary: seed.summary,
          wikipediaUrl: seed.wikipediaUrl,
          approxYear: seed.approxYear,
          eras: seed.eras,
          firstSeenAt: null,
          lastReviewedAt: null,
          createdAt: now,
        }
        await db.concepts.put(concept)

        const lesson: Lesson = {
          id: lessonId,
          conceptId: seed.id,
          title: seed.name,
          body: seed.summary,
          recallQuestions: seed.questions,
          sourceUrls: [seed.wikipediaUrl],
          lastVerifiedAt: now,
          createdAt: now,
        }
        await db.lessons.put(lesson)

        const existingReview = await db.reviews.where('conceptId').equals(seed.id).first()
        if (!existingReview) {
          await db.reviews.add(newReview(seed.id, now))
        }
      }

      for (const seed of SEED) {
        for (const edge of seed.edges) {
          const existing = await db.edges
            .where('[fromId+toId]')
            .equals([seed.id, edge.to])
            .filter((e) => e.relation === edge.relation)
            .first()
          if (existing) continue
          await db.edges.add({
            fromId: seed.id,
            toId: edge.to,
            relation: edge.relation,
            weight: 1,
            isPersonal: false,
            note: null,
            createdAt: now,
          })
        }
      }

      await db.settings.put({ key: SEED_FLAG_KEY, value: { loadedAt: now, count: SEED.length } })
    },
  )
}

export const SEED_COUNT = SEED.length
export const ERA_COUNT = ERAS.length
