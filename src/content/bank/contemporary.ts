import type { BankConcept } from '../types'

// The Cold War, After the Cold War, Multipolar Present.

export const CONTEMPORARY: BankConcept[] = [
  {
    id: 'united-nations',
    name: 'The United Nations',
    domain: 'politics',
    approxYear: 1945,
    eras: ['coldwar'],
    lat: 40.75,
    lng: -73.97,
    summary:
      'An organisation of nearly all the world\'s countries, founded in 1945 after World War II to prevent another global war and promote cooperation. Its Security Council, where five permanent members hold a veto, can authorise peacekeeping and sanctions. Its headquarters are in New York.',
    wikipedia: 'https://en.wikipedia.org/wiki/United_Nations',
    questions: [
      {
        format: 'cloze',
        prompt: 'The United Nations was founded in ____, after World War II.',
        answer: '1945',
      },
      {
        format: 'contrast',
        prompt: 'How many permanent, veto-holding members does the UN Security Council have?',
        answer: 'Five',
        distractors: ['Ten', 'Fifteen', 'Three'],
      },
    ],
    edges: [{ to: 'world-war-two', relation: 'successor_of' }],
  },
  {
    id: 'cold-war',
    name: 'The Cold War',
    domain: 'modern_world',
    approxYear: 1960,
    eras: ['coldwar'],
    summary:
      'The rivalry between the United States and the Soviet Union, roughly 1947 to 1991. The two never fought directly, hence "cold", but clashed through proxy wars, an arms race, the space race, and competing ideologies of capitalism and communism. It ended with the collapse of the Soviet bloc.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cold_War',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Cold War was a rivalry between the United States and the ____ Union.',
        answer: 'Soviet',
      },
      {
        format: 'contrast',
        prompt: 'Why is the Cold War called "cold"?',
        answer: 'The superpowers never fought each other directly',
        distractors: [
          'It was fought in the Arctic',
          'It involved no weapons',
          'It happened in winter',
        ],
      },
    ],
    edges: [
      { to: 'world-war-two', relation: 'successor_of' },
      { to: 'cuban-missile-crisis', relation: 'caused' },
      { to: 'korean-peninsula', relation: 'caused' },
      { to: 'fall-of-berlin-wall', relation: 'caused' },
    ],
  },
  {
    id: 'korean-peninsula',
    name: 'The Korean peninsula',
    domain: 'geography',
    approxYear: 1953,
    eras: ['coldwar'],
    lat: 38.0,
    lng: 127.5,
    summary:
      'Divided since 1948 into communist North Korea and capitalist South Korea, split along the 38th parallel after Japanese rule ended. The Korean War of 1950 to 1953 fixed the division and ended in a ceasefire, not a peace treaty, so the two are technically still at war.',
    wikipedia: 'https://en.wikipedia.org/wiki/Korea',
    questions: [
      {
        format: 'cloze',
        prompt: 'Korea is divided roughly along the ____th parallel.',
        answer: '38',
      },
      {
        format: 'contrast',
        prompt: 'The Korean War ended in 1953 with what, rather than a peace treaty?',
        answer: 'A ceasefire',
        distractors: ['A surrender', 'A reunification', 'A referendum'],
      },
    ],
    edges: [{ to: 'cold-war', relation: 'part_of' }],
  },
  {
    id: 'decolonisation',
    name: 'Decolonisation',
    domain: 'history',
    approxYear: 1960,
    eras: ['coldwar'],
    summary:
      'In the decades after World War II, dozens of colonies in Asia and Africa won independence from European empires. India led the way in 1947; most of Africa became independent around 1960. It redrew the world map and created the majority of today\'s nation-states.',
    wikipedia: 'https://en.wikipedia.org/wiki/Decolonization',
    questions: [
      {
        format: 'cloze',
        prompt: '____ won independence from Britain in 1947, leading the wave of decolonisation.',
        answer: 'India',
      },
    ],
    edges: [{ to: 'world-war-two', relation: 'successor_of' }],
  },
  {
    id: 'civil-rights-movement',
    name: 'The US civil rights movement',
    domain: 'politics',
    approxYear: 1964,
    eras: ['coldwar'],
    lat: 33.75,
    lng: -84.39,
    summary:
      'A movement in the 1950s and 1960s to end racial segregation and win equal rights for Black Americans, led by figures like Martin Luther King Jr. through non-violent protest. It won the Civil Rights Act of 1964 and the Voting Rights Act of 1965, dismantling legal segregation.',
    wikipedia: 'https://en.wikipedia.org/wiki/Civil_rights_movement',
    questions: [
      {
        format: 'cloze',
        prompt: 'The US civil rights movement was led through non-violent protest by Martin Luther ____ Jr.',
        answer: 'King',
      },
    ],
    edges: [{ to: 'abolition-of-slavery', relation: 'successor_of' }],
  },
  {
    id: 'cuban-missile-crisis',
    name: 'The Cuban Missile Crisis',
    domain: 'history',
    approxYear: 1962,
    eras: ['coldwar'],
    lat: 23.0,
    lng: -82.0,
    summary:
      'In October 1962 the United States discovered Soviet nuclear missiles in Cuba, 90 miles from Florida. For thirteen days the world stood on the brink of nuclear war until the USSR agreed to remove them. It was the closest the Cold War came to going hot.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cuban_Missile_Crisis',
    questions: [
      {
        format: 'cloze',
        prompt: 'In 1962 the world neared nuclear war over Soviet missiles placed in ____.',
        answer: 'Cuba',
      },
    ],
    edges: [{ to: 'cold-war', relation: 'part_of' }],
  },
  {
    id: 'moon-landing',
    name: 'The Moon landing',
    domain: 'science',
    approxYear: 1969,
    eras: ['coldwar'],
    summary:
      'In July 1969 the US mission Apollo 11 landed the first humans on the Moon, with Neil Armstrong the first to step onto its surface. It was the triumph of the space race against the Soviet Union and remains one of the greatest feats of engineering in history.',
    wikipedia: 'https://en.wikipedia.org/wiki/Apollo_11',
    questions: [
      {
        format: 'cloze',
        prompt: 'The first human to walk on the Moon, in 1969, was Neil ____.',
        answer: 'Armstrong',
      },
      {
        format: 'contrast',
        prompt: 'Which mission first landed humans on the Moon in 1969?',
        answer: 'Apollo 11',
        distractors: ['Apollo 13', 'Sputnik 1', 'Gemini 4'],
      },
    ],
    edges: [{ to: 'cold-war', relation: 'part_of' }],
  },
  {
    id: 'european-union',
    name: 'The European Union',
    domain: 'politics',
    approxYear: 1957,
    eras: ['coldwar', 'postcoldwar'],
    lat: 50.85,
    lng: 4.35,
    summary:
      'A union of European states that grew out of a postwar project to tie France and Germany together so they could never again go to war. It began with six members in 1957 and now has 27. Its single market allows free movement of goods, services, capital, and people.',
    wikipedia: 'https://en.wikipedia.org/wiki/European_Union',
    questions: [
      {
        format: 'cloze',
        prompt: 'The EU single market allows free movement of goods, services, capital, and ____.',
        answer: 'people',
      },
      {
        format: 'contrast',
        prompt: 'The European project was originally created to prevent war between France and which country?',
        answer: 'Germany',
        distractors: ['Britain', 'Russia', 'Italy'],
      },
    ],
    edges: [
      { to: 'world-war-two', relation: 'successor_of' },
      { to: 'eu-member-states', relation: 'part_of' },
    ],
  },
  {
    id: 'hip-hop',
    name: 'Hip-hop',
    domain: 'culture',
    approxYear: 1973,
    eras: ['coldwar', 'postcoldwar'],
    lat: 40.84,
    lng: -73.92,
    summary:
      'A cultural movement that began among Black and Latino youth in the Bronx, New York, in the early 1970s. Its four elements are DJing, rapping, graffiti, and breakdancing. From a local street culture it grew into the most commercially dominant music in the world.',
    wikipedia: 'https://en.wikipedia.org/wiki/Hip-hop',
    questions: [
      {
        format: 'cloze',
        prompt: 'Hip-hop began in the early 1970s in the ____, a part of New York City.',
        answer: 'Bronx',
      },
    ],
    edges: [{ to: 'cold-war', relation: 'contemporary_of' }],
  },
  {
    id: 'fall-of-berlin-wall',
    name: 'The fall of the Berlin Wall',
    domain: 'history',
    approxYear: 1989,
    eras: ['coldwar'],
    lat: 52.52,
    lng: 13.38,
    summary:
      'On 9 November 1989 the wall dividing communist East Berlin from West Berlin was opened, and crowds crossed freely for the first time since 1961. It became the symbol of the collapse of communism in eastern Europe and the end of the Cold War.',
    wikipedia: 'https://en.wikipedia.org/wiki/Fall_of_the_Berlin_Wall',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Berlin Wall fell in the year ____.',
        answer: '1989',
      },
      {
        format: 'contrast',
        prompt: 'The Berlin Wall divided East from West in which city?',
        answer: 'Berlin',
        distractors: ['Moscow', 'Vienna', 'Prague'],
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
    approxYear: 1989,
    eras: ['coldwar'],
    lat: 50.08,
    lng: 14.44,
    summary:
      'The peaceful overthrow of communist rule in Czechoslovakia in late 1989, achieved through mass protest in a matter of weeks without bloodshed. The dissident playwright Vaclav Havel became president. Three years later the country split peacefully into the Czech Republic and Slovakia.',
    wikipedia: 'https://en.wikipedia.org/wiki/Velvet_Revolution',
    questions: [
      {
        format: 'cloze',
        prompt: 'The 1989 peaceful overthrow of communism in Czechoslovakia is called the ____ Revolution.',
        answer: 'Velvet',
      },
    ],
    edges: [
      { to: 'fall-of-berlin-wall', relation: 'contemporary_of' },
      { to: 'slovakia-neighbours', relation: 'caused' },
    ],
  },
  {
    id: 'fall-of-soviet-union',
    name: 'The fall of the Soviet Union',
    domain: 'modern_world',
    approxYear: 1991,
    eras: ['postcoldwar'],
    summary:
      'In December 1991 the Soviet Union broke apart into fifteen independent countries, ending the Cold War. A stagnant economy, the cost of the arms race, and reform that let in long-suppressed criticism all brought it down. Russia emerged as its main successor state.',
    wikipedia: 'https://en.wikipedia.org/wiki/Dissolution_of_the_Soviet_Union',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Soviet Union broke apart into ____ independent countries in 1991.',
        answer: 'fifteen',
        chipDistractors: ['five', 'ten', 'twenty'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'successor_of' },
      { to: 'russian-revolution', relation: 'successor_of' },
      { to: 'eu-member-states', relation: 'caused' },
    ],
  },
  {
    id: 'slovakia-neighbours',
    name: 'Slovakia and its neighbours',
    domain: 'geography',
    approxYear: 1993,
    eras: ['postcoldwar'],
    lat: 48.7,
    lng: 19.7,
    summary:
      'Slovakia is a landlocked country in central Europe, independent since 1993 when it split peacefully from the Czech Republic. It borders five countries: the Czech Republic, Poland, Ukraine, Hungary, and Austria. Its capital is Bratislava, on the Danube near the Austrian border.',
    wikipedia: 'https://en.wikipedia.org/wiki/Slovakia',
    questions: [
      {
        format: 'cloze',
        prompt: 'The capital of Slovakia is ____.',
        answer: 'Bratislava',
      },
      {
        format: 'contrast',
        prompt: 'Slovakia became independent in 1993 by peacefully splitting from which country?',
        answer: 'The Czech Republic',
        distractors: ['Hungary', 'Poland', 'Austria'],
      },
    ],
    edges: [
      { to: 'velvet-revolution', relation: 'successor_of' },
      { to: 'eu-member-states', relation: 'part_of' },
    ],
  },
  {
    id: 'eu-member-states',
    name: 'EU member states',
    domain: 'geography',
    approxYear: 2004,
    eras: ['postcoldwar', 'multipolar'],
    lat: 50.0,
    lng: 10.0,
    summary:
      'The European Union has 27 member states, after the United Kingdom left in 2020. A large eastward enlargement in 2004 brought in ten countries, including Slovakia, Poland, and the Baltic states. Being in the EU is separate from using the euro or being in the passport-free Schengen Area.',
    wikipedia: 'https://en.wikipedia.org/wiki/Member_state_of_the_European_Union',
    questions: [
      {
        format: 'cloze',
        prompt: 'The EU has ____ member states after the UK left.',
        answer: '27',
        chipDistractors: ['25', '28', '30'],
      },
    ],
    edges: [{ to: 'european-union', relation: 'part_of' }],
  },
  {
    id: 'world-wide-web',
    name: 'The World Wide Web',
    domain: 'science',
    approxYear: 1991,
    eras: ['postcoldwar'],
    summary:
      'The system of linked web pages we browse, invented by the British scientist Tim Berners-Lee at the CERN research lab around 1989 to 1991. He gave it away for free, with no patent, which let it spread to everyone and reshape how the world works, learns, and talks.',
    wikipedia: 'https://en.wikipedia.org/wiki/World_Wide_Web',
    questions: [
      {
        format: 'cloze',
        prompt: 'The World Wide Web was invented by Tim ____.',
        answer: 'Berners-Lee',
      },
      {
        format: 'contrast',
        prompt: 'At which research lab was the World Wide Web invented?',
        answer: 'CERN',
        distractors: ['NASA', 'MIT', 'IBM'],
      },
    ],
    edges: [{ to: 'smartphone', relation: 'caused' }],
  },
  {
    id: 'september-11',
    name: 'The September 11 attacks',
    domain: 'history',
    approxYear: 2001,
    eras: ['postcoldwar'],
    lat: 40.71,
    lng: -74.01,
    summary:
      'On 11 September 2001 the militant group al-Qaeda hijacked four planes and attacked the United States, destroying the World Trade Center towers in New York and killing nearly 3,000 people. The attacks led the US into wars in Afghanistan and later Iraq, defining the next two decades.',
    wikipedia: 'https://en.wikipedia.org/wiki/September_11_attacks',
    questions: [
      {
        format: 'cloze',
        prompt: 'The September 11 attacks in 2001 destroyed the World ____ Center in New York.',
        answer: 'Trade',
      },
    ],
    edges: [{ to: 'cold-war', relation: 'successor_of' }],
  },
  {
    id: '2008-financial-crisis',
    name: 'The 2008 financial crisis',
    domain: 'modern_world',
    approxYear: 2008,
    eras: ['multipolar'],
    summary:
      'The worst economic crisis since the Great Depression, set off by a collapse in the US housing market built on risky "subprime" mortgages. Major banks failed, governments spent vast sums on bailouts, and a decade of austerity and political anger followed across the West.',
    wikipedia: 'https://en.wikipedia.org/wiki/2008_financial_crisis',
    questions: [
      {
        format: 'cloze',
        prompt: 'The 2008 crisis began with a collapse in the US ____ market.',
        answer: 'housing',
      },
    ],
    edges: [{ to: 'european-union', relation: 'influenced_by' }],
  },
  {
    id: 'smartphone',
    name: 'The smartphone',
    domain: 'science',
    approxYear: 2007,
    eras: ['multipolar'],
    summary:
      'Apple\'s iPhone, launched in 2007, put a powerful internet-connected computer in everyone\'s pocket and set the template every smartphone since has followed. Within a decade billions of people carried one, transforming how the world communicates, works, shops, and argues.',
    wikipedia: 'https://en.wikipedia.org/wiki/Smartphone',
    questions: [
      {
        format: 'cloze',
        prompt: 'The 2007 device that set the template for modern smartphones was Apple\'s ____.',
        answer: 'iPhone',
      },
    ],
    edges: [{ to: 'world-wide-web', relation: 'successor_of' }],
  },
  {
    id: 'arab-spring',
    name: 'The Arab Spring',
    domain: 'history',
    approxYear: 2011,
    eras: ['multipolar'],
    lat: 30.04,
    lng: 31.24,
    summary:
      'A wave of pro-democracy uprisings across the Arab world that began in Tunisia in late 2010 and spread in 2011. Some toppled long-ruling dictators; others were crushed or collapsed into civil war, most devastatingly in Syria. Social media played a major role in organising the protests.',
    wikipedia: 'https://en.wikipedia.org/wiki/Arab_Spring',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Arab Spring uprisings began in late 2010 in the country of ____.',
        answer: 'Tunisia',
      },
    ],
    edges: [{ to: 'smartphone', relation: 'influenced_by' }],
  },
  {
    id: 'climate-change',
    name: 'Climate change',
    domain: 'science',
    approxYear: 2015,
    eras: ['multipolar'],
    summary:
      'The warming of the Earth caused mainly by greenhouse gases from burning fossil fuels since the Industrial Revolution. It is raising sea levels and making extreme weather more common. In the 2015 Paris Agreement, almost every country pledged to limit warming, though progress has been slow.',
    wikipedia: 'https://en.wikipedia.org/wiki/Climate_change',
    questions: [
      {
        format: 'cloze',
        prompt: 'Climate change is driven mainly by greenhouse gases from burning ____ fuels.',
        answer: 'fossil',
      },
      {
        format: 'contrast',
        prompt: 'In which 2015 agreement did almost every country pledge to limit global warming?',
        answer: 'The Paris Agreement',
        distractors: ['The Kyoto Protocol', 'The Geneva Convention', 'The Maastricht Treaty'],
      },
    ],
    edges: [{ to: 'industrial-revolution', relation: 'influenced_by' }],
  },
  {
    id: 'sahel',
    name: 'The Sahel',
    domain: 'geography',
    approxYear: 2020,
    eras: ['multipolar'],
    lat: 15.0,
    lng: 0.0,
    summary:
      'A dry belt of land across Africa just south of the Sahara desert, running from the Atlantic to the Red Sea. It faces overlapping crises: a spreading desert, armed insurgencies, and a string of military coups since 2020. It is one of the poorest and fastest-growing regions on Earth.',
    wikipedia: 'https://en.wikipedia.org/wiki/Sahel',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Sahel is the dry belt just south of the ____ desert.',
        answer: 'Sahara',
      },
    ],
    edges: [{ to: 'climate-change', relation: 'influenced_by' }],
  },
]
