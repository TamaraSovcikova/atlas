import type { Concept, Domain, RelationType, Lesson, RecallQuestion } from './schema'
import { db } from './schema'
import { newReview } from '../lib/fsrs'

interface SeedConcept {
  id: string
  name: string
  domain: Domain
  summary: string
  wikipediaUrl: string
  questions: RecallQuestion[]
  edges: { to: string; relation: RelationType }[]
}

const SEED: SeedConcept[] = [
  // ============ HISTORY ============
  {
    id: 'french-revolution',
    name: 'The French Revolution',
    domain: 'history',
    summary:
      'From 1789, France overturned a centuries-old monarchy in a decade of upheaval. Royal debt, bad harvests, and Enlightenment ideas about rights and reason set the conditions. The Bastille fell in July 1789, the Declaration of the Rights of Man followed weeks later, and the king was executed in 1793. A radical phase known as the Terror killed tens of thousands before Napoleon ended the revolution by becoming emperor in 1804. Modern ideas of citizenship, secular government, and constitutional rights trace to it.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/French_Revolution',
    questions: [
      {
        prompt: 'What set the conditions for the French Revolution to begin in 1789?',
        expectedAnswer:
          'Royal debt, bad harvests, and Enlightenment ideas about rights and reason. The state was bankrupt while ordinary people were hungry, and a new way of thinking about legitimacy was already in circulation.',
        hints: [],
      },
      {
        prompt: 'Why does the French Revolution still matter today?',
        expectedAnswer:
          'It produced the modern ideas of citizenship, secular government, written constitutional rights, and the legitimacy of revolution itself. Most modern republics descend from this template.',
        hints: [],
      },
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
    summary:
      'Roughly 1760 to 1840, starting in Britain and spreading outward, the Industrial Revolution moved production from hand and home to machine and factory. Steam power, the cotton mill, the railway, and later electricity reorganised work, cities, and class structure. Average people moved from villages to industrial towns; wages, child labour, and life expectancy all shifted. Almost everything about how we live today (urban density, mass-produced goods, the working week, climate change) traces to here.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Industrial_Revolution',
    questions: [
      {
        prompt: 'Where did the Industrial Revolution begin, and what powered its first phase?',
        expectedAnswer:
          'Britain, from around 1760. Steam power (Watt) and cotton-mill mechanisation drove the first phase; railways and electricity drove the later phases.',
        hints: [],
      },
      {
        prompt: 'Name two features of modern life that exist because of the Industrial Revolution.',
        expectedAnswer:
          'Several reasonable answers: dense cities, the working week, mass-produced goods, factory labour, fossil-fuel use, modern wage work. Climate change is also a downstream consequence.',
        hints: [],
      },
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
    summary:
      'On 28 June 1914 in Sarajevo, a Bosnian Serb named Gavrilo Princip shot Archduke Franz Ferdinand of Austria-Hungary. A web of mutual-defence alliances (Germany behind Austria, Russia behind Serbia, France behind Russia, Britain behind France and Belgium) turned a regional crisis into a continental war within weeks. The deeper causes were older: militarised great-power rivalry, colonial competition, and the unresolved tensions of unified Germany pressing against an established balance.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Causes_of_World_War_I',
    questions: [
      {
        prompt: 'Why did the assassination of one man trigger a war that killed millions?',
        expectedAnswer:
          'A cascade of mutual-defence alliances meant once one major power mobilised, the others were treaty-bound to follow. The trigger was the assassination; the structure was the alliance system.',
        hints: [],
      },
      {
        prompt: 'Name the deeper causes (not the trigger) of World War I.',
        expectedAnswer:
          'Militarised great-power rivalry, colonial competition, and the rise of unified Germany pressing against the established European balance of power.',
        hints: [],
      },
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
    summary:
      'On 9 November 1989, after weeks of pressure across Eastern Europe and a confused televised announcement by an East German official, crowds began crossing the Berlin Wall and the border guards did not stop them. The wall had divided East and West Berlin since 1961 and stood as the most physical symbol of the Cold War. Its fall did not by itself end the Cold War but accelerated everything that did: German reunification within a year, the collapse of communist regimes across Eastern Europe within months, and the dissolution of the Soviet Union by 1991.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Fall_of_the_Berlin_Wall',
    questions: [
      {
        prompt: 'Why does the date 9 November 1989 matter?',
        expectedAnswer:
          'The Berlin Wall fell. East and West Berliners began crossing freely, and the guards did not stop them. It became the symbolic moment of the Cold War ending.',
        hints: [],
      },
      {
        prompt: 'Did the fall of the Berlin Wall by itself end the Cold War?',
        expectedAnswer:
          'No. It accelerated the end: German reunification within a year, communist regimes across Eastern Europe collapsed within months, the Soviet Union dissolved in December 1991.',
        hints: [],
      },
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
    summary:
      'From 17 November to 29 December 1989, mass non-violent protests in Czechoslovakia toppled four decades of one-party communist rule. The name reflects how peaceful it was: police beat student protesters on day one, a general strike followed within days, and the regime negotiated its own exit within weeks. Václav Havel, a dissident playwright, became president by year-end. Three years later Czechoslovakia split peacefully (the Velvet Divorce) into the Czech Republic and Slovakia.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Velvet_Revolution',
    questions: [
      {
        prompt: 'Why is it called the Velvet Revolution?',
        expectedAnswer:
          'Because it was remarkably non-violent. After a single police crackdown on student protesters, the regime negotiated its own exit within six weeks rather than fight on.',
        hints: [],
      },
      {
        prompt: 'What happened to Czechoslovakia after the Velvet Revolution?',
        expectedAnswer:
          'In 1993, three years later, Czechoslovakia split peacefully into the Czech Republic and Slovakia (the Velvet Divorce). Václav Havel was the first post-revolution president.',
        hints: [],
      },
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
    summary:
      'The UK is a union of four countries: England, Scotland, Wales, and Northern Ireland. England is the largest by population (about 56 million of the UK\'s 67 million). The political union dates to the 1707 Act of Union (England and Scotland) and 1801 (Ireland, most of which left in 1922). Each country has some devolved powers; Scotland, Wales, and Northern Ireland have their own parliaments or assemblies handling areas like health and education, while Westminster handles foreign policy, defence, and tax.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Countries_of_the_United_Kingdom',
    questions: [
      {
        prompt: 'Name the four constituent countries of the UK.',
        expectedAnswer: 'England, Scotland, Wales, and Northern Ireland.',
        hints: [],
      },
      {
        prompt: 'What does "devolution" mean in the UK context?',
        expectedAnswer:
          'Westminster has transferred some powers (like health, education, some tax) to the Scottish, Welsh, and Northern Irish parliaments or assemblies. Foreign policy, defence, and core tax remain at Westminster.',
        hints: [],
      },
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
    summary:
      'Slovakia is a landlocked Central European country bordering five others: Czech Republic (northwest), Poland (north), Ukraine (east), Hungary (south), and Austria (southwest). It became independent in 1993 after splitting peacefully from the Czech Republic. Capital: Bratislava, on the Danube, unusually close to the Austrian border. Slovakia joined the EU and NATO in 2004 and adopted the euro in 2009. Population about 5.4 million.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Slovakia',
    questions: [
      {
        prompt: 'Which five countries border Slovakia?',
        expectedAnswer: 'Czech Republic, Poland, Ukraine, Hungary, and Austria.',
        hints: [],
      },
      {
        prompt: 'When did Slovakia become independent, and from what?',
        expectedAnswer:
          'In 1993, by splitting peacefully from the Czech Republic (the Velvet Divorce). The two had been one country, Czechoslovakia, since 1918 (with a wartime interruption).',
        hints: [],
      },
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
    summary:
      'As of 2026 the European Union has 27 member states, down from 28 after the UK left in 2020 (Brexit). The largest by population: Germany, France, Italy, Spain, Poland. Membership in the EU is not the same as membership in the eurozone (20 countries use the euro) or the Schengen Area (most but not all EU members plus a few non-members like Switzerland). The eastward expansion in 2004 brought in ten countries at once, including Slovakia, Poland, the Baltics, and others.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Member_state_of_the_European_Union',
    questions: [
      {
        prompt: 'How many EU member states are there, and why is it not 28 anymore?',
        expectedAnswer: '27. The UK left in 2020 (Brexit), reducing the number from 28.',
        hints: [],
      },
      {
        prompt:
          'EU membership, eurozone membership, and Schengen membership: are these the same thing?',
        expectedAnswer:
          'No. They overlap heavily but are three separate things. Some EU members are not in the eurozone or Schengen; some Schengen countries (Switzerland, Norway) are not in the EU.',
        hints: [],
      },
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
    summary:
      'A peninsula in East Asia divided since 1948 into North Korea (DPRK, capital Pyongyang) and South Korea (ROK, capital Seoul). The split followed Japanese surrender in 1945 when the US and USSR agreed to divide the peninsula along the 38th parallel as a temporary administrative line. The Korean War (1950-53) made the division permanent, ending in armistice rather than peace treaty. The Demilitarised Zone (DMZ) between them is one of the most militarised borders in the world. North Korea has nuclear weapons; South Korea is one of the world\'s largest economies.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Korea',
    questions: [
      {
        prompt: 'Why is the Korean peninsula divided into two countries?',
        expectedAnswer:
          'In 1945 the US and USSR agreed to divide it along the 38th parallel as a temporary administrative line after Japanese surrender. The 1950-53 Korean War cemented the division; it ended in armistice, not peace, so they are technically still at war.',
        hints: [],
      },
      {
        prompt: 'Is the Korean War actually over?',
        expectedAnswer:
          'Technically no. It ended in an armistice (ceasefire) in 1953, not a peace treaty. The two Koreas are legally still at war.',
        hints: [],
      },
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
    summary:
      'A semi-arid band stretching across Africa just south of the Sahara, roughly 1,000 km wide, from Senegal in the west to Sudan in the east. Countries along it include Mali, Burkina Faso, Niger, Chad, and parts of Mauritania, Senegal, Nigeria, and Sudan. The region faces three compounding crises: climate change (desertification pushing south), jihadist insurgencies (especially in Mali, Burkina, Niger), and political instability (a string of coups since 2020). It is also a major source region for migration toward Europe.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Sahel',
    questions: [
      {
        prompt: 'What is the Sahel, geographically?',
        expectedAnswer:
          'A semi-arid band across Africa, just south of the Sahara, running roughly from Senegal in the west to Sudan in the east.',
        hints: [],
      },
      {
        prompt: 'Name the three compounding crises the Sahel currently faces.',
        expectedAnswer:
          'Climate change (desertification), jihadist insurgencies (Mali, Burkina, Niger), and political instability (a series of coups since 2020).',
        hints: [],
      },
    ],
    edges: [{ to: 'industrial-revolution', relation: 'influenced_by' }],
  },

  // ============ POLITICS ============
  {
    id: 'parliamentary-vs-presidential',
    name: 'Parliamentary vs presidential systems',
    domain: 'politics',
    summary:
      'Two main ways modern democracies organise executive power. In a parliamentary system (UK, Germany, India), the executive (the Prime Minister and Cabinet) is drawn from and accountable to the legislature; they hold office only as long as they keep a majority. In a presidential system (US, Brazil, most of Latin America), the President is elected separately from the legislature and serves a fixed term regardless of legislative support; checks come through divided powers rather than confidence votes. France uses a semi-presidential hybrid.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Parliamentary_system',
    questions: [
      {
        prompt: 'In one sentence, how does a parliamentary system differ from a presidential one?',
        expectedAnswer:
          'In a parliamentary system the executive comes from and depends on the legislature; in a presidential system the executive is elected separately and serves a fixed term independent of the legislature.',
        hints: [],
      },
      {
        prompt: 'Which system does the UK use, and which does the US use?',
        expectedAnswer:
          'UK: parliamentary. US: presidential. France is a hybrid (semi-presidential).',
        hints: [],
      },
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
    summary:
      'A treaty-based political and economic union of 27 European states. The EU has its own institutions (Commission, Parliament, Council, Court of Justice), its own laws (which override national law in EU-competence areas), and its own budget. The "four freedoms" of the single market are free movement of goods, services, capital, and people. Member states retain sovereignty over most things (defence, taxation, education) but have pooled it for trade, regulation, and some foreign policy. The EU emerged from a deliberate post-WWII project to make another European war between France and Germany impossible by tying their economies together.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/European_Union',
    questions: [
      {
        prompt: 'What are the EU\'s "four freedoms"?',
        expectedAnswer:
          'Free movement of goods, services, capital, and people across member states. They are the foundation of the single market.',
        hints: [],
      },
      {
        prompt: 'Why was the EU originally created?',
        expectedAnswer:
          'To make another major European war (especially between France and Germany) impossible by tying their economies together. It began as the European Coal and Steel Community in 1951.',
        hints: [],
      },
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
    summary:
      'A voting system where each constituency elects whichever candidate gets the most votes (a plurality), even without an outright majority. Used in the UK, US (most elections), Canada, and India. The big effect on politics: it tends toward a two-party system (Duverger\'s law) because votes for smaller parties feel "wasted." It can also produce very lopsided outcomes: a party with 40% of the vote can win 60% of the seats. Alternatives include proportional representation (used in most of continental Europe) and ranked-choice voting.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/First-past-the-post_voting',
    questions: [
      {
        prompt: 'In first-past-the-post, what does a candidate need to do to win a seat?',
        expectedAnswer:
          'Get more votes than any other single candidate in the constituency. A plurality, not necessarily a majority.',
        hints: [],
      },
      {
        prompt: 'Why does first-past-the-post tend to produce two-party politics?',
        expectedAnswer:
          'Votes for smaller parties feel wasted because only the top candidate wins, so voters and donors consolidate around the two parties most likely to win. This is sometimes called Duverger\'s law.',
        hints: [],
      },
    ],
    edges: [
      { to: 'uk-government-structure', relation: 'part_of' },
      { to: 'parliamentary-vs-presidential', relation: 'influenced_by' },
    ],
  },
  {
    id: 'uk-government-structure',
    name: 'The UK\'s government structure',
    domain: 'politics',
    summary:
      'The UK is a constitutional monarchy with a parliamentary democracy. The Monarch (currently King Charles III) is head of state but ceremonial. The Prime Minister is head of government, normally the leader of the largest party in the House of Commons. Parliament has two chambers: the elected House of Commons (650 MPs) and the appointed House of Lords. The Cabinet (about 20 senior ministers) runs the executive. There is no written constitution; instead, a mix of statutes, common law, conventions, and treaties. The civil service is permanent and politically neutral; ministers come and go, civil servants stay.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Government_of_the_United_Kingdom',
    questions: [
      {
        prompt: 'Who is the head of state in the UK, and who is the head of government?',
        expectedAnswer:
          'Head of state: the Monarch (King Charles III), ceremonial. Head of government: the Prime Minister, who runs the country.',
        hints: [],
      },
      {
        prompt: 'Does the UK have a written constitution?',
        expectedAnswer:
          'No. The constitution is uncodified: a mix of statutes, common law, conventions (long-standing practices), and treaties. There is no single document called "the Constitution."',
        hints: [],
      },
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
    summary:
      'The principle that the three core functions of government (making laws, executing laws, judging laws) should be in separate hands so none can dominate. Articulated by the French philosopher Montesquieu in 1748, drawing on the English example. The US Constitution built it in explicitly: Congress (legislative), President (executive), Supreme Court (judicial). Parliamentary systems blend the executive and legislative more (the PM and Cabinet are MPs) but still separate the judiciary. The principle\'s purpose: liberty, by making tyranny harder to assemble.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Separation_of_powers',
    questions: [
      {
        prompt: 'What are the three powers being separated in the "separation of powers"?',
        expectedAnswer:
          'Legislative (making laws), executive (carrying out laws), and judicial (interpreting laws).',
        hints: [],
      },
      {
        prompt: 'Why separate the powers at all?',
        expectedAnswer:
          'To make tyranny harder. If no single person or body controls all three functions, it is harder to assemble unchecked power. The aim is the protection of liberty.',
        hints: [],
      },
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
    summary:
      'A monotheistic religion centred on the life and teachings of Jesus of Nazareth (early 1st century CE), whom Christians believe is the Son of God and the messiah promised in the Hebrew scriptures. Core beliefs: one God in three persons (the Trinity: Father, Son, Holy Spirit); Jesus died by crucifixion, rose again, and his death reconciles humanity to God. The Bible (Old Testament inherited from Judaism, plus the New Testament) is scripture. About 2.4 billion adherents worldwide, the largest religion. Three main branches: Catholic, Orthodox, Protestant.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Christianity',
    questions: [
      {
        prompt: 'What is the Trinity in Christian belief?',
        expectedAnswer:
          'One God in three persons: Father, Son (Jesus), and Holy Spirit. Not three gods, and not three roles; three distinct persons of one God.',
        hints: [],
      },
      {
        prompt: 'What are the three main branches of Christianity?',
        expectedAnswer: 'Catholic, Orthodox, and Protestant.',
        hints: [],
      },
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
    summary:
      'A monotheistic religion founded in 7th-century Arabia by the prophet Muhammad. Muslims believe Muhammad is the final prophet in a line including Abraham, Moses, and Jesus, and that he received the Quran (Islam\'s scripture) as direct revelation from God (Allah, the Arabic word for God). The Five Pillars are the core practices: declaration of faith (shahada), prayer five times daily, charity (zakat), fasting in Ramadan, and pilgrimage to Mecca (hajj) once if able. About 1.9 billion adherents, the second-largest religion. Two main branches: Sunni (majority) and Shia.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Islam',
    questions: [
      {
        prompt: 'What are the Five Pillars of Islam?',
        expectedAnswer:
          'Declaration of faith (shahada), prayer five times daily (salat), charity (zakat), fasting in Ramadan (sawm), and pilgrimage to Mecca (hajj) once if able.',
        hints: [],
      },
      {
        prompt: 'What are the two main branches of Islam?',
        expectedAnswer:
          'Sunni (the majority globally, about 85-90%) and Shia (about 10-15%, concentrated in Iran, Iraq, and parts of the wider region).',
        hints: [],
      },
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
    summary:
      'The oldest of the world\'s major religions, with roots in the Indian subcontinent going back over 3,000 years. Hinduism has no single founder, no single scripture, and no single creed. Core ideas include dharma (one\'s duty or path), karma (actions and their consequences), and moksha (release from the cycle of rebirth, the ultimate goal). Most Hindus believe in many forms of one ultimate reality (Brahman); deities like Vishnu, Shiva, and Devi are different aspects of it. The Vedas, Upanishads, and epics like the Mahabharata and Ramayana are core texts. About 1.2 billion adherents, mostly in India.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Hinduism',
    questions: [
      {
        prompt: 'Name the three core concepts that organise Hindu thought.',
        expectedAnswer:
          'Dharma (duty or righteous path), karma (actions and their consequences), and moksha (release from the cycle of rebirth).',
        hints: [],
      },
      {
        prompt: 'Does Hinduism have a single founder or single scripture?',
        expectedAnswer:
          'No to both. It has no single founder, no single scripture, and no single creed. The Vedas, Upanishads, Mahabharata, and Ramayana are all important texts.',
        hints: [],
      },
    ],
    edges: [{ to: 'buddhism-core', relation: 'contemporary_of' }],
  },
  {
    id: 'buddhism-core',
    name: 'Buddhism: the core',
    domain: 'religions',
    summary:
      'A religion and philosophy founded in 5th-century BCE India by Siddhartha Gautama (the Buddha, "the awakened one"). Core teaching: the Four Noble Truths. Life involves suffering (dukkha); suffering is caused by attachment and craving; suffering can end; the way to end it is the Eightfold Path (right view, intention, speech, action, livelihood, effort, mindfulness, concentration). The goal is nirvana, release from the cycle of rebirth. Major branches: Theravada (Southeast Asia), Mahayana (East Asia, including Zen), and Vajrayana (Tibet). About 500 million adherents.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Buddhism',
    questions: [
      {
        prompt: 'What are the Four Noble Truths?',
        expectedAnswer:
          'Life involves suffering. Suffering is caused by attachment and craving. Suffering can end. The Eightfold Path is the way to end it.',
        hints: [],
      },
      {
        prompt: 'What is the goal of Buddhist practice?',
        expectedAnswer:
          'Nirvana: release from the cycle of rebirth, achieved by ending the attachment and craving that cause suffering.',
        hints: [],
      },
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
    summary:
      'A cultural movement from roughly the 14th to the 17th century, beginning in Italy (Florence first) and spreading across Europe. Renaissance means "rebirth": a deliberate revival of classical Greek and Roman learning, art, and ideas after the medieval period. Core themes: humanism (the dignity and potential of the individual), realism in art (perspective, anatomy), and a renewed interest in the natural world that would lead to the Scientific Revolution. Defining figures: Leonardo da Vinci, Michelangelo, Raphael in art; Petrarch in literature; Erasmus in scholarship. Wealthy patrons (the Medici in Florence) funded the work.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Renaissance',
    questions: [
      {
        prompt: 'What does "Renaissance" literally mean, and what was being reborn?',
        expectedAnswer:
          '"Rebirth." It was a deliberate revival of classical Greek and Roman learning, art, and ideas, after the medieval period had largely lost them.',
        hints: [],
      },
      {
        prompt: 'What is humanism in the Renaissance sense?',
        expectedAnswer:
          'The belief in the dignity, potential, and centrality of the human individual. It put humans (not just the divine) at the centre of intellectual and artistic concern.',
        hints: [],
      },
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
    summary:
      'A French art movement from the 1860s to 1880s. Impressionists painted the impression of a scene at a specific moment, especially the way light fell on it, rather than a precise reproduction. They worked outdoors (en plein air), used loose visible brushstrokes, and chose modern subjects (railway stations, cafes, bourgeois leisure) over historical or mythological ones. The name came from a critic mocking Monet\'s painting "Impression, Sunrise" in 1872. Core figures: Claude Monet, Edgar Degas, Pierre-Auguste Renoir, Camille Pissarro, Berthe Morisot. They were rejected by the official Salon and held their own exhibitions starting 1874.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Impressionism',
    questions: [
      {
        prompt: 'What were the Impressionists actually trying to paint?',
        expectedAnswer:
          'The impression of a scene at a specific moment, especially how light fell on it, rather than a precise reproduction. They cared about a fleeting visual experience.',
        hints: [],
      },
      {
        prompt: 'Where did the name "Impressionism" come from?',
        expectedAnswer:
          'From a critic mocking Monet\'s 1872 painting "Impression, Sunrise." The group adopted the insult.',
        hints: [],
      },
    ],
    edges: [{ to: 'the-renaissance', relation: 'successor_of' }],
  },
  {
    id: 'western-canon',
    name: 'The Western canon',
    domain: 'culture',
    summary:
      'A contested term for the works of literature, philosophy, music, and art considered most influential in Western civilisation. The classic version starts with Homer (8th-c BCE Greek), runs through Plato and Aristotle, the Bible, Augustine, Dante, Shakespeare, Cervantes, Goethe, Tolstoy, Joyce. The list is loosely held: there is no official version, and what counts has shifted over time. The canon has been criticised since the late 20th century for being narrow (mostly European, male, and Christian) and defended as preserving works of lasting depth. The debate itself is part of contemporary cultural literacy.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Western_canon',
    questions: [
      {
        prompt: 'Is there an official list of works in the Western canon?',
        expectedAnswer:
          'No. The Western canon has no single official version; it is a loosely-held set of works widely considered formative. What counts has shifted over time.',
        hints: [],
      },
      {
        prompt: 'Name the main critique of the Western canon since the late 20th century.',
        expectedAnswer:
          'That it is narrow: mostly European, mostly male, mostly Christian. Critics argue it excludes other traditions of comparable depth. Defenders argue it preserves works of lasting value.',
        hints: [],
      },
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
    summary:
      'A cultural movement that began in the South Bronx, New York, in the early 1970s. It has four traditional elements: DJing, MCing (rapping), graffiti, and breakdancing. DJ Kool Herc\'s parties in 1973 are often cited as the origin point. From a local Black and Latino youth culture it became the most commercially dominant popular music genre worldwide by the 2010s and now shapes global fashion, language, and politics. Major eras: old-school (mid 1970s-mid 80s), golden age (late 80s-early 90s), gangsta and the East-West rivalry (mid 1990s), Southern rise (2000s), trap and streaming era (2010s onward).',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Hip_hop',
    questions: [
      {
        prompt: 'Where and when did hip-hop begin?',
        expectedAnswer:
          'In the South Bronx, New York, in the early 1970s. DJ Kool Herc\'s 1973 parties are often cited as the origin point.',
        hints: [],
      },
      {
        prompt: 'What are the four traditional elements of hip-hop?',
        expectedAnswer: 'DJing, MCing (rapping), graffiti, and breakdancing.',
        hints: [],
      },
    ],
    edges: [{ to: 'cold-war', relation: 'contemporary_of' }],
  },

  // ============ SCIENCE FIGURES ============
  {
    id: 'nikola-tesla',
    name: 'Nikola Tesla',
    domain: 'science',
    summary:
      'Serbian-American inventor and electrical engineer (1856-1943), born in modern-day Croatia, worked mainly in the US. His central contribution: the alternating-current (AC) electrical system that powers almost all electricity grids today. He worked briefly for Edison (DC) before falling out and joining Westinghouse, leading to the "War of Currents" of the 1880s-1890s. AC won because it transmits efficiently over long distances. He held about 300 patents. He died poor and underappreciated and was rediscovered as a popular figure in the late 20th century. Eccentric, ascetic, never married.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Nikola_Tesla',
    questions: [
      {
        prompt: 'What is Tesla\'s single biggest contribution to modern life?',
        expectedAnswer:
          'The alternating-current (AC) electrical system. Almost every electricity grid in the world uses AC because it transmits efficiently over long distances. Tesla, with Westinghouse, championed AC over Edison\'s direct current.',
        hints: [],
      },
      {
        prompt: 'What was the War of Currents?',
        expectedAnswer:
          'The 1880s-1890s battle between Tesla and Westinghouse (alternating current, AC) and Edison (direct current, DC) for the standard of electricity distribution. AC won.',
        hints: [],
      },
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
    summary:
      'German-born theoretical physicist (1879-1955), Swiss and later American citizen. Two main contributions: special relativity (1905), which showed that time and space are intertwined and that nothing can exceed the speed of light; and general relativity (1915), which reframed gravity as the curvature of spacetime caused by mass. The famous equation E=mc² (energy equals mass times the speed of light squared) is from special relativity. Together these ended classical (Newtonian) physics\' dominance. Jewish; left Germany when the Nazis came to power; later signed the letter that warned President Roosevelt about the possibility of nuclear weapons.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Albert_Einstein',
    questions: [
      {
        prompt: 'What are Einstein\'s two main theories, and what does each say?',
        expectedAnswer:
          'Special relativity (1905): time and space are intertwined, nothing can exceed the speed of light, energy equals mass times c squared. General relativity (1915): gravity is the curvature of spacetime caused by mass.',
        hints: [],
      },
      {
        prompt: 'Why did Einstein leave Germany?',
        expectedAnswer:
          'He was Jewish, and left when the Nazis came to power (1933). He spent the rest of his life in the US, mostly at Princeton.',
        hints: [],
      },
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
    summary:
      'Polish-French physicist and chemist (1867-1934), born Maria Skłodowska in Warsaw, worked in Paris. With her husband Pierre Curie she discovered the elements polonium (named for Poland) and radium, and coined the term "radioactivity." She is the only person to have won Nobel Prizes in two different sciences: Physics 1903 (shared with Pierre and Henri Becquerel) for radioactivity research, and Chemistry 1911 (alone) for isolating radium. She founded radiation research institutes in Paris and Warsaw. She died of leukaemia caused by long-term radiation exposure, before its dangers were understood.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Marie_Curie',
    questions: [
      {
        prompt: 'Why is Marie Curie unique in Nobel Prize history?',
        expectedAnswer:
          'She is the only person to have won Nobel Prizes in two different sciences: Physics (1903) for radioactivity research and Chemistry (1911) for isolating radium.',
        hints: [],
      },
      {
        prompt: 'What killed Marie Curie?',
        expectedAnswer:
          'Leukaemia caused by long-term exposure to radiation. The dangers of the materials she worked with were not understood at the time.',
        hints: [],
      },
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
    summary:
      'English naturalist (1809-1882), best known for the theory of evolution by natural selection. His five-year voyage on HMS Beagle (1831-1836), especially observations in the Galápagos Islands, gave him the evidence he sat on for over twenty years before publishing. "On the Origin of Species" (1859) argued that species change over time as individuals with traits better suited to their environment leave more descendants. The Origin reframed biology and the human place in nature. Darwin avoided the topic of human evolution in the Origin, addressing it directly only in "The Descent of Man" (1871).',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Charles_Darwin',
    questions: [
      {
        prompt: 'What is the core claim of natural selection?',
        expectedAnswer:
          'Individuals with traits better suited to their environment leave more descendants, so over generations those traits become more common in the population. Species change over time as a result.',
        hints: [],
      },
      {
        prompt: 'Why did Darwin wait over twenty years to publish On the Origin of Species?',
        expectedAnswer:
          'He understood how controversial it would be and wanted his evidence airtight. He published in 1859, two decades after the Beagle voyage, partly prompted by Alfred Russel Wallace independently arriving at the same idea.',
        hints: [],
      },
    ],
    edges: [{ to: 'industrial-revolution', relation: 'contemporary_of' }],
  },

  // ============ MODERN WORLD SPINE ============
  {
    id: 'treaty-of-versailles',
    name: 'The Treaty of Versailles',
    domain: 'modern_world',
    summary:
      'Signed 28 June 1919 at the Palace of Versailles, the treaty ended World War I and reorganised Europe. It blamed Germany for the war (the "war guilt clause"), required massive reparations, shrank German territory, and limited the German military. New states (Poland, Czechoslovakia, Yugoslavia) were carved out. Most historians now agree the treaty was harsh enough to humiliate Germany without being harsh enough to stop it recovering, and the economic ruin and political resentment it produced were major causes of the rise of Nazism and World War II within twenty years.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Treaty_of_Versailles',
    questions: [
      {
        prompt: 'What did the Treaty of Versailles do to Germany?',
        expectedAnswer:
          'Blamed Germany for World War I (the war guilt clause), required massive reparations, shrank its territory, and limited its military. New states were also carved out of former empires.',
        hints: [],
      },
      {
        prompt: 'How is the Treaty of Versailles connected to World War II?',
        expectedAnswer:
          'It humiliated Germany without preventing recovery. The resulting economic ruin and political resentment fed the rise of Nazism. Most historians treat the treaty as a major cause of the next war twenty years later.',
        hints: [],
      },
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
    summary:
      'The geopolitical rivalry between the United States and the Soviet Union, and their respective blocs, from roughly 1947 to 1991. "Cold" because the two superpowers never fought each other directly; their conflict ran through proxy wars (Korea, Vietnam, Afghanistan, much of Africa and Latin America), arms races (nuclear and conventional), space competition, propaganda, and economic blocs (the Warsaw Pact vs NATO; capitalism vs state socialism). The Cuban Missile Crisis (1962) was the closest the world came to nuclear war. The Cold War ended with the fall of the Berlin Wall (1989) and dissolution of the USSR (1991).',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Cold_War',
    questions: [
      {
        prompt: 'Why is the Cold War called "cold"?',
        expectedAnswer:
          'Because the US and USSR never fought each other directly. The conflict ran through proxy wars (Korea, Vietnam, Afghanistan), arms races, space competition, and economic blocs.',
        hints: [],
      },
      {
        prompt: 'When was the Cold War closest to becoming a hot war?',
        expectedAnswer:
          'The Cuban Missile Crisis, October 1962, when Soviet nuclear missiles in Cuba brought the two powers within hours of nuclear conflict before backing down.',
        hints: [],
      },
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
    summary:
      'The Soviet Union formally dissolved on 26 December 1991, splitting into 15 independent states (Russia, Ukraine, the Baltic states, Belarus, the Central Asian republics, and more). The causes were stacked: a stagnant centrally-planned economy unable to keep up with the West, the costs of the Cold War arms race and the Afghan war, Mikhail Gorbachev\'s reforms (glasnost and perestroika) opening criticism the regime could not contain, the independence movements in the Baltic states, and a failed coup against Gorbachev in August 1991 that fatally weakened central authority. With the USSR gone, the Cold War ended definitively.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Dissolution_of_the_Soviet_Union',
    questions: [
      {
        prompt: 'How many independent states did the Soviet Union split into in 1991?',
        expectedAnswer:
          '15 states. Russia is the largest; others include Ukraine, the Baltic states (Estonia, Latvia, Lithuania), Belarus, and five Central Asian republics.',
        hints: [],
      },
      {
        prompt: 'Name three causes of the Soviet collapse.',
        expectedAnswer:
          'Several reasonable answers: stagnant centrally-planned economy, costs of the Cold War arms race and Afghan war, Gorbachev\'s reforms (glasnost and perestroika) opening criticism, independence movements in the Baltics, the failed August 1991 coup.',
        hints: [],
      },
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
    summary:
      'The worst global economic crisis since the 1930s. The proximate trigger: a US housing bubble built on subprime mortgages (loans to people who could not really afford them) that were repackaged and sold worldwide as supposedly safe investments. When US house prices fell from 2006, the mortgages defaulted in waves, the investment banks that held them imploded (Lehman Brothers collapsed in September 2008), and credit froze globally. Governments bailed out banks at vast cost; unemployment rose sharply; a decade of "austerity" politics followed in Europe. The eurozone debt crisis (Greece, 2010-onwards) was a direct downstream effect. Political consequences include the rise of populist movements on both left and right.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/2008_financial_crisis',
    questions: [
      {
        prompt: 'What were "subprime mortgages" and why did they cause a global crisis?',
        expectedAnswer:
          'Loans to US homebuyers who could not really afford them. They were repackaged and sold worldwide as supposedly safe investments. When US house prices fell, the mortgages defaulted, the global banks that held them imploded, and credit froze worldwide.',
        hints: [],
      },
      {
        prompt: 'Name two political consequences of the 2008 crisis.',
        expectedAnswer:
          'Several reasonable answers: a decade of austerity politics in Europe, the eurozone debt crisis (Greece especially), the rise of populist movements on left and right, declining trust in financial institutions.',
        hints: [],
      },
    ],
    edges: [{ to: 'european-union', relation: 'influenced_by' }],
  },
]

const SEED_FLAG_KEY = 'seed:v1:loaded'

export async function loadSeedIfNeeded(): Promise<void> {
  const flag = await db.settings.get(SEED_FLAG_KEY)
  if (flag) return

  const now = Date.now()

  await db.transaction(
    'rw',
    [db.concepts, db.lessons, db.edges, db.reviews, db.settings],
    async () => {
      for (const seed of SEED) {
        const lessonId = `${seed.id}--lesson`

        const concept: Concept = {
          id: seed.id,
          name: seed.name,
          domain: seed.domain,
          lessonId,
          summary: seed.summary,
          wikipediaUrl: seed.wikipediaUrl,
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
