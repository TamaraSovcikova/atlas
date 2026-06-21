import type { BankConcept } from '../types'

export const MEDIEVAL_EXPANDED: BankConcept[] = [
  // ── Early Islamic World ────────────────────────────────────────────────────
  {
    id: 'muhammad-life-hijra',
    name: 'Muhammad and the Hijra',
    domain: 'history',
    approxYear: 622,
    eras: ['medieval'],
    summary:
      'The Prophet Muhammad founded Islam in early-seventh-century Arabia, preaching monotheism in Mecca before hostility forced his emigration — the Hijra — to Medina in 622 CE, a journey that marks year one of the Islamic calendar. In Medina he built the first Muslim community-state and returned to Mecca in 630, unifying most of Arabia under Islam before his death in 632.',
    wikipedia: 'https://en.wikipedia.org/wiki/Muhammad',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "Muhammad's emigration from Mecca to Medina in 622 CE is called the ____.",
        answer: 'Hijra',
      },
      {
        format: 'contrast',
        prompt: 'What year does the Islamic calendar count from?',
        answer: '622 CE',
        distractors: ['570 CE', '610 CE', '632 CE'],
      },
    ],
    edges: [
      { to: 'islam-core', relation: 'part_of' },
      { to: 'rashidun-caliphate', relation: 'caused' },
    ],
  },
  {
    id: 'rashidun-caliphate',
    name: 'Rashidun Caliphate',
    domain: 'history',
    approxYear: 632,
    eras: ['medieval'],
    summary:
      "The first caliphate (632–661 CE), led by Abu Bakr, Umar, Uthman, and Ali — the four \"Rightly Guided\" caliphs — expanded Islam with astonishing speed from Arabia into Persia, the Levant, and Egypt within a single generation. Its collapse into civil war (the First Fitna) over Ali's succession permanently split Islam into Sunni and Shia branches.",
    wikipedia: 'https://en.wikipedia.org/wiki/Rashidun_Caliphate',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The four leaders of the Rashidun Caliphate are called the ____ caliphs.',
        answer: 'Rightly Guided',
      },
      {
        format: 'contrast',
        prompt: 'What conflict over succession ended the Rashidun Caliphate?',
        answer: 'The First Fitna',
        distractors: ['The Battle of Tours', 'The Ridda Wars', 'The Abbasid Revolution'],
      },
    ],
    edges: [
      { to: 'muhammad-life-hijra', relation: 'influenced_by' },
      { to: 'umayyad-caliphate', relation: 'caused' },
      { to: 'islam-core', relation: 'part_of' },
    ],
  },
  {
    id: 'umayyad-caliphate',
    name: 'Umayyad Caliphate',
    domain: 'history',
    approxYear: 661,
    eras: ['medieval'],
    summary:
      'The Umayyad dynasty (661–750 CE) ruled the largest contiguous empire yet seen, stretching from Spain to Central Asia, and made Arabic the language of administration across its vast territories. Their rule ended when the Abbasid Revolution overthrew them in 750; a surviving prince founded a rival emirate in Córdoba, keeping the Umayyad line alive in Iberia until 1031.',
    wikipedia: 'https://en.wikipedia.org/wiki/Umayyad_Caliphate',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Umayyad Caliphate stretched from ____ in the west to Central Asia in the east.',
        answer: 'Spain',
      },
      {
        format: 'contrast',
        prompt: 'Which dynasty overthrew the Umayyads in 750 CE?',
        answer: 'Abbasids',
        distractors: ['Fatimids', 'Seljuks', 'Buyids'],
      },
    ],
    edges: [
      { to: 'rashidun-caliphate', relation: 'influenced_by' },
      { to: 'abbasid-caliphate', relation: 'caused' },
      { to: 'battle-of-tours', relation: 'influenced_by' },
    ],
  },
  {
    id: 'abbasid-caliphate',
    name: 'Abbasid Caliphate',
    domain: 'history',
    approxYear: 750,
    eras: ['medieval'],
    summary:
      'The Abbasid caliphate (750–1258 CE) moved the Islamic capital to Baghdad and presided over the Islamic Golden Age, patronising science, philosophy, and medicine on a scale unmatched anywhere in the medieval world. Mongol armies under Hulagu Khan destroyed Baghdad in 1258, ending Abbasid power in the east, though a shadow caliphate survived in Cairo until 1517.',
    wikipedia: 'https://en.wikipedia.org/wiki/Abbasid_Caliphate',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Abbasids moved the Islamic capital to ____, which became the largest city in the world.',
        answer: 'Baghdad',
      },
      {
        format: 'contrast',
        prompt: 'Who destroyed the Abbasid capital in 1258?',
        answer: 'Mongols under Hulagu Khan',
        distractors: ['Crusaders', 'Byzantine army', 'Seljuk Turks'],
      },
    ],
    edges: [
      { to: 'umayyad-caliphate', relation: 'influenced_by' },
      { to: 'islamic-golden-age', relation: 'part_of' },
      { to: 'mongol-sack-of-baghdad', relation: 'influenced_by' },
    ],
  },
  {
    id: 'battle-of-tours',
    name: 'Battle of Tours (Poitiers)',
    domain: 'history',
    approxYear: 732,
    eras: ['medieval'],
    summary:
      'In October 732 CE, the Frankish mayor of the palace Charles Martel defeated an Umayyad raiding force near Tours in modern France, halting the northernmost Muslim advance into Western Europe. Later chroniclers cast it as the decisive battle that "saved Christianity," though historians debate whether a longer-term occupation was ever intended.',
    wikipedia: 'https://en.wikipedia.org/wiki/Battle_of_Tours',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Charles ____ defeated an Umayyad force near Tours in 732, stopping the Muslim advance into Western Europe.',
        answer: 'Martel',
      },
      {
        format: 'contrast',
        prompt: 'In which modern country did the Battle of Tours take place?',
        answer: 'France',
        distractors: ['Spain', 'Italy', 'Germany'],
      },
    ],
    edges: [
      { to: 'umayyad-caliphate', relation: 'opposed' },
      { to: 'charlemagne', relation: 'caused' },
    ],
  },
  {
    id: 'al-khwarizmi',
    name: 'Al-Khwarizmi and Algebra',
    domain: 'history',
    approxYear: 830,
    eras: ['medieval'],
    summary:
      'Muhammad ibn Musa al-Khwarizmi, a ninth-century Baghdad mathematician, wrote the foundational treatise on solving linear and quadratic equations, whose Arabic title — "Al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala" — gave mathematics the word "algebra." His name also gave us the word "algorithm," cementing his place as a founder of modern mathematics.',
    wikipedia: 'https://en.wikipedia.org/wiki/Muhammad_ibn_Musa_al-Khwarizmi',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The word "algebra" comes from al-Khwarizmi\'s Arabic treatise title containing the term ____.',
        answer: 'al-jabr',
      },
      {
        format: 'contrast',
        prompt: "Which word in modern mathematics also derives from al-Khwarizmi's name?",
        answer: 'algorithm',
        distractors: ['arithmetic', 'logarithm', 'calculus'],
      },
    ],
    edges: [
      { to: 'islamic-golden-age', relation: 'part_of' },
      { to: 'abbasid-caliphate', relation: 'influenced_by' },
    ],
  },
  {
    id: 'ibn-rushd-averroes',
    name: 'Ibn Rushd (Averroes)',
    domain: 'history',
    approxYear: 1180,
    eras: ['medieval'],
    summary:
      'Ibn Rushd (1126–1198), known in Latin as Averroes, was an Andalusian philosopher whose detailed commentaries on Aristotle transmitted Greek philosophy to medieval Europe and ignited the scholastic debates known as Averroism. His insistence on reason as an independent path to truth influenced Thomas Aquinas and shaped the intellectual foundations of the Western university.',
    wikipedia: 'https://en.wikipedia.org/wiki/Averroes',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "Ibn Rushd's Latin name is ____.",
        answer: 'Averroes',
      },
      {
        format: 'contrast',
        prompt: 'What ancient philosopher did Ibn Rushd primarily comment on?',
        answer: 'Aristotle',
        distractors: ['Plato', 'Socrates', 'Pythagoras'],
      },
    ],
    edges: [
      { to: 'islamic-golden-age', relation: 'part_of' },
      { to: 'thomas-aquinas', relation: 'influenced_by' },
      { to: 'scholasticism', relation: 'influenced_by' },
    ],
  },
  {
    id: 'ibn-sina-avicenna',
    name: 'Ibn Sina (Avicenna)',
    domain: 'history',
    approxYear: 1020,
    eras: ['medieval'],
    summary:
      'Ibn Sina (980–1037 CE), called Avicenna in Latin, was a Persian polymath whose encyclopaedic "Canon of Medicine" became the standard medical textbook in European universities for six centuries. He wrote over 400 works on philosophy, astronomy, and medicine, reconciling Aristotelian logic with Islamic theology in ways that influenced thinkers across continents.',
    wikipedia: 'https://en.wikipedia.org/wiki/Avicenna',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "Ibn Sina's \"Canon of Medicine\" remained a standard European university textbook for roughly ____ centuries.",
        answer: 'six',
      },
      {
        format: 'contrast',
        prompt: 'In which century did Ibn Sina (Avicenna) live?',
        answer: '10th–11th century',
        distractors: ['8th–9th century', '12th–13th century', '13th–14th century'],
      },
    ],
    edges: [
      { to: 'islamic-golden-age', relation: 'part_of' },
      { to: 'medieval-universities', relation: 'influenced_by' },
    ],
  },
  {
    id: 'mansa-musa-mali',
    name: 'Mansa Musa and the Mali Empire',
    domain: 'history',
    approxYear: 1324,
    eras: ['medieval'],
    summary:
      'Mansa Musa I, emperor of Mali (r. 1312–1337), ruled the wealthiest state in the world on the back of Saharan gold and salt trade, and his 1324 pilgrimage to Mecca — with a retinue of 60,000 and tonnes of gold — crashed commodity prices across the Mediterranean for a decade. Timbuktu under his patronage became a major centre of Islamic scholarship and trade.',
    wikipedia: 'https://en.wikipedia.org/wiki/Mansa_Musa',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "Mansa Musa's 1324 pilgrimage to Mecca caused a prolonged drop in ____ prices across the Mediterranean.",
        answer: 'gold',
      },
      {
        format: 'contrast',
        prompt: 'Which city flourished as a centre of Islamic scholarship under Mansa Musa?',
        answer: 'Timbuktu',
        distractors: ['Dakar', 'Cairo', 'Kano'],
      },
    ],
    edges: [
      { to: 'trans-saharan-trade', relation: 'influenced_by' },
      { to: 'islam-core', relation: 'influenced_by' },
    ],
  },
  {
    id: 'trans-saharan-trade',
    name: 'Trans-Saharan Trade',
    domain: 'history',
    approxYear: 800,
    eras: ['medieval'],
    summary:
      'From roughly the 8th to 16th centuries, camel caravans crossed the Sahara carrying gold and enslaved people northward and salt southward, linking sub-Saharan West Africa to Mediterranean markets and fuelling the rise of the Mali and Songhai empires. Control of these routes — especially the Taghaza salt mines and the Bambuk goldfields — determined which rulers grew powerful enough to survive.',
    wikipedia: 'https://en.wikipedia.org/wiki/Trans-Saharan_trade',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Trans-Saharan caravans carried ____ and enslaved people northward and salt southward.',
        answer: 'gold',
      },
      {
        format: 'contrast',
        prompt: 'Which animal made large-scale trans-Saharan caravans practical?',
        answer: 'Camel',
        distractors: ['Horse', 'Donkey', 'Ox'],
      },
    ],
    edges: [
      { to: 'mansa-musa-mali', relation: 'influenced_by' },
      { to: 'islamic-golden-age', relation: 'influenced_by' },
    ],
  },

  // ── Byzantine Continuation ─────────────────────────────────────────────────
  {
    id: 'byzantine-iconoclasm',
    name: 'Byzantine Iconoclasm',
    domain: 'history',
    approxYear: 730,
    eras: ['medieval'],
    summary:
      'Byzantine Iconoclasm (726–843 CE) was a state-enforced ban on religious images ordered by Emperor Leo III, who considered icon veneration idolatry; it triggered fierce resistance from monks, Pope Gregory III, and eventually the Empress Irene, who restored icons in 787. The controversy deepened the rift between Rome and Constantinople and foreshadowed the Great Schism of 1054.',
    wikipedia: 'https://en.wikipedia.org/wiki/Byzantine_Iconoclasm',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Byzantine Iconoclasm was first ordered by Emperor ____ in 726 CE.',
        answer: 'Leo III',
      },
      {
        format: 'contrast',
        prompt: 'What was restored at the Second Council of Nicaea in 787?',
        answer: 'Veneration of icons',
        distractors: ['Papal supremacy', 'Use of Greek in liturgy', 'The Nicene Creed'],
      },
    ],
    edges: [
      { to: 'byzantine-empire', relation: 'part_of' },
      { to: 'byzantine-art-mosaics', relation: 'influenced_by' },
    ],
  },
  {
    id: 'battle-of-manzikert',
    name: 'Battle of Manzikert',
    domain: 'history',
    approxYear: 1071,
    eras: ['medieval'],
    summary:
      'At Manzikert in 1071, Seljuk Turks under Alp Arslan crushed the Byzantine army and captured Emperor Romanos IV, opening Anatolia — Byzantium\'s heartland and main source of soldiers — to Turkish settlement in a way never reversed. The disaster prompted the Byzantine emperor to appeal to Pope Urban II, whose response two decades later was the First Crusade.',
    wikipedia: 'https://en.wikipedia.org/wiki/Battle_of_Manzikert',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Battle of Manzikert in 1071 opened ____ to Seljuk Turkish settlement.',
        answer: 'Anatolia',
      },
      {
        format: 'contrast',
        prompt: 'Who captured Emperor Romanos IV at Manzikert?',
        answer: 'Alp Arslan',
        distractors: ['Saladin', 'Osman I', 'Timur'],
      },
    ],
    edges: [
      { to: 'byzantine-empire', relation: 'part_of' },
      { to: 'alexios-komnenos', relation: 'caused' },
      { to: 'crusades-overview', relation: 'influenced_by' },
    ],
  },
  {
    id: 'alexios-komnenos',
    name: 'Alexios I Komnenos',
    domain: 'history',
    approxYear: 1095,
    eras: ['medieval'],
    summary:
      'Alexios I Komnenos (r. 1081–1118) rescued a collapsing Byzantine Empire through shrewd diplomacy and military reform, retaking key cities and stabilising finances after the catastrophe at Manzikert. His appeal to Pope Urban II for mercenary help against the Seljuks in 1095 unexpectedly triggered the First Crusade — an outcome far larger and less controllable than he had wanted.',
    wikipedia: 'https://en.wikipedia.org/wiki/Alexios_I_Komnenos',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "Alexios I's appeal to Pope Urban II for military help in 1095 unintentionally triggered the First ____.",
        answer: 'Crusade',
      },
      {
        format: 'contrast',
        prompt: 'Which military threat prompted Alexios I to seek western help?',
        answer: 'Seljuk Turks',
        distractors: ['Normans', 'Mongols', 'Arabs'],
      },
    ],
    edges: [
      { to: 'byzantine-empire', relation: 'part_of' },
      { to: 'battle-of-manzikert', relation: 'influenced_by' },
      { to: 'first-crusade', relation: 'influenced_by' },
    ],
  },
  {
    id: 'greek-fire',
    name: 'Greek Fire',
    domain: 'history',
    approxYear: 672,
    eras: ['medieval'],
    summary:
      'Greek fire was a Byzantine incendiary weapon — a liquid that ignited on contact with water and could not be extinguished — deployed devastatingly against Arab naval assaults on Constantinople in 672–678 and 717–718, helping preserve the empire for centuries. Its precise formula was a state secret so closely guarded that it has never been definitively recovered by historians.',
    wikipedia: 'https://en.wikipedia.org/wiki/Greek_fire',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Greek fire was notable for igniting on contact with ____, making it impossible to extinguish with water.',
        answer: 'water',
      },
      {
        format: 'contrast',
        prompt: 'Against which attackers did Byzantine ships first deploy Greek fire in 672–678 CE?',
        answer: 'Arab fleets',
        distractors: ['Viking raiders', 'Mongol cavalry', 'Norman ships'],
      },
    ],
    edges: [
      { to: 'byzantine-empire', relation: 'part_of' },
    ],
  },
  {
    id: 'byzantine-art-mosaics',
    name: 'Byzantine Art and Mosaics',
    domain: 'history',
    approxYear: 537,
    eras: ['medieval'],
    summary:
      'Byzantine art, centred on the golden-ground mosaic, icons, and illuminated manuscripts, expressed theological truth rather than naturalistic beauty — figures float frontally in timeless gold space, their elongated forms signalling spiritual rather than bodily reality. The Hagia Sophia and Ravenna\'s San Vitale preserve the most spectacular surviving mosaics, influencing Orthodox Christian art to the present day.',
    wikipedia: 'https://en.wikipedia.org/wiki/Byzantine_art',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Byzantine mosaics typically set figures against a background of ____ to suggest divine light.',
        answer: 'gold',
      },
      {
        format: 'contrast',
        prompt: 'Which building contains the most celebrated early Byzantine mosaics outside Constantinople?',
        answer: 'San Vitale, Ravenna',
        distractors: ['St Mark\'s Basilica, Venice', 'Cluny Abbey', 'Westminster Abbey'],
      },
    ],
    edges: [
      { to: 'byzantine-empire', relation: 'part_of' },
      { to: 'byzantine-iconoclasm', relation: 'influenced_by' },
    ],
  },

  // ── Vikings and Norse ──────────────────────────────────────────────────────
  {
    id: 'viking-age',
    name: 'The Viking Age',
    domain: 'history',
    approxYear: 793,
    eras: ['medieval'],
    summary:
      'The Viking Age (c. 793–1066 CE) opened dramatically with the Norse raid on Lindisfarne monastery and saw Scandinavian warriors, traders, and settlers spread across Europe, the North Atlantic, and into the Middle East via Russian river routes. Driven by population pressure, superior ship design, and the lure of plunder and trade, Vikings permanently altered the political map of England, France, Ireland, and Russia.',
    wikipedia: 'https://en.wikipedia.org/wiki/Viking_Age',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Viking Age is traditionally dated as beginning with the raid on ____ monastery in 793 CE.',
        answer: 'Lindisfarne',
      },
      {
        format: 'contrast',
        prompt: 'What technological advantage allowed Vikings to raid coastal and river settlements so effectively?',
        answer: 'Longship design',
        distractors: ['Iron stirrups', 'Plate armour', 'Crossbows'],
      },
    ],
    edges: [
      { to: 'leif-eriksson-vinland', relation: 'influenced_by' },
      { to: 'normandy-founding', relation: 'influenced_by' },
      { to: 'rus-origin', relation: 'influenced_by' },
      { to: 'varangian-guard', relation: 'influenced_by' },
    ],
  },
  {
    id: 'leif-eriksson-vinland',
    name: 'Leif Eriksson and Vinland',
    domain: 'history',
    approxYear: 1000,
    eras: ['medieval'],
    summary:
      'Around 1000 CE, Norse explorer Leif Eriksson sailed from Greenland to a land he called Vinland — almost certainly the northern tip of Newfoundland — establishing the first confirmed European contact with the Americas, five centuries before Columbus. Archaeological excavations at L\'Anse aux Meadows, Newfoundland, confirmed the Norse settlement in the 1960s.',
    wikipedia: 'https://en.wikipedia.org/wiki/Leif_Erikson',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "The Norse settlement in the Americas was confirmed by excavations at L'Anse aux ____, Newfoundland.",
        answer: 'Meadows',
      },
      {
        format: 'contrast',
        prompt: 'By how many years did Leif Eriksson reach the Americas before Columbus?',
        answer: 'About 500 years',
        distractors: ['About 100 years', 'About 200 years', 'About 50 years'],
      },
    ],
    edges: [
      { to: 'viking-age', relation: 'part_of' },
    ],
  },
  {
    id: 'varangian-guard',
    name: 'The Varangian Guard',
    domain: 'history',
    approxYear: 988,
    eras: ['medieval'],
    summary:
      'The Varangian Guard was an elite Byzantine military unit composed primarily of Norsemen and later Anglo-Saxons, formed around 988 CE when Vladimir of Kyiv sent 6,000 warriors to aid Emperor Basil II. Famous for their loyalty — bound to the emperor personally rather than to the state — they carried distinctive double-headed axes and protected the Byzantine emperors for over three centuries.',
    wikipedia: 'https://en.wikipedia.org/wiki/Varangian_Guard',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Varangian Guard served as elite bodyguards to the ____ emperors.',
        answer: 'Byzantine',
      },
      {
        format: 'contrast',
        prompt: 'What was the signature weapon of the Varangian Guard?',
        answer: 'Double-headed axe',
        distractors: ['Crossbow', 'Falchion', 'Spear and shield'],
      },
    ],
    edges: [
      { to: 'viking-age', relation: 'part_of' },
      { to: 'byzantine-empire', relation: 'influenced_by' },
      { to: 'rus-origin', relation: 'influenced_by' },
    ],
  },
  {
    id: 'normandy-founding',
    name: 'Founding of Normandy',
    domain: 'history',
    approxYear: 911,
    eras: ['medieval'],
    summary:
      'In 911 CE, the Frankish king Charles the Simple granted the Viking chieftain Rollo a large territory around the Seine estuary — modern Normandy — in exchange for his baptism and a pledge to defend against further raids. The Normans rapidly assimilated French language and culture while retaining martial ambition, producing the line that would conquer England in 1066 and southern Italy.',
    wikipedia: 'https://en.wikipedia.org/wiki/Normandy',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'King Charles the Simple granted Normandy to the Viking chieftain ____ in 911 CE.',
        answer: 'Rollo',
      },
      {
        format: 'contrast',
        prompt: 'What did Rollo agree to in exchange for the grant of Normandy?',
        answer: 'Baptism and defence of the coast',
        distractors: ['Paying annual tribute', 'Supplying ships to the king', 'Converting his army to Christianity only'],
      },
    ],
    edges: [
      { to: 'viking-age', relation: 'part_of' },
      { to: 'norman-conquest', relation: 'caused' },
    ],
  },
  {
    id: 'rus-origin',
    name: "Rus' Origin",
    domain: 'history',
    approxYear: 862,
    eras: ['medieval'],
    summary:
      "Norse Varangians — called Rus' — navigated the great rivers of Eastern Europe from the 9th century, establishing trading posts at Novgorod and Kyiv that became the nucleus of the first East Slavic state. The Primary Chronicle records Rurik arriving at Novgorod in 862, and his successors created Kyivan Rus', the political and cultural ancestor of modern Russia, Ukraine, and Belarus.",
    wikipedia: 'https://en.wikipedia.org/wiki/Rus%27_people',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "The Primary Chronicle records the Norse chieftain ____ founding Novgorod in 862 CE.",
        answer: 'Rurik',
      },
      {
        format: 'contrast',
        prompt: "Kyivan Rus' is considered the cultural ancestor of which modern states?",
        answer: 'Russia, Ukraine, and Belarus',
        distractors: ['Poland, Lithuania, and Latvia', 'Bulgaria, Serbia, and Romania', 'Sweden, Norway, and Denmark'],
      },
    ],
    edges: [
      { to: 'viking-age', relation: 'part_of' },
      { to: 'varangian-guard', relation: 'influenced_by' },
    ],
  },

  // ── Crusades Detail ────────────────────────────────────────────────────────
  {
    id: 'crusades-overview',
    name: 'The Crusades',
    domain: 'history',
    approxYear: 1095,
    eras: ['medieval'],
    summary:
      "The Crusades were a series of religious wars (1095–1291) launched by Latin Christendom to capture the Holy Land from Muslim rule, beginning after Pope Urban II's appeal at Clermont in 1095 and ending when the last Crusader city, Acre, fell in 1291. They left lasting scars in Christian–Muslim and Christian–Jewish relations while inadvertently channelling Eastern goods, ideas, and scholarship back into Europe.",
    wikipedia: 'https://en.wikipedia.org/wiki/Crusades',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "Pope Urban II launched the Crusades with a speech at Clermont in ____.",
        answer: '1095',
      },
      {
        format: 'contrast',
        prompt: 'Which city\'s fall in 1291 ended the Crusader presence in the Holy Land?',
        answer: 'Acre',
        distractors: ['Jerusalem', 'Antioch', 'Tripoli'],
      },
    ],
    edges: [
      { to: 'islam-core', relation: 'opposed' },
      { to: 'byzantine-empire', relation: 'influenced_by' },
      { to: 'alexios-komnenos', relation: 'influenced_by' },
      { to: 'first-crusade', relation: 'influenced_by' },
    ],
  },
  {
    id: 'first-crusade',
    name: 'First Crusade and Siege of Jerusalem',
    domain: 'history',
    approxYear: 1099,
    eras: ['medieval'],
    summary:
      'The First Crusade (1096–1099) was the only crusade to achieve its primary objective: after an extraordinary march across Anatolia and the Levant, Crusader forces besieged and stormed Jerusalem in July 1099, massacring its Muslim and Jewish inhabitants and establishing the Latin Kingdom of Jerusalem. The victory shocked the Islamic world and set the template for Crusader colonialism in the Middle East.',
    wikipedia: 'https://en.wikipedia.org/wiki/First_Crusade',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Crusaders captured Jerusalem in ____, founding the Latin Kingdom of Jerusalem.',
        answer: '1099',
      },
      {
        format: 'contrast',
        prompt: 'What distinguishes the First Crusade from most later Crusades?',
        answer: 'It actually captured Jerusalem',
        distractors: ['It was led by a king', 'It had a naval component', 'It had papal blessing from Rome'],
      },
    ],
    edges: [
      { to: 'crusades-overview', relation: 'part_of' },
      { to: 'saladin', relation: 'opposed' },
    ],
  },
  {
    id: 'saladin',
    name: 'Saladin',
    domain: 'history',
    approxYear: 1187,
    eras: ['medieval'],
    summary:
      'Salah ad-Din Yusuf ibn Ayyub — Saladin — was a Kurdish Muslim general who united Egypt and Syria under the Ayyubid dynasty and recaptured Jerusalem from the Crusaders in 1187 after the Battle of Hattin, where he annihilated the Crusader army. Despite being the greatest opponent of the Crusades, Saladin was widely praised by Christian contemporaries for his chivalry and magnanimity toward defeated foes.',
    wikipedia: 'https://en.wikipedia.org/wiki/Saladin',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Saladin recaptured Jerusalem from the Crusaders in ____ after the Battle of Hattin.',
        answer: '1187',
      },
      {
        format: 'contrast',
        prompt: 'What dynasty did Saladin found?',
        answer: 'Ayyubid',
        distractors: ['Fatimid', 'Seljuk', 'Mamluk'],
      },
    ],
    edges: [
      { to: 'crusades-overview', relation: 'part_of' },
      { to: 'first-crusade', relation: 'opposed' },
      { to: 'richard-i-third-crusade', relation: 'opposed' },
    ],
  },
  {
    id: 'richard-i-third-crusade',
    name: 'Richard I and the Third Crusade',
    domain: 'history',
    approxYear: 1191,
    eras: ['medieval'],
    summary:
      'The Third Crusade (1189–1192) was launched to retake Jerusalem from Saladin and was dominated by the military prowess of Richard I of England — "Lionheart" — who recaptured the port of Acre, won the Battle of Arsuf, and negotiated the Treaty of Jaffa with Saladin, allowing Christian pilgrims access to Jerusalem without returning political control of the city. Richard and Saladin never met in person despite mutual respect expressed in dispatches.',
    wikipedia: 'https://en.wikipedia.org/wiki/Third_Crusade',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Third Crusade ended with the Treaty of ____, allowing Christian pilgrims to visit Jerusalem.',
        answer: 'Jaffa',
      },
      {
        format: 'contrast',
        prompt: "What was Richard I's famous epithet?",
        answer: 'Lionheart',
        distractors: ['The Great', 'Ironside', 'Longsword'],
      },
    ],
    edges: [
      { to: 'crusades-overview', relation: 'part_of' },
      { to: 'saladin', relation: 'opposed' },
    ],
  },
  {
    id: 'teutonic-knights',
    name: 'Teutonic Knights',
    domain: 'history',
    approxYear: 1190,
    eras: ['medieval'],
    summary:
      'The Teutonic Order, a crusading military order founded at Acre in 1190, shifted its focus from the Holy Land to the pagan Baltic, carving out a crusader state in Prussia and Lithuania through conquest and colonisation that lasted into the 15th century. Their defeat at the Battle of Grunwald (1410) by a Polish-Lithuanian army broke their power and shaped the political geography of northern Europe.',
    wikipedia: 'https://en.wikipedia.org/wiki/Teutonic_Order',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Teutonic Knights shifted their crusading activity from the Holy Land to the ____ region.',
        answer: 'Baltic',
      },
      {
        format: 'contrast',
        prompt: 'Which battle in 1410 broke Teutonic power?',
        answer: 'Battle of Grunwald',
        distractors: ['Battle of Legnica', 'Battle of Varna', 'Battle of Kulikovo'],
      },
    ],
    edges: [
      { to: 'crusades-overview', relation: 'part_of' },
    ],
  },
  {
    id: 'childrens-crusade',
    name: "Children's Crusade",
    domain: 'history',
    approxYear: 1212,
    eras: ['medieval'],
    summary:
      "In 1212, two popular movements — one led by a French shepherd boy, another by a German youth — gathered thousands of young followers believing they could win the Holy Land through purity rather than force; neither reached the Holy Land, and most participants died, turned back, or were sold into slavery. The episode illustrates the popular religious fervour the Crusades generated beyond elite military campaigns.",
    wikipedia: "https://en.wikipedia.org/wiki/Children%27s_Crusade",
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "The Children's Crusade took place in ____.",
        answer: '1212',
      },
      {
        format: 'contrast',
        prompt: "What distinguished the Children's Crusade from official Crusades?",
        answer: 'It was a popular mass movement, not a papal-sanctioned military campaign',
        distractors: ['It succeeded in reaching Jerusalem', 'It was led by women', 'It was launched from Italy'],
      },
    ],
    edges: [
      { to: 'crusades-overview', relation: 'part_of' },
    ],
  },

  // ── Medieval Europe ────────────────────────────────────────────────────────
  {
    id: 'norman-conquest',
    name: 'Norman Conquest of England',
    domain: 'history',
    approxYear: 1066,
    eras: ['medieval'],
    summary:
      'William, Duke of Normandy, invaded England in 1066, defeated and killed King Harold at the Battle of Hastings, and was crowned king on Christmas Day — transforming English language, law, aristocracy, and architecture almost overnight. The conquest introduced Norman French vocabulary and feudal land tenure that shaped English culture for centuries, and it ended Anglo-Saxon England permanently.',
    wikipedia: 'https://en.wikipedia.org/wiki/Norman_conquest_of_England',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'William the Conqueror defeated King Harold at the Battle of ____ in 1066.',
        answer: 'Hastings',
      },
      {
        format: 'contrast',
        prompt: 'On which date was William crowned King of England?',
        answer: 'Christmas Day 1066',
        distractors: ['Easter 1067', '14 October 1066', 'New Year\'s Day 1067'],
      },
    ],
    edges: [
      { to: 'william-conqueror', relation: 'part_of' },
      { to: 'normandy-founding', relation: 'influenced_by' },
      { to: 'domesday-book', relation: 'caused' },
      { to: 'feudalism', relation: 'influenced_by' },
    ],
  },
  {
    id: 'william-conqueror',
    name: 'William the Conqueror',
    domain: 'history',
    approxYear: 1066,
    eras: ['medieval'],
    summary:
      'William I of England (c. 1028–1087), Duke of Normandy, conquered England in 1066 and remade it: he replaced almost the entire English nobility with Norman lords, introduced a strict feudal hierarchy, and commissioned the Domesday Book — the most systematic survey of landholding in medieval Europe. His dual legacy as English king and Norman duke created a cross-Channel Anglo-Norman realm that dominated European politics for generations.',
    wikipedia: 'https://en.wikipedia.org/wiki/William_the_Conqueror',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'William commissioned the ____ Book in 1086, recording the landholdings of every estate in England.',
        answer: 'Domesday',
      },
      {
        format: 'contrast',
        prompt: 'What title did William hold before becoming King of England?',
        answer: 'Duke of Normandy',
        distractors: ['Count of Flanders', 'King of France', 'Earl of Wessex'],
      },
    ],
    edges: [
      { to: 'norman-conquest', relation: 'part_of' },
      { to: 'domesday-book', relation: 'influenced_by' },
      { to: 'feudalism', relation: 'influenced_by' },
    ],
  },
  {
    id: 'domesday-book',
    name: 'Domesday Book',
    domain: 'history',
    approxYear: 1086,
    eras: ['medieval'],
    summary:
      'Commissioned by William the Conqueror in 1085 and compiled in 1086, the Domesday Book recorded the ownership and value of virtually every manor in England, enabling the king to maximise taxation and assert feudal rights — it was so thorough and final that contemporaries compared it to the Last Judgement. It remains one of the most remarkable administrative documents of the Middle Ages and is still consulted in English legal disputes today.',
    wikipedia: 'https://en.wikipedia.org/wiki/Domesday_Book',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "The Domesday Book was compiled in ____ on William the Conqueror's orders.",
        answer: '1086',
      },
      {
        format: 'contrast',
        prompt: 'What did contemporaries compare the Domesday Book to, because of its finality?',
        answer: 'The Last Judgement',
        distractors: ['The Bible', 'The Magna Carta', 'The Ten Commandments'],
      },
    ],
    edges: [
      { to: 'william-conqueror', relation: 'influenced_by' },
      { to: 'feudalism', relation: 'influenced_by' },
    ],
  },
  {
    id: 'feudalism',
    name: 'Feudalism',
    domain: 'history',
    approxYear: 900,
    eras: ['medieval'],
    summary:
      'Feudalism was the dominant social and political organisation of medieval Western Europe, structured around lords granting land (fiefs) to vassals in exchange for military service and loyalty, with serfs bound to the land at the base. Though never a uniform system, it provided local order after the collapse of Carolingian central authority and shaped European law, warfare, and class structure until the early modern period.',
    wikipedia: 'https://en.wikipedia.org/wiki/Feudalism',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'In the feudal system, lords granted land called ____ to vassals in exchange for military service.',
        answer: 'fiefs',
      },
      {
        format: 'contrast',
        prompt: 'Which social group formed the base of the feudal pyramid, bound to work the land?',
        answer: 'Serfs',
        distractors: ['Vassals', 'Knights', 'Yeomen'],
      },
    ],
    edges: [
      { to: 'charlemagne', relation: 'influenced_by' },
      { to: 'norman-conquest', relation: 'influenced_by' },
      { to: 'magna-carta', relation: 'influenced_by' },
    ],
  },
  {
    id: 'holy-roman-empire',
    name: 'Holy Roman Empire',
    domain: 'history',
    approxYear: 962,
    eras: ['medieval'],
    summary:
      'The Holy Roman Empire (962–1806) was a loose confederation of German princes, Italian city-states, and other territories in Central Europe nominally ruled by an elected emperor who claimed to be heir to ancient Rome — famously described by Voltaire as "neither holy, nor Roman, nor an empire." Perpetual tension between emperor and princes, and between emperor and pope, prevented it from ever consolidating into a unified state.',
    wikipedia: 'https://en.wikipedia.org/wiki/Holy_Roman_Empire',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Voltaire quipped that the Holy Roman Empire was "neither holy, nor ____, nor an empire."',
        answer: 'Roman',
      },
      {
        format: 'contrast',
        prompt: 'How was the Holy Roman Emperor chosen?',
        answer: 'Elected by German princes',
        distractors: ['Hereditary succession', 'Appointed by the Pope', 'Selected by lot'],
      },
    ],
    edges: [
      { to: 'charlemagne', relation: 'influenced_by' },
      { to: 'frederick-barbarossa', relation: 'influenced_by' },
      { to: 'papal-investiture', relation: 'opposed' },
    ],
  },
  {
    id: 'frederick-barbarossa',
    name: 'Frederick I Barbarossa',
    domain: 'history',
    approxYear: 1155,
    eras: ['medieval'],
    summary:
      'Frederick I Barbarossa (r. 1155–1190) was the most powerful Holy Roman Emperor of the High Middle Ages, pursuing an ambitious policy of reasserting imperial authority over the Italian city-states — repeatedly clashing with the Lombard League and Pope Alexander III — before dying on the Third Crusade while crossing a river in Anatolia. His reign crystallised the perpetual struggle between imperial and papal power that defined medieval German politics.',
    wikipedia: 'https://en.wikipedia.org/wiki/Frederick_I,_Holy_Roman_Emperor',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Frederick Barbarossa\'s Italian campaigns repeatedly brought him into conflict with the ____ League of northern Italian cities.',
        answer: 'Lombard',
      },
      {
        format: 'contrast',
        prompt: 'How did Frederick Barbarossa die?',
        answer: 'Drowned crossing a river on the Third Crusade',
        distractors: ['Killed in battle against the Pope', 'Died of plague in Italy', 'Assassinated by a Sicilian noble'],
      },
    ],
    edges: [
      { to: 'holy-roman-empire', relation: 'part_of' },
      { to: 'papal-investiture', relation: 'opposed' },
    ],
  },
  {
    id: 'pope-innocent-iii',
    name: 'Pope Innocent III',
    domain: 'history',
    approxYear: 1200,
    eras: ['medieval'],
    summary:
      'Innocent III (r. 1198–1216) brought papal power to its medieval zenith, claiming supreme authority over kings and launching the Fourth Crusade, the Albigensian Crusade against Cathar heretics in southern France, and the Fourth Lateran Council, which standardised Catholic doctrine and required annual confession. His pontificate showed both the reach and the brutal limits of medieval theocracy.',
    wikipedia: 'https://en.wikipedia.org/wiki/Pope_Innocent_III',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Pope Innocent III launched the Albigensian Crusade against ____ heretics in southern France.',
        answer: 'Cathar',
      },
      {
        format: 'contrast',
        prompt: 'Which council did Innocent III convene in 1215 to standardise Catholic doctrine?',
        answer: 'Fourth Lateran Council',
        distractors: ['Council of Nicaea', 'Council of Trent', 'Council of Constance'],
      },
    ],
    edges: [
      { to: 'crusades-overview', relation: 'influenced_by' },
      { to: 'papal-investiture', relation: 'influenced_by' },
    ],
  },
  {
    id: 'papal-investiture',
    name: 'Papal Authority and the Investiture Controversy',
    domain: 'history',
    approxYear: 1076,
    eras: ['medieval'],
    summary:
      'The Investiture Controversy (1076–1122) was a bitter conflict between Holy Roman emperors and popes over who had the right to appoint church officials, reaching its dramatic peak when Pope Gregory VII excommunicated Emperor Henry IV, who stood barefoot in the snow at Canossa for three days to beg forgiveness. The Concordat of Worms (1122) resolved the immediate dispute but left the deeper question of church-versus-state authority unresolved for centuries.',
    wikipedia: 'https://en.wikipedia.org/wiki/Investiture_Controversy',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Emperor Henry IV submitted to Pope Gregory VII at ____ in 1077 to have his excommunication lifted.',
        answer: 'Canossa',
      },
      {
        format: 'contrast',
        prompt: 'The Investiture Controversy concerned who had the right to do what?',
        answer: 'Appoint church officials',
        distractors: ['Crown emperors', 'Call crusades', 'Collect church taxes'],
      },
    ],
    edges: [
      { to: 'holy-roman-empire', relation: 'opposed' },
      { to: 'pope-innocent-iii', relation: 'influenced_by' },
    ],
  },
  {
    id: 'scholasticism',
    name: 'Scholasticism',
    domain: 'history',
    approxYear: 1100,
    eras: ['medieval'],
    summary:
      'Scholasticism was the dominant method of medieval Christian philosophy, developed in the cathedral schools and early universities of the 11th–14th centuries, which sought to reconcile classical Greek reason — especially Aristotle — with Christian theology through rigorous logical disputation. Its masterpiece was Thomas Aquinas\'s "Summa Theologiae," and it established the intellectual vocabulary of European philosophy for centuries.',
    wikipedia: 'https://en.wikipedia.org/wiki/Scholasticism',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "Scholasticism sought to reconcile ____ philosophy — especially Aristotle — with Christian theology.",
        answer: 'Greek',
      },
      {
        format: 'contrast',
        prompt: 'Which scholastic philosopher wrote the "Summa Theologiae"?',
        answer: 'Thomas Aquinas',
        distractors: ['Peter Abelard', 'Anselm of Canterbury', 'Roger Bacon'],
      },
    ],
    edges: [
      { to: 'thomas-aquinas', relation: 'influenced_by' },
      { to: 'medieval-universities', relation: 'influenced_by' },
      { to: 'ibn-rushd-averroes', relation: 'influenced_by' },
    ],
  },
  {
    id: 'thomas-aquinas',
    name: 'Thomas Aquinas',
    domain: 'history',
    approxYear: 1265,
    eras: ['medieval'],
    summary:
      'Thomas Aquinas (1225–1274) was a Dominican friar and the central figure of Scholasticism, whose "Summa Theologiae" synthesised Aristotelian philosophy with Christian doctrine to produce the most systematic and influential theology of the Middle Ages. The Catholic Church later declared him a Doctor of the Church and made Thomism the basis of its official philosophical tradition.',
    wikipedia: 'https://en.wikipedia.org/wiki/Thomas_Aquinas',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "Thomas Aquinas's masterwork is the \"____ Theologiae.\"",
        answer: 'Summa',
      },
      {
        format: 'contrast',
        prompt: 'To which mendicant order did Thomas Aquinas belong?',
        answer: 'Dominican',
        distractors: ['Franciscan', 'Benedictine', 'Augustinian'],
      },
    ],
    edges: [
      { to: 'scholasticism', relation: 'part_of' },
      { to: 'ibn-rushd-averroes', relation: 'influenced_by' },
      { to: 'medieval-universities', relation: 'influenced_by' },
    ],
  },
  {
    id: 'medieval-universities',
    name: 'Medieval Universities',
    domain: 'history',
    approxYear: 1088,
    eras: ['medieval'],
    summary:
      'The first universities emerged in Bologna (1088, law), Paris (c. 1150, theology), and Oxford (c. 1167), institutions where scholars gathered under royal or papal charters to teach the liberal arts, medicine, law, and theology through lectures and disputations. They were the incubators of Scholasticism and established the degree structure and collegiate organisation that modern universities still echo.',
    wikipedia: 'https://en.wikipedia.org/wiki/Medieval_university',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The University of ____, founded c. 1088, is often called the first university in the Western world.',
        answer: 'Bologna',
      },
      {
        format: 'contrast',
        prompt: 'What main subjects were taught in medieval universities?',
        answer: 'Liberal arts, theology, law, and medicine',
        distractors: ['Science, mathematics, and engineering', 'Literature, arts, and rhetoric only', 'Bible study and church music'],
      },
    ],
    edges: [
      { to: 'scholasticism', relation: 'influenced_by' },
      { to: 'thomas-aquinas', relation: 'influenced_by' },
    ],
  },
  {
    id: 'notre-dame-de-paris',
    name: 'Notre-Dame de Paris',
    domain: 'history',
    approxYear: 1163,
    eras: ['medieval'],
    summary:
      'Notre-Dame de Paris, begun in 1163 and substantially complete by 1345, is the definitive example of French Gothic architecture — its flying buttresses, pointed arches, ribbed vaults, and vast rose windows solved the engineering problem of flooding stone walls with light while soaring to unprecedented heights. Its reconstruction after the 2019 fire and its role as France\'s emotional epicentre illustrate how medieval cathedrals remain culturally central after 850 years.',
    wikipedia: 'https://en.wikipedia.org/wiki/Notre-Dame_de_Paris',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Notre-Dame de Paris was begun in ____ and took nearly two centuries to complete.',
        answer: '1163',
      },
      {
        format: 'contrast',
        prompt: 'Which architectural innovation allowed Gothic cathedral walls to be filled with large windows?',
        answer: 'Flying buttresses',
        distractors: ['Round arches', 'Barrel vaults', 'Thick stone walls'],
      },
    ],
    edges: [
      { to: 'gothic-architecture', relation: 'part_of' },
    ],
  },
  {
    id: 'gothic-architecture',
    name: 'Gothic Architecture',
    domain: 'history',
    approxYear: 1140,
    eras: ['medieval'],
    summary:
      'Gothic architecture emerged in the Île-de-France around 1140 with Abbot Suger\'s choir at Saint-Denis, combining pointed arches, ribbed vaulting, and flying buttresses to allow unprecedented height and light — a deliberate attempt to make the divine tangible in stone and glass. It spread across Europe for four centuries and its pointed style was revived again in the 19th-century Gothic Revival that produced buildings from Westminster to the US Capitol.',
    wikipedia: 'https://en.wikipedia.org/wiki/Gothic_architecture',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Gothic architecture emerged around 1140 in the choir of the abbey of ____, near Paris.',
        answer: 'Saint-Denis',
      },
      {
        format: 'contrast',
        prompt: 'Which three structural elements define Gothic architecture?',
        answer: 'Pointed arches, ribbed vaults, flying buttresses',
        distractors: ['Columns, domes, and semicircular arches', 'Barrel vaults, thick walls, small windows', 'Minarets, courtyards, and stalactite vaulting'],
      },
    ],
    edges: [
      { to: 'notre-dame-de-paris', relation: 'influenced_by' },
    ],
  },
  {
    id: 'dante-alighieri',
    name: 'Dante Alighieri',
    domain: 'history',
    approxYear: 1308,
    eras: ['medieval'],
    summary:
      'Dante Alighieri (1265–1321) wrote the "Divine Comedy" — an epic journey through Hell, Purgatory, and Heaven — that stands as the supreme literary achievement of the Middle Ages and the founding text of the Italian language. Exiled from Florence for political reasons in 1302, he completed his masterpiece in exile; it synthesises medieval theology, classical learning, and personal political score-settling into one of the most read poems in history.',
    wikipedia: 'https://en.wikipedia.org/wiki/Dante_Alighieri',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "Dante's \"Divine Comedy\" is divided into three parts: Inferno, Purgatorio, and ____.",
        answer: 'Paradiso',
      },
      {
        format: 'contrast',
        prompt: 'From which Italian city was Dante exiled in 1302?',
        answer: 'Florence',
        distractors: ['Rome', 'Venice', 'Milan'],
      },
    ],
    edges: [
      { to: 'thomas-aquinas', relation: 'influenced_by' },
    ],
  },
  {
    id: 'geoffrey-chaucer',
    name: 'Geoffrey Chaucer',
    domain: 'history',
    approxYear: 1390,
    eras: ['medieval'],
    summary:
      'Geoffrey Chaucer (c. 1343–1400) wrote the "Canterbury Tales," a collection of stories told by pilgrims travelling to Thomas Becket\'s shrine, which captured an extraordinary cross-section of medieval English society — from knights to millers to a bawdy Wife of Bath — and established Middle English as a literary language. He is often called the "Father of English literature" for giving the vernacular the prestige previously reserved for Latin and French.',
    wikipedia: 'https://en.wikipedia.org/wiki/Geoffrey_Chaucer',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "Chaucer's \"Canterbury Tales\" follows pilgrims travelling to the shrine of ____ at Canterbury.",
        answer: 'Thomas Becket',
      },
      {
        format: 'contrast',
        prompt: 'What title is Chaucer often given for his role in English literature?',
        answer: 'Father of English literature',
        distractors: ['Bard of Avon', 'Father of the Novel', 'Prince of Poets'],
      },
    ],
    edges: [
      { to: 'dante-alighieri', relation: 'influenced_by' },
    ],
  },
  {
    id: 'black-death-social-impact',
    name: 'Black Death: Social Upheaval',
    domain: 'history',
    approxYear: 1350,
    eras: ['medieval'],
    summary:
      'The Black Death\'s destruction of one-third to one-half of Europe\'s population between 1347 and 1353 convulsed medieval society: flagellant movements marched from town to town whipping themselves in public penance, Jewish communities across Germany and France were massacred on the false accusation that they had poisoned wells, and a sudden labour shortage gave surviving peasants bargaining power that helped erode serfdom in Western Europe.',
    wikipedia: 'https://en.wikipedia.org/wiki/Black_Death',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'During the Black Death, Jews were massacred across Europe on the accusation of poisoning ____.',
        answer: 'wells',
      },
      {
        format: 'contrast',
        prompt: 'What paradoxical long-term benefit did the Black Death give to surviving peasants?',
        answer: 'Labour scarcity gave them bargaining power against lords',
        distractors: ['Land ownership transferred to the Church', 'Nobles freed serfs as thanks', 'Trade guilds collapsed, opening new jobs'],
      },
    ],
    edges: [
      { to: 'black-death', relation: 'part_of' },
      { to: 'feudalism', relation: 'influenced_by' },
    ],
  },

  // ── Mongol Empire Expansion ────────────────────────────────────────────────
  {
    id: 'mongol-conquest-of-china',
    name: 'Mongol Conquest of China',
    domain: 'history',
    approxYear: 1234,
    eras: ['medieval'],
    summary:
      'Genghis Khan began the Mongol conquest of northern China in 1211 by attacking the Jin dynasty; his successors completed the subjugation of the Jin in 1234 and the Song dynasty in 1279, when Kublai Khan\'s navy defeated the last Song fleet at the Battle of Yamen. The Mongol Yuan dynasty ruled all of China until 1368, introducing paper currency on a vast scale and opening the Silk Road to unprecedented cross-continental movement.',
    wikipedia: 'https://en.wikipedia.org/wiki/Mongol_conquest_of_China',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Mongol Yuan dynasty ruled all of China from 1279 until it was overthrown in ____.',
        answer: '1368',
      },
      {
        format: 'contrast',
        prompt: 'Which Chinese dynasty did the Mongols defeat last, completing their conquest of China?',
        answer: 'Song dynasty',
        distractors: ['Tang dynasty', 'Jin dynasty', 'Han dynasty'],
      },
    ],
    edges: [
      { to: 'genghis-khan', relation: 'part_of' },
      { to: 'kublai-khan', relation: 'influenced_by' },
      { to: 'pax-mongolica', relation: 'influenced_by' },
    ],
  },
  {
    id: 'kublai-khan',
    name: 'Kublai Khan',
    domain: 'history',
    approxYear: 1260,
    eras: ['medieval'],
    summary:
      'Kublai Khan (r. 1260–1294), grandson of Genghis, founded the Yuan dynasty in China, promoted trade and religious tolerance, and hosted Marco Polo for seventeen years at his magnificent court in Khanbaliq (Beijing). His failed naval invasions of Japan in 1274 and 1281 — repulsed by storms the Japanese called "kamikaze" (divine winds) — marked the limits of Mongol expansion.',
    wikipedia: 'https://en.wikipedia.org/wiki/Kublai_Khan',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "Kublai Khan's failed invasions of Japan were repulsed by typhoons the Japanese called ____ (divine winds).",
        answer: 'kamikaze',
      },
      {
        format: 'contrast',
        prompt: 'Which dynasty did Kublai Khan found to rule China?',
        answer: 'Yuan',
        distractors: ['Ming', 'Tang', 'Qing'],
      },
    ],
    edges: [
      { to: 'genghis-khan', relation: 'influenced_by' },
      { to: 'marco-polo', relation: 'influenced_by' },
      { to: 'mongol-conquest-of-china', relation: 'part_of' },
    ],
  },
  {
    id: 'pax-mongolica',
    name: 'Pax Mongolica',
    domain: 'history',
    approxYear: 1260,
    eras: ['medieval'],
    summary:
      'The Pax Mongolica ("Mongol Peace") describes the period of relative stability across the Mongol Empire from roughly 1260 to 1360 when the vast network of Silk Road routes was safe enough for travellers, merchants, and diplomats to cross Eurasia with relative security under Mongol protection. This extraordinary connectivity enabled the spread of the Black Death westward and the flow of gunpowder, paper, and printing technology from China to Europe.',
    wikipedia: 'https://en.wikipedia.org/wiki/Pax_Mongolica',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Pax Mongolica facilitated the westward spread of the Black Death along the ____ Road.',
        answer: 'Silk',
      },
      {
        format: 'contrast',
        prompt: 'What technologies flowed from China to Europe during the Pax Mongolica?',
        answer: 'Gunpowder, paper, and printing',
        distractors: ['The compass, steam power, and silk weaving', 'Iron smelting, algebra, and astrolabes', 'Cotton, ceramics, and waterwheels'],
      },
    ],
    edges: [
      { to: 'genghis-khan', relation: 'part_of' },
      { to: 'marco-polo', relation: 'influenced_by' },
      { to: 'black-death', relation: 'influenced_by' },
    ],
  },
  {
    id: 'marco-polo',
    name: 'Marco Polo',
    domain: 'history',
    approxYear: 1275,
    eras: ['medieval'],
    summary:
      'Venetian merchant Marco Polo (1254–1324) travelled to the court of Kublai Khan and served him for seventeen years, returning to Europe with accounts of Chinese paper money, coal, and postal systems so extraordinary that contemporaries called his memoir "Il Milione" (The Million Lies). His descriptions, dictated in a Genoese prison, became the most widely read travel account of the Middle Ages and directly inspired Columbus\'s search for a western route to Asia.',
    wikipedia: 'https://en.wikipedia.org/wiki/Marco_Polo',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Marco Polo served at the court of ____ Khan for seventeen years in the late 13th century.',
        answer: 'Kublai',
      },
      {
        format: 'contrast',
        prompt: "Who was directly inspired by Marco Polo's travel accounts to seek a western route to Asia?",
        answer: 'Christopher Columbus',
        distractors: ['Vasco da Gama', 'Ferdinand Magellan', 'John Cabot'],
      },
    ],
    edges: [
      { to: 'kublai-khan', relation: 'influenced_by' },
      { to: 'pax-mongolica', relation: 'influenced_by' },
    ],
  },
  {
    id: 'mongol-sack-of-baghdad',
    name: 'Mongol Sack of Baghdad',
    domain: 'history',
    approxYear: 1258,
    eras: ['medieval'],
    summary:
      'In February 1258, Hulagu Khan\'s Mongol army sacked Baghdad — capital of the Abbasid Caliphate and the intellectual heart of the Islamic world — killing hundreds of thousands, destroying the Grand Library, and executing the last Abbasid caliph by rolling him in a rug and trampling him to avoid spilling royal blood. Muslim historians called it the greatest catastrophe since Adam; it ended the Islamic Golden Age and permanently shifted the centre of Islamic power toward Egypt.',
    wikipedia: 'https://en.wikipedia.org/wiki/Siege_of_Baghdad_(1258)',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "Hulagu Khan's Mongols sacked Baghdad and destroyed its Grand ____ in 1258.",
        answer: 'Library',
      },
      {
        format: 'contrast',
        prompt: 'How did the Mongols execute the last Abbasid caliph?',
        answer: 'Wrapped in a rug and trampled',
        distractors: ['Beheaded publicly', 'Drowned in the Tigris', 'Burned alive'],
      },
    ],
    edges: [
      { to: 'abbasid-caliphate', relation: 'influenced_by' },
      { to: 'genghis-khan', relation: 'influenced_by' },
      { to: 'islamic-golden-age', relation: 'opposed' },
    ],
  },
  {
    id: 'il-khanate',
    name: 'Il-Khanate',
    domain: 'history',
    approxYear: 1256,
    eras: ['medieval'],
    summary:
      'The Il-Khanate (1256–1335) was the Mongol successor state in Persia and Iraq founded by Hulagu Khan after the destruction of the Abbasid Caliphate. Initially hostile to Islam, the Il-Khans converted to Sunni Islam under Ghazan in 1295, becoming patrons of Persian art and learning, and their territory eventually dissolved into competing Persian successor states after the dynasty\'s extinction.',
    wikipedia: 'https://en.wikipedia.org/wiki/Ilkhanate',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Il-Khanate converted to Sunni Islam under ruler ____ in 1295.',
        answer: 'Ghazan',
      },
      {
        format: 'contrast',
        prompt: 'Who founded the Il-Khanate after the fall of Baghdad?',
        answer: 'Hulagu Khan',
        distractors: ['Kublai Khan', 'Chagatai Khan', 'Berke Khan'],
      },
    ],
    edges: [
      { to: 'genghis-khan', relation: 'part_of' },
      { to: 'mongol-sack-of-baghdad', relation: 'influenced_by' },
    ],
  },

  // ── Late Medieval ──────────────────────────────────────────────────────────
  {
    id: 'hundred-years-war',
    name: "Hundred Years' War",
    domain: 'history',
    approxYear: 1337,
    eras: ['medieval'],
    summary:
      "The Hundred Years' War (1337–1453) was a series of conflicts between England and France over the French throne, in which England held vast French territories early on — winning Crécy, Poitiers, and Agincourt — but ultimately lost all French land except Calais. French victories late in the war, inspired partly by Joan of Arc, forged a sense of French national identity and ended English continental ambitions for good.",
    wikipedia: "https://en.wikipedia.org/wiki/Hundred_Years%27_War",
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: "The Hundred Years' War was fought between ____ and France over the French throne.",
        answer: 'England',
      },
      {
        format: 'contrast',
        prompt: "Which battle of 1415 was England's most celebrated victory in the Hundred Years' War?",
        answer: 'Agincourt',
        distractors: ['Crécy', 'Poitiers', 'Orléans'],
      },
    ],
    edges: [
      { to: 'joan-of-arc', relation: 'influenced_by' },
      { to: 'feudalism', relation: 'influenced_by' },
    ],
  },
  {
    id: 'joan-of-arc',
    name: 'Joan of Arc',
    domain: 'history',
    approxYear: 1429,
    eras: ['medieval'],
    summary:
      "Joan of Arc (c. 1412–1431) was a teenage peasant girl from Domrémy who claimed divine voices commanded her to lead French armies against the English; she lifted the Siege of Orléans in 1429, enabling the Dauphin's coronation at Reims, before being captured by the Burgundians, sold to the English, tried for heresy, and burned at the stake at nineteen. She was canonised in 1920 and remains France's national heroine.",
    wikipedia: 'https://en.wikipedia.org/wiki/Joan_of_Arc',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Joan of Arc was burned at the stake in ____ after being tried for heresy by an English-backed court.',
        answer: '1431',
      },
      {
        format: 'contrast',
        prompt: 'What was Joan of Arc\'s first major military achievement?',
        answer: 'Lifting the Siege of Orléans',
        distractors: ['Capturing Paris', 'Defeating the English at Agincourt', 'Crowning the Dauphin'],
      },
    ],
    edges: [
      { to: 'hundred-years-war', relation: 'part_of' },
    ],
  },
  {
    id: 'ottoman-rise',
    name: 'Ottoman Rise (Osman I)',
    domain: 'history',
    approxYear: 1299,
    eras: ['medieval'],
    summary:
      'Osman I (c. 1258–1326) founded the Ottoman dynasty in northwestern Anatolia around 1299, carving out a principality on the Byzantine frontier that attracted Muslim ghazi warriors drawn by the promise of religious war and plunder. His descendants expanded relentlessly — conquering most of Anatolia, then the Balkans — until Mehmed II took Constantinople in 1453, transforming the dynasty into the dominant power of the eastern Mediterranean.',
    wikipedia: 'https://en.wikipedia.org/wiki/Osman_I',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Ottoman dynasty takes its name from its founder, ____ I.',
        answer: 'Osman',
      },
      {
        format: 'contrast',
        prompt: 'In which region did Osman I establish his original principality?',
        answer: 'Northwestern Anatolia',
        distractors: ['Egypt', 'The Balkans', 'Mesopotamia'],
      },
    ],
    edges: [
      { to: 'fall-of-constantinople', relation: 'caused' },
      { to: 'byzantine-empire', relation: 'opposed' },
    ],
  },
  {
    id: 'fall-of-constantinople',
    name: 'Fall of Constantinople, 1453',
    domain: 'history',
    approxYear: 1453,
    eras: ['medieval'],
    summary:
      'On 29 May 1453, Ottoman Sultan Mehmed II breached the walls of Constantinople after a 53-day siege using massive bronze cannon, ending the Byzantine Empire after 1,123 years and killing its last emperor, Constantine XI, who died fighting on the walls. The conquest made the Ottomans heirs to Rome\'s legacy and prompted a flight of Greek scholars to Italy that helped spark the Renaissance, and historians conventionally mark it as the end of the Middle Ages.',
    wikipedia: 'https://en.wikipedia.org/wiki/Fall_of_Constantinople',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Mehmed II breached Constantinople\'s walls using massive bronze ____ in his 1453 siege.',
        answer: 'cannon',
      },
      {
        format: 'contrast',
        prompt: 'How long had the Byzantine Empire lasted before its fall in 1453?',
        answer: 'Over 1,100 years',
        distractors: ['About 500 years', 'About 700 years', 'About 300 years'],
      },
    ],
    edges: [
      { to: 'byzantine-empire', relation: 'part_of' },
      { to: 'ottoman-rise', relation: 'influenced_by' },
      { to: 'the-renaissance', relation: 'influenced_by' },
    ],
  },
  {
    id: 'wars-of-the-roses',
    name: 'Wars of the Roses',
    domain: 'history',
    approxYear: 1455,
    eras: ['medieval'],
    summary:
      'The Wars of the Roses (1455–1487) were a series of civil wars in England between the House of Lancaster (red rose) and the House of York (white rose) over the English throne, arising from the weak rule of Henry VI and rival claims from Edward III\'s descendants. The conflict ended when Henry Tudor defeated Richard III at Bosworth Field in 1485 and founded the Tudor dynasty, uniting both roses in his emblem.',
    wikipedia: 'https://en.wikipedia.org/wiki/Wars_of_the_Roses',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The Wars of the Roses ended at the Battle of Bosworth Field in ____, where Henry Tudor defeated Richard III.',
        answer: '1485',
      },
      {
        format: 'contrast',
        prompt: 'Which two royal houses fought in the Wars of the Roses?',
        answer: 'Lancaster and York',
        distractors: ['Plantagenet and Tudor', 'Hanover and Stuart', 'Windsor and Bourbon'],
      },
    ],
    edges: [
      { to: 'hundred-years-war', relation: 'influenced_by' },
    ],
  },
  {
    id: 'medieval-manuscript-culture',
    name: 'Medieval Manuscript Culture',
    domain: 'history',
    approxYear: 1100,
    eras: ['medieval'],
    summary:
      'Before Gutenberg, knowledge in medieval Europe was preserved and transmitted through hand-copied manuscripts produced in monastic scriptoria and later in commercial workshops run by stationers near universities — a process so labour-intensive that a single Bible could take a monk a full year and cost the equivalent of a small farm. The scarcity of books concentrated literacy among clergy and elites, meaning that Gutenberg\'s press did not merely speed copying but fundamentally democratised access to knowledge.',
    wikipedia: 'https://en.wikipedia.org/wiki/Medieval_manuscript',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'Medieval books were hand-copied in monastic workshops called ____.',
        answer: 'scriptoria',
      },
      {
        format: 'contrast',
        prompt: 'Roughly how long could it take a single monk to copy one complete Bible?',
        answer: 'A full year',
        distractors: ['A week', 'A month', 'Three months'],
      },
    ],
    edges: [
      { to: 'printing-press', relation: 'caused' },
      { to: 'medieval-universities', relation: 'influenced_by' },
    ],
  },
]
