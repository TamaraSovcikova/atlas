import type { BankConcept } from '../types'

export const COLDWAR_EXPANDED: BankConcept[] = [
  // ── Post-WWII settlement ─────────────────────────────────────────────────

  {
    id: 'marshall-plan',
    name: 'The Marshall Plan',
    domain: 'history',
    approxYear: 1948,
    eras: ['coldwar'],
    summary:
      'A US programme that provided over $13 billion (roughly $150 billion today) to rebuild Western European economies after World War II, proposed by Secretary of State George Marshall in 1947. Sixteen countries received aid; West Germany\'s swift recovery — the "economic miracle" — was among its most dramatic results. It also aimed to prevent communist movements from gaining power in war-devastated democracies.',
    wikipedia: 'https://en.wikipedia.org/wiki/Marshall_Plan',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Marshall Plan provided over $13 billion to rebuild ____ Europe after WWII.',
        answer: 'Western',
      },
      {
        format: 'contrast',
        prompt: 'Who proposed the Marshall Plan in 1947?',
        answer: 'Secretary of State George Marshall',
        distractors: ['President Harry Truman', 'General Dwight Eisenhower', 'Dean Acheson'],
      },
    ],
    edges: [
      { to: 'world-war-two', relation: 'successor_of' },
      { to: 'cold-war', relation: 'part_of' },
    ],
  },

  {
    id: 'truman-doctrine',
    name: 'The Truman Doctrine',
    domain: 'politics',
    approxYear: 1947,
    eras: ['coldwar'],
    summary:
      'A 1947 US foreign policy in which President Harry Truman pledged to support free peoples resisting subjugation by armed minorities or outside pressures — in practice, communist takeover. It was first applied to Greece and Turkey and became the foundation of Cold War containment strategy.',
    wikipedia: 'https://en.wikipedia.org/wiki/Truman_Doctrine',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Truman Doctrine pledged US support against communist takeover, first applied to Greece and ____.',
        answer: 'Turkey',
      },
      {
        format: 'contrast',
        prompt: 'Which US president announced the doctrine of containing communism in 1947?',
        answer: 'Harry Truman',
        distractors: ['Franklin Roosevelt', 'Dwight Eisenhower', 'John Kennedy'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'marshall-plan', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'berlin-airlift',
    name: 'The Berlin Airlift',
    domain: 'history',
    approxYear: 1948,
    eras: ['coldwar'],
    lat: 52.52,
    lng: 13.38,
    summary:
      'When the Soviet Union blockaded West Berlin in June 1948, cutting off all land routes, Western allies flew in over 2.3 million tonnes of supplies over eleven months — a plane landing every 45 seconds at peak. Stalin ended the blockade in May 1949, having failed to starve the West out of the city.',
    wikipedia: 'https://en.wikipedia.org/wiki/Berlin_Blockade',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Berlin Airlift flew in supplies after the Soviet Union ____ West Berlin in 1948.',
        answer: 'blockaded',
      },
      {
        format: 'contrast',
        prompt: 'How long did the Berlin Airlift last?',
        answer: 'About eleven months',
        distractors: ['Three weeks', 'Four years', 'Two months'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'fall-of-berlin-wall', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'nato-founding',
    name: 'The founding of NATO',
    domain: 'politics',
    approxYear: 1949,
    eras: ['coldwar'],
    summary:
      'The North Atlantic Treaty Organisation was founded in April 1949 by the United States, Canada, and ten Western European nations, establishing a mutual defence pact: an attack on one member is treated as an attack on all. Article 5 of the treaty is its collective-defence cornerstone, invoked once — after the September 11 attacks.',
    wikipedia: 'https://en.wikipedia.org/wiki/NATO',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'NATO was founded in ____ as a mutual-defence alliance of Western nations.',
        answer: '1949',
      },
      {
        format: 'contrast',
        prompt: 'Article 5 of NATO\'s treaty states that an attack on one member is an attack on all — it has been invoked once, after which event?',
        answer: 'The September 11 attacks',
        distractors: ['The Korean War', 'The Cuban Missile Crisis', 'The Gulf War'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'world-war-two', relation: 'successor_of' },
    ],
  },

  {
    id: 'warsaw-pact',
    name: 'The Warsaw Pact',
    domain: 'politics',
    approxYear: 1955,
    eras: ['coldwar'],
    summary:
      'A mutual-defence alliance created by the Soviet Union in 1955 to counter NATO, grouping the USSR and seven Eastern European communist states. Any member that tried to leave risked Soviet invasion — as Hungary discovered in 1956 and Czechoslovakia in 1968. It dissolved in 1991 when the Soviet bloc collapsed.',
    wikipedia: 'https://en.wikipedia.org/wiki/Warsaw_Pact',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Warsaw Pact was the Soviet-led military alliance created to counter ____.',
        answer: 'NATO',
      },
      {
        format: 'contrast',
        prompt: 'When did the Warsaw Pact dissolve?',
        answer: '1991',
        distractors: ['1989', '1975', '1961'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'nato-founding', relation: 'opposed' },
    ],
  },

  {
    id: 'korean-war',
    name: 'The Korean War',
    domain: 'history',
    approxYear: 1950,
    eras: ['coldwar'],
    lat: 37.5,
    lng: 127.0,
    summary:
      'North Korea\'s surprise invasion of the South in June 1950 drew in a US-led UN force and eventually China, making it the first hot war of the Cold War. General Douglas MacArthur\'s bold landing at Inchon reversed the North\'s advances before China intervened; Truman fired MacArthur for insubordination after he publicly threatened to attack China. The war ended in a ceasefire along roughly the original border in 1953.',
    wikipedia: 'https://en.wikipedia.org/wiki/Korean_War',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Korean War began with North Korea\'s invasion of the South in ____.',
        answer: '1950',
      },
      {
        format: 'contrast',
        prompt: 'Which US general was famously fired by President Truman during the Korean War?',
        answer: 'Douglas MacArthur',
        distractors: ['Omar Bradley', 'Matthew Ridgway', 'Dwight Eisenhower'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'korean-peninsula', relation: 'caused' },
    ],
  },

  {
    id: 'mccarthyism',
    name: 'McCarthyism / the Red Scare',
    domain: 'history',
    approxYear: 1950,
    eras: ['coldwar'],
    lat: 38.89,
    lng: -77.0,
    summary:
      'Senator Joseph McCarthy led a wave of anti-communist hysteria in the United States from 1950 to 1954, making sweeping accusations of Soviet infiltration in the government, military, and entertainment industry — often without evidence. Thousands of careers were destroyed before a televised Army hearing exposed his reckless methods and the Senate censured him.',
    wikipedia: 'https://en.wikipedia.org/wiki/McCarthyism',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Senator ____ led anti-communist witch-hunts in the US in the early 1950s.',
        answer: 'McCarthy',
      },
      {
        format: 'contrast',
        prompt: 'How did McCarthyism come to an end?',
        answer: 'Televised hearings exposed his methods and the Senate censured him',
        distractors: [
          'He was convicted of treason',
          'A Soviet spy was caught proving his claims',
          'President Eisenhower ordered his arrest',
        ],
      },
    ],
    edges: [{ to: 'cold-war', relation: 'part_of' }],
  },

  {
    id: 'suez-crisis',
    name: 'The Suez Crisis',
    domain: 'history',
    approxYear: 1956,
    eras: ['coldwar'],
    lat: 30.5,
    lng: 32.3,
    summary:
      'When Egypt\'s President Nasser nationalised the Suez Canal in 1956, Britain, France, and Israel secretly planned and launched an invasion to retake it. The United States, furious at being excluded, pressured them to withdraw — a humiliation that signalled the end of British and French imperial power and demonstrated US dominance of the Western alliance.',
    wikipedia: 'https://en.wikipedia.org/wiki/Suez_Crisis',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Suez Crisis began when Egypt\'s President Nasser ____ the Suez Canal in 1956.',
        answer: 'nationalised',
      },
      {
        format: 'contrast',
        prompt: 'Who pressured Britain and France to withdraw from Suez in 1956?',
        answer: 'The United States',
        distractors: ['The Soviet Union', 'The United Nations Secretary-General', 'Saudi Arabia'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'decolonisation', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'hungarian-revolution-1956',
    name: 'The Hungarian Revolution 1956',
    domain: 'history',
    approxYear: 1956,
    eras: ['coldwar'],
    lat: 47.5,
    lng: 19.05,
    summary:
      'Hungarians rose up in October 1956 against Soviet rule, briefly installing a reformist government under Imre Nagy that declared neutrality and withdrawal from the Warsaw Pact. The Soviet Union responded with 30,000 troops and 1,000 tanks; about 2,500 Hungarians died and 200,000 fled as refugees. The West watched but did not intervene.',
    wikipedia: 'https://en.wikipedia.org/wiki/Hungarian_Revolution_of_1956',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Soviet Union crushed the ____ Revolution of 1956 with tanks and troops.',
        answer: 'Hungarian',
      },
      {
        format: 'contrast',
        prompt: 'Approximately how many Hungarians fled as refugees after the 1956 revolution was crushed?',
        answer: '200,000',
        distractors: ['20,000', '2 million', '50,000'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'warsaw-pact', relation: 'influenced_by' },
    ],
  },

  // ── Decolonisation ────────────────────────────────────────────────────────

  {
    id: 'indian-independence-partition',
    name: 'Indian independence and Partition',
    domain: 'history',
    approxYear: 1947,
    eras: ['coldwar'],
    lat: 28.6,
    lng: 77.2,
    summary:
      'Britain granted India independence on 15 August 1947, simultaneously partitioning it into Hindu-majority India and Muslim-majority Pakistan. The Partition triggered one of history\'s largest mass migrations — about 14 million people crossed the new borders — and communal violence killed up to a million people.',
    wikipedia: 'https://en.wikipedia.org/wiki/Partition_of_India',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Indian independence in 1947 was accompanied by the Partition that created ____.',
        answer: 'Pakistan',
      },
      {
        format: 'contrast',
        prompt: 'Approximately how many people were displaced by the Partition of India in 1947?',
        answer: '14 million',
        distractors: ['1 million', '100,000', '50 million'],
      },
    ],
    edges: [
      { to: 'decolonisation', relation: 'part_of' },
      { to: 'gandhi-political', relation: 'influenced_by' },
    ],
  },

  {
    id: 'gandhi-political',
    name: 'Gandhi\'s political career',
    domain: 'history',
    approxYear: 1930,
    eras: ['coldwar'],
    lat: 23.0,
    lng: 72.6,
    summary:
      'Mohandas Gandhi led India\'s independence movement against British rule through satyagraha — non-violent civil disobedience — for over three decades. His 1930 Salt March, a 240-mile walk to the sea to make salt in defiance of British tax, became an iconic act of protest that galvanised millions. He was assassinated in January 1948, six months after independence.',
    wikipedia: 'https://en.wikipedia.org/wiki/Mahatma_Gandhi',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Gandhi\'s 1930 ____ March defied British salt taxes and galvanised India\'s independence movement.',
        answer: 'Salt',
      },
      {
        format: 'contrast',
        prompt: 'What was the name of Gandhi\'s principle of non-violent resistance?',
        answer: 'Satyagraha',
        distractors: ['Dharma', 'Ahimsa only', 'Swaraj'],
      },
    ],
    edges: [
      { to: 'indian-independence-partition', relation: 'caused' },
      { to: 'decolonisation', relation: 'part_of' },
    ],
  },

  {
    id: 'jawaharlal-nehru',
    name: 'Jawaharlal Nehru',
    domain: 'history',
    approxYear: 1947,
    eras: ['coldwar'],
    lat: 28.6,
    lng: 77.2,
    summary:
      'India\'s first prime minister, serving from independence in 1947 until his death in 1964, Nehru shaped the world\'s largest democracy into a secular, socialist state. He co-founded the Non-Aligned Movement, steering India between the US and Soviet blocs, and launched large-scale industrialisation including steel plants and the IITs. His daughter Indira Gandhi and grandson Rajiv Gandhi also became prime ministers.',
    wikipedia: 'https://en.wikipedia.org/wiki/Jawaharlal_Nehru',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Nehru co-founded the ____ Movement, keeping India between the US and Soviet blocs.',
        answer: 'Non-Aligned',
      },
      {
        format: 'contrast',
        prompt: 'How long did Nehru serve as India\'s first prime minister?',
        answer: 'Until his death in 1964 — 17 years',
        distractors: ['Five years', 'Two terms then retired in 1957', 'Until independence was secured in 1950'],
      },
    ],
    edges: [
      { to: 'indian-independence-partition', relation: 'successor_of' },
      { to: 'cold-war', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'pakistani-founding',
    name: 'The founding of Pakistan',
    domain: 'history',
    approxYear: 1947,
    eras: ['coldwar'],
    lat: 33.7,
    lng: 73.1,
    summary:
      'Pakistan was created on 14 August 1947 as a Muslim-majority homeland carved from British India, led by Mohammad Ali Jinnah as its first governor-general. It was initially two geographically separate wings — West and East Pakistan — separated by 1,600 kilometres of Indian territory, a division that ended in civil war and the creation of Bangladesh in 1971.',
    wikipedia: 'https://en.wikipedia.org/wiki/History_of_Pakistan',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Pakistan was founded on 14 August ____, one day before India\'s independence.',
        answer: '1947',
      },
      {
        format: 'contrast',
        prompt: 'Who was Pakistan\'s first governor-general?',
        answer: 'Mohammad Ali Jinnah',
        distractors: ['Liaquat Ali Khan', 'Ayub Khan', 'Zulfikar Ali Bhutto'],
      },
    ],
    edges: [
      { to: 'indian-independence-partition', relation: 'part_of' },
      { to: 'decolonisation', relation: 'part_of' },
    ],
  },

  {
    id: 'ho-chi-minh-vietnamese-independence',
    name: 'Ho Chi Minh and Vietnamese independence',
    domain: 'history',
    approxYear: 1954,
    eras: ['coldwar'],
    lat: 21.03,
    lng: 105.8,
    summary:
      'Ho Chi Minh led the Viet Minh movement that defeated French colonial forces at the Battle of Dien Bien Phu in 1954, ending French Indochina. Vietnam was then divided at the 17th parallel into communist North and non-communist South — the fault line for the subsequent Vietnam War. Ho died in 1969 before reunification, which came in 1975 after the US withdrawal.',
    wikipedia: 'https://en.wikipedia.org/wiki/Ho_Chi_Minh',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Ho Chi Minh\'s forces defeated France at Dien Bien ____ in 1954, ending French Indochina.',
        answer: 'Phu',
      },
      {
        format: 'contrast',
        prompt: 'Along which parallel was Vietnam divided after 1954?',
        answer: 'The 17th parallel',
        distractors: ['The 38th parallel', 'The Mekong River', 'The 20th parallel'],
      },
    ],
    edges: [
      { to: 'decolonisation', relation: 'part_of' },
      { to: 'vietnam-war', relation: 'caused' },
    ],
  },

  {
    id: 'algerian-war',
    name: 'The Algerian War of Independence',
    domain: 'history',
    approxYear: 1958,
    eras: ['coldwar'],
    lat: 36.7,
    lng: 3.06,
    summary:
      'Algeria\'s brutal independence war against France lasted from 1954 to 1962 and cost an estimated 300,000 to 500,000 Algerian lives. French use of torture and mass internment became a cause of international outcry. The crisis brought down France\'s Fourth Republic and returned Charles de Gaulle to power, who ultimately negotiated Algerian independence in the Evian Accords.',
    wikipedia: 'https://en.wikipedia.org/wiki/Algerian_War',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Algerian War of Independence lasted from 1954 to ____ and brought down France\'s Fourth Republic.',
        answer: '1962',
      },
      {
        format: 'contrast',
        prompt: 'Who returned to power in France as a result of the Algerian crisis?',
        answer: 'Charles de Gaulle',
        distractors: ['Georges Pompidou', 'Guy Mollet', 'François Mitterrand'],
      },
    ],
    edges: [
      { to: 'decolonisation', relation: 'part_of' },
      { to: 'cold-war', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'mau-mau-uprising',
    name: 'The Mau Mau uprising',
    domain: 'history',
    approxYear: 1952,
    eras: ['coldwar'],
    lat: -0.3,
    lng: 36.8,
    summary:
      'Kikuyu fighters in Kenya launched an armed uprising against British colonial rule in 1952, demanding land and independence. Britain declared a state of emergency and detained over 150,000 Kenyans in camps where torture and killings were systematic — facts the British government suppressed for decades. Kenya gained independence in 1963, and Britain issued a formal apology and compensation in 2013.',
    wikipedia: 'https://en.wikipedia.org/wiki/Mau_Mau_uprising',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Mau Mau uprising began in 1952 in the British colony of ____.',
        answer: 'Kenya',
      },
      {
        format: 'contrast',
        prompt: 'What did Britain do in 2013 regarding the Mau Mau uprising?',
        answer: 'Issued a formal apology and paid compensation to survivors',
        distractors: [
          'Opened all colonial archives publicly',
          'Erected a monument in Nairobi',
          'Returned land seized during the emergency',
        ],
      },
    ],
    edges: [
      { to: 'decolonisation', relation: 'part_of' },
      { to: 'cold-war', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'patrice-lumumba-congo',
    name: 'Patrice Lumumba and Congo independence',
    domain: 'history',
    approxYear: 1960,
    eras: ['coldwar'],
    lat: -4.3,
    lng: 15.3,
    summary:
      'Patrice Lumumba became the Democratic Republic of Congo\'s first prime minister when Belgium abruptly granted independence in June 1960. Within months he was deposed in a CIA-backed coup, handed to separatist forces in Katanga, and executed in January 1961. His murder became a symbol of Western Cold War interference in African decolonisation.',
    wikipedia: 'https://en.wikipedia.org/wiki/Patrice_Lumumba',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Patrice Lumumba, Congo\'s first prime minister, was deposed in a ____ -backed coup in 1960.',
        answer: 'CIA',
      },
      {
        format: 'contrast',
        prompt: 'Which European country had colonised the Congo before granting it independence in 1960?',
        answer: 'Belgium',
        distractors: ['France', 'Britain', 'Portugal'],
      },
    ],
    edges: [
      { to: 'decolonisation', relation: 'part_of' },
      { to: 'cold-war', relation: 'part_of' },
    ],
  },

  {
    id: 'nelson-mandela-apartheid',
    name: 'Nelson Mandela and South African apartheid',
    domain: 'history',
    approxYear: 1990,
    eras: ['coldwar', 'postcoldwar'],
    lat: -33.9,
    lng: 18.4,
    summary:
      'Apartheid was South Africa\'s system of racial segregation enforced by law from 1948 to 1991, denying Black citizens basic rights in their own country. Nelson Mandela led the ANC\'s resistance and was imprisoned for 27 years; his release in 1990 and election as South Africa\'s first Black president in 1994 made him a global symbol of dignity and reconciliation.',
    wikipedia: 'https://en.wikipedia.org/wiki/Nelson_Mandela',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Nelson Mandela was imprisoned for ____ years before becoming South Africa\'s first Black president.',
        answer: '27',
      },
      {
        format: 'contrast',
        prompt: 'In what year did Nelson Mandela become South Africa\'s president?',
        answer: '1994',
        distractors: ['1990', '1991', '1996'],
      },
    ],
    edges: [
      { to: 'decolonisation', relation: 'part_of' },
      { to: 'civil-rights-movement', relation: 'contemporary_of' },
    ],
  },

  // ── Space race ────────────────────────────────────────────────────────────

  {
    id: 'sputnik',
    name: 'Sputnik',
    domain: 'science',
    approxYear: 1957,
    eras: ['coldwar'],
    summary:
      'On 4 October 1957 the Soviet Union launched Sputnik 1 — a 58-centimetre metal sphere — becoming the first country to place an artificial satellite in orbit. Its radio beeps could be heard by amateur receivers worldwide. The shock galvanised the United States into creating NASA (1958) and pouring resources into science education and the space race.',
    wikipedia: 'https://en.wikipedia.org/wiki/Sputnik_1',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Soviet Union launched ____, the world\'s first artificial satellite, in October 1957.',
        answer: 'Sputnik',
      },
      {
        format: 'contrast',
        prompt: 'What US agency did Sputnik\'s launch directly prompt the creation of?',
        answer: 'NASA',
        distractors: ['The CIA', 'DARPA', 'The NSA'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'space-race', relation: 'part_of' },
    ],
  },

  {
    id: 'yuri-gagarin',
    name: 'Yuri Gagarin — first human in space',
    domain: 'science',
    approxYear: 1961,
    eras: ['coldwar'],
    summary:
      'On 12 April 1961 Soviet cosmonaut Yuri Gagarin became the first human in space, completing a 108-minute orbital flight in Vostok 1. He ejected and parachuted to Earth separately from the capsule — a detail kept secret for decades. His flight was a propaganda triumph for the USSR and pushed the United States to commit to the Moon programme.',
    wikipedia: 'https://en.wikipedia.org/wiki/Yuri_Gagarin',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Soviet cosmonaut ____ became the first human in space in April 1961.',
        answer: 'Yuri Gagarin',
      },
      {
        format: 'contrast',
        prompt: 'How long did Gagarin\'s first spaceflight last?',
        answer: '108 minutes',
        distractors: ['24 hours', '12 minutes', 'Three days'],
      },
    ],
    edges: [
      { to: 'space-race', relation: 'part_of' },
      { to: 'sputnik', relation: 'successor_of' },
    ],
  },

  {
    id: 'alan-shepard',
    name: 'Alan Shepard — first American in space',
    domain: 'science',
    approxYear: 1961,
    eras: ['coldwar'],
    summary:
      'On 5 May 1961, three weeks after Gagarin\'s orbit, Alan Shepard became the first American in space with a 15-minute suborbital flight in Freedom 7. President Kennedy cited Shepard\'s flight when announcing the goal of landing a man on the Moon by the end of the decade. Shepard later walked on the Moon during Apollo 14 and famously hit golf balls on its surface.',
    wikipedia: 'https://en.wikipedia.org/wiki/Alan_Shepard',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: '____ became the first American in space on 5 May 1961 with a 15-minute suborbital flight.',
        answer: 'Alan Shepard',
      },
      {
        format: 'contrast',
        prompt: 'What did Alan Shepard famously do on the Moon during Apollo 14?',
        answer: 'Hit golf balls',
        distractors: ['Plant a flag', 'Drive a rover', 'Leave a Bible'],
      },
    ],
    edges: [
      { to: 'space-race', relation: 'part_of' },
      { to: 'yuri-gagarin', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'space-race',
    name: 'The Space Race',
    domain: 'history',
    approxYear: 1960,
    eras: ['coldwar'],
    summary:
      'The competition between the United States and Soviet Union to achieve supremacy in spaceflight, running roughly from Sputnik in 1957 to the Apollo–Soyuz joint mission in 1975. The Soviets led early — first satellite, first human in orbit — but the US won the decisive prize: the Moon landing in 1969. It drove breakthroughs in rocketry, computing, and communications that still underpin modern life.',
    wikipedia: 'https://en.wikipedia.org/wiki/Space_Race',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Space Race began with the Soviet launch of ____ in 1957 and ended effectively with the US Moon landing in 1969.',
        answer: 'Sputnik',
      },
      {
        format: 'contrast',
        prompt: 'Which side led the Space Race in early milestones before the US landed on the Moon?',
        answer: 'The Soviet Union',
        distractors: ['The United States', 'Both were tied', 'Europe'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'moon-landing', relation: 'caused' },
    ],
  },

  {
    id: 'apollo-programme',
    name: 'The Apollo programme',
    domain: 'science',
    approxYear: 1969,
    eras: ['coldwar'],
    summary:
      'NASA\'s Apollo programme (1961–1972) fulfilled Kennedy\'s pledge to land humans on the Moon before the decade\'s end. It flew 17 missions and landed 12 astronauts on the lunar surface across six flights. The programme cost roughly $25 billion (about $260 billion today) and required 400,000 engineers, scientists, and technicians.',
    wikipedia: 'https://en.wikipedia.org/wiki/Apollo_program',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Apollo programme landed ____ astronauts on the Moon across six missions.',
        answer: '12',
      },
      {
        format: 'contrast',
        prompt: 'Which president pledged to land a man on the Moon before the end of the 1960s?',
        answer: 'John F. Kennedy',
        distractors: ['Lyndon Johnson', 'Richard Nixon', 'Dwight Eisenhower'],
      },
    ],
    edges: [
      { to: 'space-race', relation: 'part_of' },
      { to: 'moon-landing', relation: 'part_of' },
    ],
  },

  {
    id: 'challenger-disaster',
    name: 'The Challenger disaster',
    domain: 'science',
    approxYear: 1986,
    eras: ['coldwar'],
    summary:
      'Space Shuttle Challenger broke apart 73 seconds after launch on 28 January 1986, killing all seven crew members including schoolteacher Christa McAuliffe, who was to be the first civilian in space. The cause was an O-ring seal that failed in unusually cold weather; NASA had been warned but launched anyway. The disaster grounded shuttle flights for nearly three years.',
    wikipedia: 'https://en.wikipedia.org/wiki/Space_Shuttle_Challenger_disaster',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Challenger shuttle broke apart ____ seconds after launch in January 1986.',
        answer: '73',
      },
      {
        format: 'contrast',
        prompt: 'What caused the Challenger disaster?',
        answer: 'An O-ring seal that failed in cold weather',
        distractors: [
          'A fuel line rupture',
          'A software error in the navigation system',
          'A collision with debris',
        ],
      },
    ],
    edges: [{ to: 'space-race', relation: 'part_of' }],
  },

  // ── Movements & culture ───────────────────────────────────────────────────

  {
    id: 'second-wave-feminism',
    name: 'Second-wave feminism',
    domain: 'history',
    approxYear: 1963,
    eras: ['coldwar'],
    summary:
      'A wave of feminist activism in the 1960s and 1970s that went beyond votes (first-wave) to tackle workplace discrimination, reproductive rights, and domestic violence. Betty Friedan\'s 1963 book The Feminine Mystique is often credited with igniting it; the movement won the Equal Pay Act (1963) and Roe v. Wade (1973). It transformed women\'s participation in higher education and professional life.',
    wikipedia: 'https://en.wikipedia.org/wiki/Second-wave_feminism',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Betty Friedan\'s 1963 book The Feminine ____ is often credited with igniting second-wave feminism.',
        answer: 'Mystique',
      },
      {
        format: 'contrast',
        prompt: 'What distinguishes second-wave feminism from the first wave?',
        answer: 'It tackled workplace equality, reproductive rights, and domestic violence beyond just voting rights',
        distractors: [
          'It was led entirely by working-class women',
          'It focused exclusively on international women\'s rights',
          'It rejected political action in favour of cultural change only',
        ],
      },
    ],
    edges: [
      { to: 'civil-rights-movement', relation: 'contemporary_of' },
      { to: 'cold-war', relation: 'part_of' },
    ],
  },

  {
    id: 'martin-luther-king',
    name: 'Martin Luther King Jr.',
    domain: 'history',
    approxYear: 1963,
    eras: ['coldwar'],
    lat: 33.75,
    lng: -84.39,
    summary:
      'The dominant leader of the American civil rights movement, King delivered his "I Have a Dream" speech before 250,000 people at the 1963 March on Washington — the most watched live television event in US history to that point. He won the Nobel Peace Prize in 1964 and was assassinated in Memphis in April 1968, the year the Fair Housing Act passed. His strategy was disciplined non-violence modelled partly on Gandhi.',
    wikipedia: 'https://en.wikipedia.org/wiki/Martin_Luther_King_Jr.',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Martin Luther King Jr. delivered his "I Have a ____" speech at the 1963 March on Washington.',
        answer: 'Dream',
      },
      {
        format: 'contrast',
        prompt: 'In what year was Martin Luther King Jr. assassinated?',
        answer: '1968',
        distractors: ['1963', '1965', '1972'],
      },
    ],
    edges: [
      { to: 'civil-rights-movement', relation: 'part_of' },
      { to: 'malcolm-x', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'malcolm-x',
    name: 'Malcolm X',
    domain: 'history',
    approxYear: 1963,
    eras: ['coldwar'],
    lat: 40.8,
    lng: -73.95,
    summary:
      'Malcolm X was a leading voice for Black rights in the early 1960s who rejected integration in favour of Black self-determination, initially as a minister for the Nation of Islam. He was a magnetic orator who called out the limitations of non-violent protest; after breaking with the Nation of Islam in 1964 and making the Hajj he moved toward a broader vision of human rights. He was assassinated in 1965.',
    wikipedia: 'https://en.wikipedia.org/wiki/Malcolm_X',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Malcolm X was initially a minister for the ____ of Islam before breaking with it in 1964.',
        answer: 'Nation',
      },
      {
        format: 'contrast',
        prompt: 'How did Malcolm X\'s views differ from Martin Luther King Jr.\'s?',
        answer: 'He rejected integration and emphasised Black self-determination over non-violent protest',
        distractors: [
          'He supported the Republican Party',
          'He favoured economic solutions over political ones',
          'He focused on international rather than domestic rights',
        ],
      },
    ],
    edges: [
      { to: 'civil-rights-movement', relation: 'part_of' },
      { to: 'black-power-movement', relation: 'caused' },
    ],
  },

  {
    id: 'black-power-movement',
    name: 'The Black Power movement',
    domain: 'history',
    approxYear: 1966,
    eras: ['coldwar'],
    summary:
      'A political movement of the mid-1960s to mid-1970s that emphasised Black pride, self-reliance, and community control rather than integration. Stokely Carmichael popularised the term "Black Power" in 1966; the Black Panther Party organised free breakfast programmes and armed self-defence patrols. The raised black-gloved fists of Tommie Smith and John Carlos at the 1968 Olympics became its most iconic image.',
    wikipedia: 'https://en.wikipedia.org/wiki/Black_Power_movement',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Stokely Carmichael popularised the term "Black ____" in 1966.',
        answer: 'Power',
      },
      {
        format: 'contrast',
        prompt: 'What became the most iconic image of the Black Power movement in 1968?',
        answer: 'The raised black-gloved fists of athletes at the Mexico City Olympics',
        distractors: [
          'The burning of the Watts neighbourhood in Los Angeles',
          'The Black Panther Party\'s march on Sacramento',
          'Stokely Carmichael\'s speech at Howard University',
        ],
      },
    ],
    edges: [
      { to: 'civil-rights-movement', relation: 'successor_of' },
      { to: 'malcolm-x', relation: 'influenced_by' },
    ],
  },

  {
    id: 'anti-vietnam-protests',
    name: 'Anti-Vietnam War protests',
    domain: 'history',
    approxYear: 1968,
    eras: ['coldwar'],
    lat: 38.89,
    lng: -77.04,
    summary:
      'Mass opposition to the Vietnam War grew steadily through the 1960s, peaking after the 1968 Tet Offensive and the Kent State shootings of 1970, when National Guard troops killed four student protesters in Ohio. The movement stretched from campus sit-ins to half a million people marching on Washington in 1969. It accelerated US withdrawal and fundamentally changed public trust in government.',
    wikipedia: 'https://en.wikipedia.org/wiki/Opposition_to_United_States_involvement_in_the_Vietnam_War',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'At Kent State in 1970, National Guard troops killed ____ student protesters.',
        answer: 'four',
      },
      {
        format: 'contrast',
        prompt: 'How many people marched on Washington against the Vietnam War in 1969?',
        answer: 'About half a million',
        distractors: ['Ten thousand', 'One million', 'Fifty thousand'],
      },
    ],
    edges: [
      { to: 'vietnam-war', relation: 'influenced_by' },
      { to: 'student-movements-1968', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'student-movements-1968',
    name: 'The student movements of 1968',
    domain: 'history',
    approxYear: 1968,
    eras: ['coldwar'],
    summary:
      'In 1968 a global wave of student-led protests erupted: France\'s May 1968 general strike nearly toppled de Gaulle; Prague Spring reformers were crushed by Soviet tanks; and protests rocked US campuses, West Germany, Mexico, and Japan. The common threads were opposition to war and authoritarianism and a rejection of their parents\' conformism. They reshaped culture more than politics, but the political tremors lasted for decades.',
    wikipedia: 'https://en.wikipedia.org/wiki/Protests_of_1968',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'France\'s ____ 1968 general strike, led partly by students, nearly brought down de Gaulle\'s government.',
        answer: 'May',
      },
      {
        format: 'contrast',
        prompt: 'Which 1968 reform movement was crushed by Soviet tanks?',
        answer: 'The Prague Spring in Czechoslovakia',
        distractors: [
          'The Hungarian uprising',
          'The Polish Solidarity protests',
          'The East German workers\' revolt',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'anti-vietnam-protests', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'counterculture',
    name: 'The counterculture of the 1960s',
    domain: 'culture',
    approxYear: 1967,
    eras: ['coldwar'],
    lat: 37.77,
    lng: -122.45,
    summary:
      'A youth rebellion in the United States and beyond that rejected mainstream values in favour of personal freedom, anti-war politics, communal living, and experimentation with drugs and Eastern spirituality. San Francisco\'s Haight-Ashbury district and the 1969 Woodstock festival became its symbols. It reshaped music, fashion, and sexual mores permanently.',
    wikipedia: 'https://en.wikipedia.org/wiki/Counterculture_of_the_1960s',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The 1960s counterculture was symbolised by San Francisco\'s ____ district and the 1969 Woodstock festival.',
        answer: 'Haight-Ashbury',
      },
      {
        format: 'contrast',
        prompt: 'What did counterculture youth reject in favour of their own values?',
        answer: 'Mainstream conformism, the Vietnam War, and consumerism',
        distractors: [
          'Science and technology',
          'Religion of all kinds',
          'Democratic politics',
        ],
      },
    ],
    edges: [
      { to: 'student-movements-1968', relation: 'contemporary_of' },
      { to: 'rock-music-beatles', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'rock-music-beatles',
    name: 'Rock music and the Beatles',
    domain: 'culture',
    approxYear: 1964,
    eras: ['coldwar'],
    lat: 53.41,
    lng: -2.99,
    summary:
      'Rock and roll emerged in the US in the mid-1950s from a fusion of Black rhythm and blues and country music; the Beatles amplified it into a global cultural force. The Liverpool four-piece\'s 1964 US tour — "Beatlemania" — was watched by 74 million on Ed Sullivan, making them the best-selling music act in history. They pioneered the album as an art form and helped bridge racial and generational divides in music.',
    wikipedia: 'https://en.wikipedia.org/wiki/The_Beatles',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Beatles\' 1964 US television debut on The Ed Sullivan Show was watched by ____ million people.',
        answer: '74',
      },
      {
        format: 'contrast',
        prompt: 'From which city did the Beatles originate?',
        answer: 'Liverpool',
        distractors: ['London', 'Manchester', 'Birmingham'],
      },
    ],
    edges: [
      { to: 'counterculture', relation: 'influenced_by' },
      { to: 'cold-war', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'television-mass-medium',
    name: 'Television as a mass medium',
    domain: 'culture',
    approxYear: 1960,
    eras: ['coldwar'],
    summary:
      'By 1960, 90 percent of American homes had a television set — a transformation achieved in barely a decade. TV brought the Kennedy–Nixon debate, the Moon landing, the Vietnam War, and civil rights marches directly into living rooms, making it the dominant shaper of public opinion. The medium\'s power was demonstrated when Walter Cronkite declared Vietnam a "stalemate" in 1968 and LBJ reportedly said "If I\'ve lost Cronkite, I\'ve lost middle America."',
    wikipedia: 'https://en.wikipedia.org/wiki/History_of_television',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'By 1960, ____ percent of American homes had a television set.',
        answer: '90',
      },
      {
        format: 'contrast',
        prompt: 'Which CBS anchor\'s 1968 editorial on Vietnam reportedly convinced LBJ he had lost public support?',
        answer: 'Walter Cronkite',
        distractors: ['Edward R. Murrow', 'Dan Rather', 'David Brinkley'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'contemporary_of' },
      { to: 'world-wide-web', relation: 'influenced_by' },
    ],
  },

  // ── Cold War conflicts ────────────────────────────────────────────────────

  {
    id: 'vietnam-war',
    name: 'The Vietnam War',
    domain: 'history',
    approxYear: 1968,
    eras: ['coldwar'],
    lat: 16.5,
    lng: 107.0,
    summary:
      'The United States fought alongside South Vietnam against communist North Vietnam and the Viet Cong from 1964 to 1975. Over 58,000 Americans and an estimated 2–3 million Vietnamese died. Despite superior firepower the US could not achieve a decisive military victory; public opposition at home and the 1968 Tet Offensive eroded political will. US forces withdrew in 1973 and the South fell in 1975.',
    wikipedia: 'https://en.wikipedia.org/wiki/Vietnam_War',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The United States withdrew from Vietnam in ____, and the South fell to the North in 1975.',
        answer: '1973',
      },
      {
        format: 'contrast',
        prompt: 'Approximately how many Americans died in the Vietnam War?',
        answer: '58,000',
        distractors: ['10,000', '250,000', '400,000'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'ho-chi-minh-vietnamese-independence', relation: 'successor_of' },
    ],
  },

  {
    id: 'tet-offensive',
    name: 'The Tet Offensive',
    domain: 'history',
    approxYear: 1968,
    eras: ['coldwar'],
    lat: 15.88,
    lng: 108.34,
    summary:
      'On 30 January 1968 — the Vietnamese Lunar New Year — North Vietnamese and Viet Cong forces launched simultaneous attacks on over 100 South Vietnamese cities, including a brief assault on the US Embassy in Saigon. Although militarily repulsed, the Tet Offensive shattered official claims that the US was winning the war and became the turning point of American public opinion against it.',
    wikipedia: 'https://en.wikipedia.org/wiki/Tet_Offensive',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Tet Offensive began on the Vietnamese Lunar New Year, January ____.',
        answer: '1968',
      },
      {
        format: 'contrast',
        prompt: 'Why was the Tet Offensive a turning point despite being a US military success?',
        answer: 'It shattered official claims the US was winning and turned American public opinion against the war',
        distractors: [
          'It resulted in the fall of Saigon',
          'It forced a ceasefire within weeks',
          'It killed the highest number of US troops in a single day',
        ],
      },
    ],
    edges: [
      { to: 'vietnam-war', relation: 'part_of' },
      { to: 'anti-vietnam-protests', relation: 'caused' },
    ],
  },

  {
    id: 'my-lai-massacre',
    name: 'The My Lai Massacre',
    domain: 'history',
    approxYear: 1968,
    eras: ['coldwar'],
    lat: 15.18,
    lng: 108.87,
    summary:
      'On 16 March 1968 US Army soldiers killed between 347 and 504 unarmed South Vietnamese civilians in the village of My Lai — women, children, and elderly among them — during a search-and-destroy mission. The massacre was covered up for over a year; when reporter Seymour Hersh exposed it in 1969, it became a defining symbol of the war\'s moral failure. Only one soldier, Lt. William Calley, was convicted.',
    wikipedia: 'https://en.wikipedia.org/wiki/My_Lai_massacre',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'US soldiers killed hundreds of unarmed civilians at ____ Lai in Vietnam in March 1968.',
        answer: 'My',
      },
      {
        format: 'contrast',
        prompt: 'Who exposed the My Lai massacre to the public in 1969?',
        answer: 'Journalist Seymour Hersh',
        distractors: ['A military court-martial', 'Senator William Fulbright', 'Daniel Ellsberg'],
      },
    ],
    edges: [
      { to: 'vietnam-war', relation: 'part_of' },
      { to: 'anti-vietnam-protests', relation: 'caused' },
    ],
  },

  {
    id: 'gulf-of-tonkin',
    name: 'The Gulf of Tonkin incident',
    domain: 'history',
    approxYear: 1964,
    eras: ['coldwar'],
    summary:
      'In August 1964 the Johnson administration reported that North Vietnamese boats had attacked US destroyers in the Gulf of Tonkin — a second attack almost certainly never happened. Congress passed the Gulf of Tonkin Resolution giving the president unlimited authority to escalate in Vietnam without a formal declaration of war. It became a byword for government deception leading a nation into conflict.',
    wikipedia: 'https://en.wikipedia.org/wiki/Gulf_of_Tonkin_incident',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Gulf of Tonkin Resolution gave President Johnson authority to escalate the ____ War without a formal declaration.',
        answer: 'Vietnam',
      },
      {
        format: 'contrast',
        prompt: 'What is the Gulf of Tonkin incident now largely considered to be?',
        answer: 'A pretext — a second attack likely never happened',
        distractors: [
          'A genuine unprovoked attack that justified the US response',
          'A Chinese operation disguised as North Vietnamese',
          'An accidental collision, not an attack',
        ],
      },
    ],
    edges: [
      { to: 'vietnam-war', relation: 'caused' },
      { to: 'cold-war', relation: 'part_of' },
    ],
  },

  {
    id: 'cambodian-genocide',
    name: 'The Cambodian genocide / Khmer Rouge',
    domain: 'history',
    approxYear: 1977,
    eras: ['coldwar'],
    lat: 11.5,
    lng: 104.9,
    summary:
      'Between 1975 and 1979 the Khmer Rouge, led by Pol Pot, ruled Cambodia and killed an estimated 1.5 to 2 million people — roughly a quarter of the country\'s population — through executions, forced labour, and starvation in pursuit of an agrarian utopia. Cities were emptied, money abolished, and intellectuals targeted; those wearing glasses were sometimes killed as suspected educated people.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cambodian_genocide',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Khmer Rouge under Pol Pot killed roughly a ____ of Cambodia\'s population between 1975 and 1979.',
        answer: 'quarter',
      },
      {
        format: 'contrast',
        prompt: 'What economic model did the Khmer Rouge attempt to impose on Cambodia?',
        answer: 'A radical agrarian utopia — evacuating cities and abolishing money',
        distractors: [
          'Soviet-style central planning with heavy industry',
          'A market economy with state monopolies on rice',
          'Collective farming based on the Chinese Cultural Revolution',
        ],
      },
    ],
    edges: [
      { to: 'vietnam-war', relation: 'influenced_by' },
      { to: 'cold-war', relation: 'part_of' },
    ],
  },

  {
    id: 'six-day-war',
    name: 'The Six-Day War 1967',
    domain: 'history',
    approxYear: 1967,
    eras: ['coldwar'],
    lat: 31.5,
    lng: 34.8,
    summary:
      'In six days in June 1967 Israel launched pre-emptive strikes and defeated the combined forces of Egypt, Jordan, and Syria, tripling its territory by capturing the Sinai, Gaza Strip, West Bank, and Golan Heights. The war reshaped Middle Eastern politics for generations — Israeli occupation of the West Bank is its most enduring consequence.',
    wikipedia: 'https://en.wikipedia.org/wiki/Six-Day_War',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'In the 1967 Six-Day War Israel captured the Sinai, Gaza Strip, West Bank, and ____ Heights from Arab states.',
        answer: 'Golan',
      },
      {
        format: 'contrast',
        prompt: 'Which countries did Israel defeat in the Six-Day War?',
        answer: 'Egypt, Jordan, and Syria',
        distractors: ['Egypt, Lebanon, and Iraq', 'Syria, Iraq, and Saudi Arabia', 'Egypt, Syria, and the PLO'],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'yom-kippur-war', relation: 'caused' },
    ],
  },

  {
    id: 'yom-kippur-war',
    name: 'The Yom Kippur War 1973',
    domain: 'history',
    approxYear: 1973,
    eras: ['coldwar'],
    lat: 30.0,
    lng: 32.5,
    summary:
      'Egypt and Syria launched a surprise attack on Israel on Yom Kippur, the holiest day of the Jewish calendar, on 6 October 1973. Israel recovered after early reversals and emerged victorious but shaken; the war prompted OPEC\'s oil embargo against the West, quadrupling oil prices and triggering a global economic crisis. It also led indirectly to the Camp David Accords in 1978.',
    wikipedia: 'https://en.wikipedia.org/wiki/Yom_Kippur_War',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Egypt and Syria attacked Israel on Yom ______, the holiest Jewish day, in October 1973.',
        answer: 'Kippur',
      },
      {
        format: 'contrast',
        prompt: 'What was the major economic consequence of the Yom Kippur War for the West?',
        answer: 'OPEC\'s oil embargo quadrupled oil prices',
        distractors: [
          'The US dollar was decoupled from gold',
          'European banks froze Arab accounts',
          'Global wheat prices tripled',
        ],
      },
    ],
    edges: [
      { to: 'six-day-war', relation: 'successor_of' },
      { to: 'opec-oil-crisis', relation: 'caused' },
    ],
  },

  {
    id: 'opec-oil-crisis',
    name: 'The OPEC oil crisis',
    domain: 'history',
    approxYear: 1973,
    eras: ['coldwar'],
    summary:
      'In October 1973 Arab members of OPEC imposed an oil embargo on nations supporting Israel in the Yom Kippur War, causing oil prices to quadruple within months. Long petrol queues paralysed Western countries; the crisis exposed the industrialised world\'s dependence on cheap oil, accelerated inflation, and prompted the first serious investment in alternative energy.',
    wikipedia: 'https://en.wikipedia.org/wiki/1973_oil_crisis',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The 1973 OPEC oil embargo caused oil prices to roughly ____ within months.',
        answer: 'quadruple',
      },
      {
        format: 'contrast',
        prompt: 'Why did Arab OPEC members impose the 1973 oil embargo?',
        answer: 'To punish Western nations supporting Israel in the Yom Kippur War',
        distractors: [
          'To protest the continued occupation of Palestinian territory',
          'To force higher prices after a glut had depressed revenues',
          'In retaliation for US sanctions on Libya',
        ],
      },
    ],
    edges: [
      { to: 'yom-kippur-war', relation: 'caused' },
      { to: 'cold-war', relation: 'part_of' },
    ],
  },

  {
    id: 'chilean-coup-pinochet',
    name: 'The Chilean coup and Pinochet',
    domain: 'history',
    approxYear: 1973,
    eras: ['coldwar'],
    lat: -33.45,
    lng: -70.67,
    summary:
      'On 11 September 1973 a US-backed military coup led by General Augusto Pinochet overthrew Chile\'s democratically elected socialist president Salvador Allende, who died in the assault on the presidential palace. Pinochet ruled until 1990, during which time at least 3,000 people were killed and 40,000 tortured. His regime implemented radical free-market "Chicago Boys" economics alongside brutal repression.',
    wikipedia: 'https://en.wikipedia.org/wiki/1973_Chilean_coup_d%27%C3%A9tat',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'General Pinochet\'s 1973 coup overthrew Chile\'s elected president Salvador ____.',
        answer: 'Allende',
      },
      {
        format: 'contrast',
        prompt: 'Which economic model did Pinochet\'s regime impose on Chile?',
        answer: 'Radical free-market economics designed by "Chicago Boys"',
        distractors: [
          'Soviet-style state planning',
          'Import-substitution industrialisation',
          'A mixed economy similar to Sweden\'s',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'nicaraguan-revolution', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'nicaraguan-revolution',
    name: 'The Nicaraguan Revolution and Contras',
    domain: 'history',
    approxYear: 1979,
    eras: ['coldwar'],
    lat: 12.13,
    lng: -86.28,
    summary:
      'The Sandinista movement overthrew the Somoza dictatorship in Nicaragua in 1979 and implemented socialist reforms. The Reagan administration funded anti-Sandinista "Contra" rebels in defiance of Congress, leading to the Iran-Contra affair — a scandal in which the US secretly sold weapons to Iran and used the proceeds to fund the Contras, both actions illegal. The Sandinistas lost the 1990 election.',
    wikipedia: 'https://en.wikipedia.org/wiki/Nicaraguan_Revolution',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Reagan administration illegally funded anti-Sandinista rebels called the ____.',
        answer: 'Contras',
      },
      {
        format: 'contrast',
        prompt: 'What was the Iran-Contra affair?',
        answer: 'The US secretly sold weapons to Iran and used the proceeds to fund Nicaraguan Contras',
        distractors: [
          'A peace deal brokered between Iran and Nicaragua',
          'Iran supplying weapons to the Contras with US knowledge',
          'Congress authorising covert arms sales to both sides',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'chilean-coup-pinochet', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'soviet-invasion-afghanistan',
    name: 'The Soviet invasion of Afghanistan',
    domain: 'history',
    approxYear: 1979,
    eras: ['coldwar'],
    lat: 34.5,
    lng: 69.2,
    summary:
      'The Soviet Union invaded Afghanistan in December 1979 to prop up a communist government, beginning a nine-year war often called the USSR\'s Vietnam. The CIA armed and trained the Afghan mujahideen — including networks that later became al-Qaeda — through Operation Cyclone, one of its longest and costliest covert operations. Soviet forces withdrew in 1989, having lost roughly 15,000 soldiers.',
    wikipedia: 'https://en.wikipedia.org/wiki/Soviet%E2%80%93Afghan_War',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Soviet Union invaded ____ in 1979, beginning a nine-year war often called its Vietnam.',
        answer: 'Afghanistan',
      },
      {
        format: 'contrast',
        prompt: 'What did the CIA\'s Operation Cyclone do during the Soviet-Afghan War?',
        answer: 'Armed and funded Afghan mujahideen fighters against Soviet forces',
        distractors: [
          'Supplied chemical weapons to the Afghan government',
          'Trained Pakistani regular forces to fight alongside Afghans',
          'Funded a rival communist faction to destabilise the Soviets',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'september-11', relation: 'influenced_by' },
    ],
  },

  {
    id: 'iranian-revolution',
    name: 'The Iranian Revolution',
    domain: 'history',
    approxYear: 1979,
    eras: ['coldwar'],
    lat: 35.7,
    lng: 51.4,
    summary:
      'In 1979 popular protests overthrew Shah Mohammad Reza Pahlavi, a US-backed autocrat, and Ayatollah Ruhollah Khomeini returned from exile to lead the world\'s first modern Islamic republic. Iran switched from a Western ally to a revolutionary theocratic state committed to exporting Islam and opposing the United States. The revolution reshaped the geopolitics of the Middle East.',
    wikipedia: 'https://en.wikipedia.org/wiki/Iranian_Revolution',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The 1979 Iranian Revolution brought Ayatollah ____ to power.',
        answer: 'Khomeini',
      },
      {
        format: 'contrast',
        prompt: 'What type of government did Iran become after the 1979 revolution?',
        answer: 'A theocratic Islamic republic',
        distractors: [
          'A socialist republic allied with the USSR',
          'A constitutional monarchy',
          'A military dictatorship',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'iran-hostage-crisis', relation: 'caused' },
    ],
  },

  {
    id: 'iran-hostage-crisis',
    name: 'The Iran hostage crisis',
    domain: 'history',
    approxYear: 1980,
    eras: ['coldwar'],
    lat: 35.7,
    lng: 51.4,
    summary:
      'In November 1979 Iranian students stormed the US Embassy in Tehran and held 52 Americans hostage for 444 days. A rescue mission failed catastrophically in 1980, killing eight US servicemen. The crisis humiliated President Carter and contributed to his 1980 election defeat; the hostages were released minutes after Ronald Reagan\'s inauguration.',
    wikipedia: 'https://en.wikipedia.org/wiki/Iran_hostage_crisis',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Iran hostage crisis lasted ____ days, ending with the hostages\' release on Reagan\'s inauguration day.',
        answer: '444',
      },
      {
        format: 'contrast',
        prompt: 'What happened to the US rescue mission sent to free the Iran hostages in 1980?',
        answer: 'It failed — aircraft collided in the desert, killing eight servicemen',
        distractors: [
          'It was aborted when Iran threatened to execute hostages',
          'It succeeded in rescuing 30 hostages before being detected',
          'It was turned back by Iranian air defences',
        ],
      },
    ],
    edges: [
      { to: 'iranian-revolution', relation: 'caused' },
      { to: 'cold-war', relation: 'part_of' },
    ],
  },

  {
    id: 'solidarity-poland',
    name: 'Solidarity / Lech Wałęsa',
    domain: 'history',
    approxYear: 1980,
    eras: ['coldwar'],
    lat: 54.35,
    lng: 18.65,
    summary:
      'Solidarity (Solidarność) was the first independent trade union in the Soviet bloc, born from Gdańsk shipyard strikes in 1980 and led by electrician Lech Wałęsa. At its peak it had 10 million members — nearly a third of Poland\'s working population. Martial law crushed it in 1981 but it survived underground; by 1989 it had negotiated free elections and put a non-communist prime minister in power for the first time since WWII.',
    wikipedia: 'https://en.wikipedia.org/wiki/Solidarity_(Polish_trade_union)',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Solidarity was led by Lech ____, an electrician from the Gdańsk shipyards.',
        answer: 'Wałęsa',
      },
      {
        format: 'contrast',
        prompt: 'What was historically significant about Solidarity?',
        answer: 'It was the first independent trade union in the Soviet bloc, with 10 million members',
        distractors: [
          'It was the only trade union permitted in communist Poland',
          'It was founded by the Catholic Church to resist communism',
          'It was a secret organisation throughout its existence',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'fall-of-berlin-wall', relation: 'caused' },
    ],
  },

  // ── Détente and collapse ──────────────────────────────────────────────────

  {
    id: 'nixon-china',
    name: 'Nixon\'s visit to China',
    domain: 'history',
    approxYear: 1972,
    eras: ['coldwar'],
    lat: 39.9,
    lng: 116.4,
    summary:
      'In February 1972 President Richard Nixon made a historic visit to communist China, ending 23 years of US non-recognition and meeting Chairman Mao. The opening exploited the Sino-Soviet split, triangulating US foreign policy to gain leverage over both communist powers simultaneously. It was a bold move from an anti-communist president and transformed global geopolitics.',
    wikipedia: 'https://en.wikipedia.org/wiki/Nixon%27s_visit_to_China',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'President Nixon\'s 1972 visit to ____ ended 23 years of US non-recognition of the communist state.',
        answer: 'China',
      },
      {
        format: 'contrast',
        prompt: 'Nixon\'s China opening was strategically significant because it exploited what?',
        answer: 'The split between the Soviet Union and China',
        distractors: [
          'China\'s willingness to export goods to the US',
          'North Vietnam\'s dependence on Chinese weapons',
          'China\'s bid to join the United Nations',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'salt-treaties', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'salt-treaties',
    name: 'SALT treaties / arms control',
    domain: 'history',
    approxYear: 1972,
    eras: ['coldwar'],
    summary:
      'The Strategic Arms Limitation Talks (SALT I, 1972; SALT II, 1979) were the first US-Soviet agreements to cap nuclear arsenals — a landmark of Cold War détente. SALT I froze the number of ballistic missile launchers; SALT II was never ratified by the US Senate after the Soviet invasion of Afghanistan. They paved the way for deeper cuts under the later START treaties.',
    wikipedia: 'https://en.wikipedia.org/wiki/SALT_I',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The SALT I treaty of ____ was the first US-Soviet agreement to cap nuclear arsenals.',
        answer: '1972',
      },
      {
        format: 'contrast',
        prompt: 'Why was SALT II never ratified?',
        answer: 'The US Senate rejected it after the Soviet invasion of Afghanistan',
        distractors: [
          'The Soviet Union withdrew before signing',
          'Nixon\'s resignation left it unsigned',
          'Congress objected to missile verification procedures',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'nixon-china', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'helsinki-accords',
    name: 'The Helsinki Accords',
    domain: 'history',
    approxYear: 1975,
    eras: ['coldwar'],
    summary:
      'The Final Act of the 1975 Conference on Security and Cooperation in Europe, signed by 35 nations including the US and USSR. The West recognised Soviet-era borders in exchange for Soviet commitments on human rights — commitments Eastern bloc dissidents later used to hold their governments to account. Helsinki monitoring groups became the backbone of the democracy movements that ended communism.',
    wikipedia: 'https://en.wikipedia.org/wiki/Helsinki_Accords',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The 1975 Helsinki Accords traded Western recognition of Soviet borders for Soviet commitments on ____ rights.',
        answer: 'human',
      },
      {
        format: 'contrast',
        prompt: 'How did the Helsinki Accords unexpectedly undermine communist regimes?',
        answer: 'Dissidents used the human rights commitments to hold governments accountable',
        distractors: [
          'They required free elections within five years',
          'They opened Eastern bloc economies to Western investment',
          'They gave NATO the right to monitor Eastern European military activity',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'gorbachev-glasnost-perestroika', relation: 'influenced_by' },
    ],
  },

  {
    id: 'gorbachev-glasnost-perestroika',
    name: 'Gorbachev: glasnost and perestroika',
    domain: 'history',
    approxYear: 1986,
    eras: ['coldwar'],
    summary:
      'Mikhail Gorbachev became Soviet leader in 1985 and launched two linked reform programmes: glasnost (openness — allowing free speech and press criticism) and perestroika (restructuring — market-oriented economic reforms). Intended to revitalise the Soviet system, the reforms instead unleashed forces it could not control: nationalist movements, public exposure of past crimes, and the collapse of communist rule across Eastern Europe and then the USSR itself.',
    wikipedia: 'https://en.wikipedia.org/wiki/Mikhail_Gorbachev',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Gorbachev\'s reforms — glasnost (openness) and ____ (restructuring) — inadvertently helped end the Cold War.',
        answer: 'perestroika',
      },
      {
        format: 'contrast',
        prompt: 'What was the unintended consequence of Gorbachev\'s glasnost and perestroika?',
        answer: 'They unleashed nationalist movements and public criticism that collapsed the Soviet system',
        distractors: [
          'They strengthened hardliners who launched the 1991 coup attempt successfully',
          'They led to a Sino-Soviet reconciliation',
          'They caused hyperinflation that discredited reform',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'fall-of-soviet-union', relation: 'caused' },
    ],
  },

  {
    id: 'chernobyl-disaster',
    name: 'The Chernobyl disaster',
    domain: 'history',
    approxYear: 1986,
    eras: ['coldwar'],
    lat: 51.4,
    lng: 30.1,
    summary:
      'On 26 April 1986 reactor number 4 at the Chernobyl nuclear power plant in Soviet Ukraine exploded during a safety test, releasing radiation 400 times greater than the Hiroshima bomb. Gorbachev\'s delayed and dishonest initial response was a gift to glasnost critics; the disaster cost the Soviet Union an estimated $18 billion and became a metaphor for the system\'s terminal dysfunction.',
    wikipedia: 'https://en.wikipedia.org/wiki/Chernobyl_disaster',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The 1986 Chernobyl explosion released radiation roughly ____ times greater than the Hiroshima bomb.',
        answer: '400',
      },
      {
        format: 'contrast',
        prompt: 'In which Soviet republic was the Chernobyl nuclear plant located?',
        answer: 'Ukraine',
        distractors: ['Russia', 'Belarus', 'Kazakhstan'],
      },
    ],
    edges: [
      { to: 'gorbachev-glasnost-perestroika', relation: 'influenced_by' },
      { to: 'fall-of-soviet-union', relation: 'caused' },
    ],
  },

  {
    id: 'tiananmen-square-1989',
    name: 'Tiananmen Square 1989',
    domain: 'history',
    approxYear: 1989,
    eras: ['coldwar'],
    lat: 39.9,
    lng: 116.39,
    summary:
      'In April–June 1989 pro-democracy protesters, mostly students, occupied Tiananmen Square in Beijing and hundreds of other Chinese cities. On 4 June the Chinese government ordered the military to clear the square; estimates of the death toll range from several hundred to thousands. The "Tank Man" photograph — a lone individual blocking a column of tanks — became one of the most recognisable images of the 20th century.',
    wikipedia: 'https://en.wikipedia.org/wiki/1989_Tiananmen_Square_protests_and_massacre',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The iconic "Tank ____" photograph from the 1989 Tiananmen Square crackdown showed one man blocking a military column.',
        answer: 'Man',
      },
      {
        format: 'contrast',
        prompt: 'What were the Tiananmen Square protesters demanding in 1989?',
        answer: 'Democracy and political reform',
        distractors: [
          'Economic liberalisation and free trade',
          'Independence for Tibet',
          'The return of Hong Kong to China',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'contemporary_of' },
      { to: 'fall-of-berlin-wall', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'rwandan-genocide',
    name: 'The Rwandan Genocide',
    domain: 'history',
    approxYear: 1994,
    eras: ['postcoldwar'],
    lat: -1.95,
    lng: 30.06,
    summary:
      'Between April and July 1994, approximately 800,000 Tutsi people and moderate Hutu were killed in Rwanda in roughly 100 days — about 8,000 deaths per day — carried out mainly with machetes. The killings were planned and organised, incited in part by radio broadcasts. The international community, including the UN, refused to intervene; the genocide ended only when Tutsi rebel forces defeated the Hutu government.',
    wikipedia: 'https://en.wikipedia.org/wiki/Rwandan_genocide',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The 1994 Rwandan Genocide killed approximately ____ people in about 100 days.',
        answer: '800,000',
      },
      {
        format: 'contrast',
        prompt: 'How did the Rwandan Genocide end?',
        answer: 'Tutsi rebel forces (the RPF) defeated the Hutu government',
        distractors: [
          'A UN peacekeeping force intervened and imposed a ceasefire',
          'French troops stopped the killings after international pressure',
          'The Arusha peace accords were finally implemented',
        ],
      },
    ],
    edges: [
      { to: 'fall-of-soviet-union', relation: 'contemporary_of' },
      { to: 'united-nations', relation: 'influenced_by' },
    ],
  },

  {
    id: 'bosnian-war-srebrenica',
    name: 'The Bosnian War and Srebrenica',
    domain: 'history',
    approxYear: 1995,
    eras: ['postcoldwar'],
    lat: 44.1,
    lng: 17.9,
    summary:
      'The war in Bosnia-Herzegovina (1992–1995) saw Bosnian Serb forces, backed by Serbia, besiege Sarajevo for 1,425 days — the longest siege of a capital city in modern warfare — and carry out ethnic cleansing. At Srebrenica in July 1995, Serb forces murdered over 8,000 Bosniak Muslim men and boys in an act the International Court of Justice later ruled was genocide. The war ended with the Dayton Agreement.',
    wikipedia: 'https://en.wikipedia.org/wiki/Srebrenica_massacre',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'At Srebrenica in 1995, Bosnian Serb forces murdered over ____ Bosniak Muslim men and boys.',
        answer: '8,000',
      },
      {
        format: 'contrast',
        prompt: 'How long was the siege of Sarajevo during the Bosnian War?',
        answer: '1,425 days — the longest siege of a capital in modern warfare',
        distractors: ['90 days', '400 days', '250 days'],
      },
    ],
    edges: [
      { to: 'fall-of-soviet-union', relation: 'contemporary_of' },
      { to: 'united-nations', relation: 'influenced_by' },
    ],
  },

  {
    id: 'gulf-war-1991',
    name: 'The Gulf War 1991',
    domain: 'history',
    approxYear: 1991,
    eras: ['postcoldwar'],
    lat: 29.3,
    lng: 47.7,
    summary:
      'Iraq\'s Saddam Hussein invaded Kuwait in August 1990; a US-led coalition of 35 nations responded with Operation Desert Storm in January 1991, expelling Iraqi forces in 100 hours of ground combat. The war was the first major post-Cold War US military operation and demonstrated precision air power on television. Coalition forces stopped short of Baghdad, leaving Saddam in power — a decision debated for a decade before the 2003 Iraq War.',
    wikipedia: 'https://en.wikipedia.org/wiki/Gulf_War',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The 1991 Gulf War\'s ground campaign expelled Iraq from Kuwait in just ____ hours.',
        answer: '100',
      },
      {
        format: 'contrast',
        prompt: 'Why did the Gulf War coalition stop short of invading Iraq?',
        answer: 'The UN mandate covered only liberating Kuwait, not regime change in Baghdad',
        distractors: [
          'Saudi Arabia refused to allow an advance into Iraq',
          'Saddam Hussein agreed to dismantle his weapons programme',
          'Coalition forces ran out of fuel and supplies',
        ],
      },
    ],
    edges: [
      { to: 'fall-of-soviet-union', relation: 'contemporary_of' },
      { to: 'united-nations', relation: 'part_of' },
    ],
  },

  {
    id: 'oslo-accords',
    name: 'The Oslo Accords',
    domain: 'history',
    approxYear: 1993,
    eras: ['postcoldwar'],
    summary:
      'Secret negotiations in Oslo produced the 1993 Oslo I Accord — the first face-to-face peace agreement between Israel\'s government and the Palestine Liberation Organisation. Israel recognised the PLO; the PLO recognised Israel\'s right to exist. The accords established the Palestinian Authority and a framework for a two-state solution that was never completed; the peace process stalled and collapsed after the assassination of Israeli PM Yitzhak Rabin in 1995.',
    wikipedia: 'https://en.wikipedia.org/wiki/Oslo_Accords',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Oslo Accords were the first peace agreement between Israel and the ____ Liberation Organisation.',
        answer: 'Palestine',
      },
      {
        format: 'contrast',
        prompt: 'What ended the Oslo peace process most decisively?',
        answer: 'The assassination of Israeli PM Yitzhak Rabin in 1995',
        distractors: [
          'Yasser Arafat\'s rejection of the 2000 Camp David offer',
          'The outbreak of the first Intifada',
          'Hamas winning Palestinian elections in 2006',
        ],
      },
    ],
    edges: [
      { to: 'six-day-war', relation: 'influenced_by' },
      { to: 'fall-of-soviet-union', relation: 'contemporary_of' },
    ],
  },

  // ── Prague Spring (bonus Slovak-relevant concept) ─────────────────────────

  {
    id: 'prague-spring-1968',
    name: 'The Prague Spring 1968',
    domain: 'history',
    approxYear: 1968,
    eras: ['coldwar'],
    lat: 50.08,
    lng: 14.44,
    summary:
      'In early 1968 Czechoslovak Communist Party leader Alexander Dubček introduced "socialism with a human face" — liberalising censorship, rehabilitating political prisoners, and decentralising power. On the night of 20–21 August, Warsaw Pact forces invaded with 200,000 troops and 2,000 tanks. The Soviet crackdown was justified by the "Brezhnev Doctrine": the USSR reserved the right to intervene in any socialist state threatened by counterrevolution.',
    wikipedia: 'https://en.wikipedia.org/wiki/Prague_Spring',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Czechoslovak reformer Alexander Dubček called his 1968 programme "socialism with a human ____".',
        answer: 'face',
      },
      {
        format: 'contrast',
        prompt: 'What was the "Brezhnev Doctrine" used to justify?',
        answer: 'Soviet military intervention in any socialist state facing counterrevolution',
        distractors: [
          'Economic aid to struggling Warsaw Pact states',
          'Nuclear parity negotiations with the United States',
          'The Soviet right to station troops in Eastern Europe permanently',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'warsaw-pact', relation: 'influenced_by' },
      { to: 'velvet-revolution', relation: 'influenced_by' },
    ],
  },
]
