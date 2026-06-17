import type { BankConcept } from '../types'

// Slovak and Central-European history.
// Covers the continuous thread from the first Slavic state through to EU accession.
// Concepts here are designed to slot into the "Slovakia through the centuries" thread,
// with edges that wire them into the wider world-history graph.

export const SLOVAK: BankConcept[] = [
  {
    id: 'cyril-methodius',
    name: 'Cyril and Methodius',
    domain: 'culture',
    approxYear: 863,
    eras: ['medieval'],
    lat: 48.6,
    lng: 17.8,
    summary:
      'Two Byzantine brothers sent as missionaries to Great Moravia in 863 CE. Cyril devised the Glagolitic alphabet - the first script designed for a Slavic language - and translated the Gospels into Old Church Slavonic. Their work gave Slavic peoples a written language and a liturgy in their own tongue for the first time.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cyril_and_Methodius',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cyril_and_Methodius2.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Cyril and Methodius arrived in Great Moravia in the year ____.',
        answer: '863',
      },
      {
        format: 'cloze',
        prompt: 'Cyril created the ____ alphabet, the first script for a Slavic language.',
        answer: 'Glagolitic',
      },
      {
        format: 'contrast',
        prompt: 'Why were Cyril and Methodius historically significant for Slavic peoples?',
        answer: 'They created the first Slavic alphabet and translated scripture into Slavic',
        distractors: [
          'They converted the Magyars to Christianity',
          'They founded the city of Bratislava',
          'They united the Slavic tribes under one ruler',
        ],
      },
    ],
    edges: [
      { to: 'great-moravia', relation: 'part_of' },
    ],
  },
  {
    id: 'great-moravia',
    name: 'Great Moravia',
    domain: 'history',
    approxYear: 885,
    eras: ['medieval'],
    lat: 48.9,
    lng: 17.1,
    summary:
      'The first major Slavic state in Central Europe, which flourished in the 9th century across what is now Moravia and western Slovakia. Prince Rastislav invited Byzantine missionaries Cyril and Methodius in 863 to counter Frankish influence. At its height under Svätopluk I the realm stretched from Bohemia to the Pannonian plain. Magyar invasions destroyed it around 907.',
    wikipedia: 'https://en.wikipedia.org/wiki/Great_Moravia',
    questions: [
      {
        format: 'cloze',
        prompt: 'The first major Slavic state in Central Europe was called Great ____.',
        answer: 'Moravia',
      },
      {
        format: 'contrast',
        prompt: 'What ended Great Moravia around 907 CE?',
        answer: 'Magyar invasions',
        distractors: [
          'A Frankish military campaign',
          'A Byzantine conquest',
          'Internal civil war between princes',
        ],
      },
    ],
    edges: [
      { to: 'cyril-methodius', relation: 'caused' },
      { to: 'kingdom-of-hungary', relation: 'successor_of' },
    ],
  },
  {
    id: 'kingdom-of-hungary',
    name: 'The Kingdom of Hungary',
    domain: 'history',
    approxYear: 1000,
    eras: ['medieval', 'renaissance', 'enlightenment', 'long19c'],
    lat: 47.5,
    lng: 19.0,
    summary:
      'Founded by Stephen I in the year 1000 CE, Hungary became one of the great medieval kingdoms of Europe. The Slovak lands - called Upper Hungary - formed its northern heartland for nearly 900 years. After the Ottomans captured Buda in 1541, Bratislava (then Pozsony) served as Hungary\'s capital and coronation city for almost 250 years.',
    wikipedia: 'https://en.wikipedia.org/wiki/Kingdom_of_Hungary',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Kingdom of Hungary was founded by Stephen I in the year ____.',
        answer: '1000',
      },
      {
        format: 'cloze',
        prompt: 'After the Ottomans captured Buda, ____ became Hungary\'s capital for nearly 250 years.',
        answer: 'Bratislava',
      },
      {
        format: 'contrast',
        prompt: 'How long did the Slovak lands remain part of the Kingdom of Hungary?',
        answer: 'Nearly 900 years',
        distractors: ['About 200 years', 'Around 400 years', 'About 100 years'],
      },
    ],
    edges: [
      { to: 'great-moravia', relation: 'successor_of' },
      { to: 'habsburg-monarchy', relation: 'successor_of' },
    ],
  },
  {
    id: 'habsburg-monarchy',
    name: 'The Habsburg Monarchy',
    domain: 'history',
    approxYear: 1526,
    eras: ['renaissance', 'enlightenment'],
    lat: 48.2,
    lng: 16.37,
    summary:
      'After the Ottoman victory at the Battle of Mohacs in 1526, the Habsburg dynasty of Vienna inherited the Hungarian crown and with it the Slovak lands. The Habsburgs ruled a vast multi-ethnic empire from Austria for nearly four centuries, shaping the culture, architecture, and bureaucracy of Central Europe. Their capital was Vienna; their court language German; their religion Catholic.',
    wikipedia: 'https://en.wikipedia.org/wiki/Habsburg_Monarchy',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Habsburg dynasty took over Hungary after the Ottoman victory at the Battle of ____.',
        answer: 'Mohacs',
        chipDistractors: ['Vienna', 'Buda', 'Prague'],
      },
      {
        format: 'contrast',
        prompt: 'After 1526, from which city did the Habsburg dynasty rule its Central European empire?',
        answer: 'Vienna',
        distractors: ['Bratislava', 'Budapest', 'Prague'],
      },
    ],
    edges: [
      { to: 'kingdom-of-hungary', relation: 'successor_of' },
      { to: 'austria-hungary', relation: 'successor_of' },
    ],
  },
  {
    id: 'ludovit-stur',
    name: 'Ľudovít Štúr and the Slovak Awakening',
    domain: 'culture',
    approxYear: 1843,
    eras: ['long19c'],
    lat: 48.6,
    lng: 19.1,
    summary:
      'Ľudovít Štúr (1815-1856) was a Slovak writer, linguist, and politician who codified the modern Slovak literary language in 1843, choosing Central Slovak dialects as the standard. His act gave Slovaks a distinct written identity separate from both Czech and Hungarian at a time when Hungary was pressing for Magyarization - making Hungarian the language of schools, law, and public life. He led Slovak volunteers in the 1848 revolution.',
    wikipedia: 'https://en.wikipedia.org/wiki/%C4%BDudov%C3%ADt_%C5%A0t%C3%BAr',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ludovit_Stur.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: '____ Štúr codified the modern Slovak literary language in 1843.',
        answer: 'Ľudovít',
        chipDistractors: ['Ján', 'Milan', 'Pavel'],
      },
      {
        format: 'contrast',
        prompt: 'Why was Štúr\'s standardisation of Slovak particularly important in the 1840s?',
        answer: 'Hungary was imposing Hungarian as the mandatory language of public life',
        distractors: [
          'Austrian law banned Slavic languages in schools',
          'Czech had already absorbed Slovak dialects',
          'The Catholic Church required Latin in all services',
        ],
      },
    ],
    edges: [
      { to: 'austria-hungary', relation: 'influenced_by' },
      { to: 'habsburg-monarchy', relation: 'part_of' },
    ],
  },
  {
    id: 'austria-hungary',
    name: 'Austria-Hungary',
    domain: 'history',
    approxYear: 1867,
    eras: ['long19c', 'worldwars'],
    lat: 47.8,
    lng: 16.5,
    summary:
      'The Compromise (Ausgleich) of 1867 split the Habsburg Empire into two halves: Austria and Hungary, each governing its own half. Slovak lands fell under Hungarian rule, which pursued aggressive Magyarization - closing Slovak schools, banning Slovak in official life, and pressuring assimilation. This intensified Slovak national consciousness and made Slovaks receptive to the idea of a common state with the Czechs after the empire collapsed in 1918.',
    wikipedia: 'https://en.wikipedia.org/wiki/Austria-Hungary',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Austria-Hungary_in_1914.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The 1867 Compromise (Ausgleich) divided the Habsburg Empire into Austria and ____.',
        answer: 'Hungary',
      },
      {
        format: 'contrast',
        prompt: 'What was Magyarization, as practiced in Austria-Hungary?',
        answer: 'A Hungarian policy of forcing non-Hungarian peoples to adopt Hungarian language and culture',
        distractors: [
          'A military campaign against the Ottoman Empire',
          'A land reform that redistributed estate land to peasants',
          'A railway-building programme linking Budapest to Vienna',
        ],
      },
    ],
    edges: [
      { to: 'habsburg-monarchy', relation: 'successor_of' },
      { to: 'czechoslovakia-1918', relation: 'caused' },
      { to: 'wwi-trigger', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'czechoslovakia-1918',
    name: 'Czechoslovakia 1918',
    domain: 'history',
    approxYear: 1918,
    eras: ['worldwars'],
    lat: 49.8,
    lng: 15.5,
    summary:
      'On 28 October 1918, as the Austro-Hungarian Empire collapsed at the end of World War I, Czechoslovakia was declared an independent republic. It united Czechs and Slovaks into one state with Tomáš Garrigue Masaryk as its first president. The Pittsburgh Agreement had promised Slovakia autonomy, though this was only partially fulfilled. It was one of the few Central European democracies to survive intact until the late 1930s.',
    wikipedia: 'https://en.wikipedia.org/wiki/Czechoslovakia',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Masaryk_1918.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'Czechoslovakia was declared independent on 28 October ____.',
        answer: '1918',
      },
      {
        format: 'cloze',
        prompt: 'The first president of Czechoslovakia was Tomáš Garrigue ____.',
        answer: 'Masaryk',
        chipDistractors: ['Havel', 'Benes', 'Dubcek'],
      },
      {
        format: 'contrast',
        prompt: 'Why did Czechs and Slovaks unite to form Czechoslovakia in 1918?',
        answer: 'The collapse of Austria-Hungary at the end of World War I created the opportunity',
        distractors: [
          'A pan-Slavic congress voted for unification in 1917',
          'The League of Nations mandated the union',
          'They had been a united kingdom before Habsburg rule',
        ],
      },
    ],
    edges: [
      { to: 'austria-hungary', relation: 'successor_of' },
      { to: 'wwi-trigger', relation: 'successor_of' },
      { to: 'slovak-national-uprising', relation: 'caused' },
      { to: 'velvet-revolution', relation: 'part_of' },
    ],
  },
  {
    id: 'slovak-national-uprising',
    name: 'The Slovak National Uprising',
    domain: 'history',
    approxYear: 1944,
    eras: ['worldwars'],
    lat: 48.74,
    lng: 19.15,
    summary:
      'On 29 August 1944, the Slovak National Uprising (Slovenské národné povstanie, SNP) broke out in Banská Bystrica against the Nazi-aligned Slovak puppet state. At its peak about 80,000 fighters held a large chunk of central Slovakia. German forces crushed it after two months. It remains the founding act of Slovak anti-fascist resistance and is commemorated as a national holiday on 29 August.',
    wikipedia: 'https://en.wikipedia.org/wiki/Slovak_National_Uprising',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Slovak National Uprising of 1944 is abbreviated in Slovak as ____.',
        answer: 'SNP',
        chipDistractors: ['SNA', 'SNS', 'SNR'],
      },
      {
        format: 'cloze',
        prompt: 'The Slovak National Uprising began in the city of Banská ____.',
        answer: 'Bystrica',
      },
      {
        format: 'contrast',
        prompt: 'Against whom was the 1944 Slovak National Uprising directed?',
        answer: 'The Nazi-aligned Slovak puppet state and German occupation',
        distractors: [
          'Soviet forces crossing into Slovakia from the east',
          'Hungarian claims on Slovak territory',
          'Czech centralism within Czechoslovakia',
        ],
      },
    ],
    edges: [
      { to: 'world-war-two', relation: 'part_of' },
      { to: 'czechoslovakia-1918', relation: 'part_of' },
    ],
  },
  {
    id: 'prague-spring',
    name: 'The Prague Spring',
    domain: 'history',
    approxYear: 1968,
    eras: ['coldwar'],
    lat: 50.08,
    lng: 14.44,
    summary:
      'In January 1968 the Slovak communist reformer Alexander Dubček became leader of Czechoslovakia and launched a period of liberalisation he called "socialism with a human face" - lifting censorship, allowing political debate, and promising federal equality for Slovakia. On the night of 20-21 August 1968 the Soviet Union and Warsaw Pact allies sent 200,000 troops to crush the reforms. The invasion ended the thaw and ushered in 20 years of "normalisation".',
    wikipedia: 'https://en.wikipedia.org/wiki/Prague_Spring',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bundesarchiv_Bild_183-H0918-0500-014,_Prag,_Panzer_der_NVA.jpg?width=300',
    questions: [
      {
        format: 'cloze',
        prompt: 'The 1968 reforms in Czechoslovakia were led by Alexander ____, a Slovak communist.',
        answer: 'Dubček',
        chipDistractors: ['Havel', 'Masaryk', 'Husák'],
      },
      {
        format: 'cloze',
        prompt: 'Dubček described his 1968 programme as "socialism with a human ____".',
        answer: 'face',
      },
      {
        format: 'contrast',
        prompt: 'What happened to the Prague Spring reforms in August 1968?',
        answer: 'Soviet-led Warsaw Pact troops invaded and crushed them',
        distractors: [
          'A referendum rejected the reforms as too radical',
          'Dubček resigned and reversed the liberalisation himself',
          'NATO intervened militarily to protect Czechoslovak sovereignty',
        ],
      },
    ],
    edges: [
      { to: 'cold-war', relation: 'part_of' },
      { to: 'velvet-revolution', relation: 'caused' },
      { to: 'fall-of-soviet-union', relation: 'influenced_by' },
    ],
  },
]
