import type { BankConcept } from '../types'

// Ancient World, Classical Antiquity, Medieval World.
// Well-established facts only. Years given at a precision held with confidence;
// uncertain dates are phrased as ranges or "around".

export const ANCIENT: BankConcept[] = [
  {
    id: 'mesopotamia',
    name: 'Mesopotamia',
    domain: 'history',
    approxYear: -3000,
    eras: ['antiquity'],
    lat: 33.2,
    lng: 44.4,
    summary:
      'The land between the Tigris and Euphrates rivers, in modern Iraq, where some of the first cities arose. The Sumerians here developed one of the earliest writing systems, cuneiform, pressed into clay with a reed. It is often called the cradle of civilisation.',
    wikipedia: 'https://en.wikipedia.org/wiki/Mesopotamia',
    questions: [
      { format: 'cloze', prompt: 'Mesopotamia lay between the Tigris and ____ rivers.', answer: 'Euphrates' },
      {
        format: 'contrast',
        prompt: 'Where did the Sumerians develop cuneiform, one of the earliest writing systems?',
        answer: 'Mesopotamia',
        distractors: ['Ancient Egypt', 'Classical Greece', 'The Indus Valley'],
      },
    ],
    edges: [
      { to: 'ancient-egypt', relation: 'contemporary_of' },
      { to: 'code-of-hammurabi', relation: 'caused' },
    ],
  },
  {
    id: 'ancient-egypt',
    name: 'Ancient Egypt',
    domain: 'history',
    approxYear: -2500,
    eras: ['antiquity'],
    lat: 26.0,
    lng: 30.0,
    summary:
      'A civilisation along the Nile that lasted roughly three thousand years, unified around 3100 BCE. Its god-kings, the pharaohs, were buried in monumental tombs, and its scribes wrote in hieroglyphs. The annual Nile flood made the desert farmable and the whole society possible.',
    wikipedia: 'https://en.wikipedia.org/wiki/Ancient_Egypt',
    questions: [
      { format: 'cloze', prompt: 'Ancient Egypt grew along the ____ river.', answer: 'Nile' },
      { format: 'cloze', prompt: 'Egyptian rulers, considered god-kings, were called ____.', answer: 'pharaohs' },
    ],
    edges: [
      { to: 'great-pyramid-giza', relation: 'caused' },
      { to: 'mesopotamia', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'great-pyramid-giza',
    name: 'The Great Pyramid of Giza',
    domain: 'culture',
    approxYear: -2560,
    eras: ['antiquity'],
    lat: 29.98,
    lng: 31.13,
    summary:
      'The largest of the Egyptian pyramids, built around 2560 BCE as a tomb for the pharaoh Khufu. It was the tallest human-made structure in the world for nearly four thousand years and is the only one of the seven wonders of the ancient world still standing.',
    wikipedia: 'https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Great Pyramid of Giza was built as a tomb for the pharaoh ____.',
        answer: 'Khufu',
      },
      {
        format: 'contrast',
        prompt: 'Which is the only one of the seven wonders of the ancient world still standing?',
        answer: 'The Great Pyramid of Giza',
        distractors: ['The Colosseum', 'The Parthenon', 'The Hanging Gardens of Babylon'],
      },
    ],
    edges: [{ to: 'ancient-egypt', relation: 'part_of' }],
  },
  {
    id: 'code-of-hammurabi',
    name: 'The Code of Hammurabi',
    domain: 'politics',
    approxYear: -1750,
    eras: ['antiquity'],
    summary:
      'One of the earliest known written law codes, issued by Hammurabi, king of Babylon, around 1750 BCE. Carved on a tall stone pillar, it set out punishments on the principle of proportional retaliation, often summarised as "an eye for an eye".',
    wikipedia: 'https://en.wikipedia.org/wiki/Code_of_Hammurabi',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Code of Hammurabi was the law code of the king of ____.',
        answer: 'Babylon',
      },
    ],
    edges: [{ to: 'mesopotamia', relation: 'part_of' }],
  },
  {
    id: 'judaism-core',
    name: 'Judaism',
    domain: 'religions',
    approxYear: -1200,
    eras: ['antiquity'],
    summary:
      'One of the oldest monotheistic religions, centred on a covenant between God and the people of Israel. Its central text is the Torah, the first five books of the Hebrew Bible. Judaism is the older tradition from which both Christianity and Islam later drew.',
    wikipedia: 'https://en.wikipedia.org/wiki/Judaism',
    questions: [
      { format: 'cloze', prompt: 'The central text of Judaism is the ____.', answer: 'Torah' },
      {
        format: 'contrast',
        prompt: 'Which monotheistic religion is the older tradition that Christianity and Islam both drew from?',
        answer: 'Judaism',
        distractors: ['Hinduism', 'Buddhism', 'Zoroastrianism'],
      },
    ],
    edges: [
      { to: 'christianity-core', relation: 'influenced_by' },
      { to: 'islam-core', relation: 'influenced_by' },
    ],
  },
  {
    id: 'hinduism-core',
    name: 'Hinduism',
    domain: 'religions',
    approxYear: -1500,
    eras: ['antiquity'],
    summary:
      'The oldest of the major living religions, with roots in the Indian subcontinent stretching back over three thousand years. It has no single founder and no single scripture. Core ideas include dharma (duty), karma (the moral weight of actions), and moksha (release from the cycle of rebirth).',
    wikipedia: 'https://en.wikipedia.org/wiki/Hinduism',
    questions: [
      {
        format: 'cloze',
        prompt: 'In Hinduism, ____ is release from the cycle of rebirth.',
        answer: 'moksha',
      },
      {
        format: 'contrast',
        prompt: 'Which religion has no single founder and centres on dharma, karma, and moksha?',
        answer: 'Hinduism',
        distractors: ['Buddhism', 'Islam', 'Judaism'],
      },
    ],
    edges: [{ to: 'buddhism-core', relation: 'influenced_by' }],
  },
  {
    id: 'buddhism-core',
    name: 'Buddhism',
    domain: 'religions',
    approxYear: -500,
    eras: ['antiquity', 'classical'],
    summary:
      'A tradition founded in northern India by Siddhartha Gautama, the Buddha, around the 5th century BCE. Its core teaching is the Four Noble Truths: life involves suffering, suffering comes from craving, it can end, and the Eightfold Path is the way. The goal is nirvana, release from rebirth.',
    wikipedia: 'https://en.wikipedia.org/wiki/Buddhism',
    questions: [
      { format: 'cloze', prompt: 'Buddhism was founded by Siddhartha Gautama, known as the ____.', answer: 'Buddha' },
      {
        format: 'contrast',
        prompt: 'Which religion teaches the Four Noble Truths and the Eightfold Path?',
        answer: 'Buddhism',
        distractors: ['Hinduism', 'Christianity', 'Judaism'],
      },
    ],
    edges: [{ to: 'hinduism-core', relation: 'successor_of' }],
  },
  {
    id: 'athenian-democracy',
    name: 'Athenian democracy',
    domain: 'politics',
    approxYear: -508,
    eras: ['classical'],
    lat: 37.98,
    lng: 23.73,
    summary:
      'The world\'s first known democracy, developed in the Greek city-state of Athens from around 508 BCE under the reforms of Cleisthenes. Citizens voted directly on laws in an assembly. It excluded women, slaves, and foreigners, so it was far narrower than modern democracy, but it is its ancestor.',
    wikipedia: 'https://en.wikipedia.org/wiki/Athenian_democracy',
    questions: [
      {
        format: 'cloze',
        prompt: 'The first known democracy developed in the Greek city of ____.',
        answer: 'Athens',
      },
      {
        format: 'contrast',
        prompt: 'Where did the world\'s first known democracy develop, around 508 BCE?',
        answer: 'Athens',
        distractors: ['Rome', 'Sparta', 'Babylon'],
      },
    ],
    edges: [
      { to: 'socrates', relation: 'contemporary_of' },
      { to: 'roman-republic', relation: 'influenced_by' },
    ],
  },
  {
    id: 'socrates',
    name: 'Socrates',
    domain: 'culture',
    approxYear: -399,
    eras: ['classical'],
    summary:
      'An Athenian philosopher of the 5th century BCE, regarded as a founder of Western philosophy. He wrote nothing himself; we know him through his student Plato. His method was relentless questioning to expose weak thinking. Athens condemned him to death by hemlock for "corrupting the youth".',
    wikipedia: 'https://en.wikipedia.org/wiki/Socrates',
    questions: [
      {
        format: 'cloze',
        prompt: 'We know Socrates mainly through the writings of his student ____.',
        answer: 'Plato',
      },
    ],
    edges: [
      { to: 'aristotle', relation: 'influenced_by' },
      { to: 'athenian-democracy', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'aristotle',
    name: 'Aristotle',
    domain: 'culture',
    approxYear: -335,
    eras: ['classical'],
    summary:
      'A Greek philosopher of the 4th century BCE who studied under Plato and tutored Alexander the Great. He wrote on almost everything: logic, biology, ethics, politics, physics. His ideas dominated Western and Islamic thought for nearly two thousand years.',
    wikipedia: 'https://en.wikipedia.org/wiki/Aristotle',
    questions: [
      {
        format: 'cloze',
        prompt: 'Aristotle was the tutor of ____ the Great.',
        answer: 'Alexander',
      },
    ],
    edges: [
      { to: 'socrates', relation: 'successor_of' },
      { to: 'alexander-the-great', relation: 'influenced_by' },
    ],
  },
  {
    id: 'alexander-the-great',
    name: 'Alexander the Great',
    domain: 'history',
    approxYear: -331,
    eras: ['classical'],
    summary:
      'King of Macedon who, by his death at 32 in 323 BCE, had conquered one of the largest empires of the ancient world, reaching from Greece to Egypt and into India. His conquests spread Greek language and culture across the Near East, an era known as the Hellenistic age.',
    wikipedia: 'https://en.wikipedia.org/wiki/Alexander_the_Great',
    questions: [
      {
        format: 'cloze',
        prompt: 'Alexander the Great was king of ____, in northern Greece.',
        answer: 'Macedon',
      },
    ],
    edges: [{ to: 'aristotle', relation: 'student_of' }],
  },
  {
    id: 'roman-republic',
    name: 'The Roman Republic',
    domain: 'politics',
    approxYear: -509,
    eras: ['classical'],
    summary:
      'The phase of Roman government from around 509 BCE, after Rome expelled its kings, until Augustus became the first emperor in 27 BCE. Power was shared through elected officials and the Senate. Its checks and balances directly influenced later constitutions, including that of the United States.',
    wikipedia: 'https://en.wikipedia.org/wiki/Roman_Republic',
    questions: [
      {
        format: 'cloze',
        prompt: 'In the Roman Republic, the chief governing body of elders was the ____.',
        answer: 'Senate',
      },
    ],
    edges: [
      { to: 'julius-caesar', relation: 'caused' },
      { to: 'roman-empire', relation: 'successor_of' },
      { to: 'athenian-democracy', relation: 'successor_of' },
    ],
  },
  {
    id: 'julius-caesar',
    name: 'Julius Caesar',
    domain: 'history',
    approxYear: -44,
    eras: ['classical'],
    summary:
      'A Roman general and statesman whose conquest of Gaul and march on Rome made him dictator, ending the Republic in all but name. He was assassinated by senators on the Ides of March, 44 BCE. His heir Augustus became Rome\'s first emperor.',
    wikipedia: 'https://en.wikipedia.org/wiki/Julius_Caesar',
    questions: [
      {
        format: 'cloze',
        prompt: 'Julius Caesar was assassinated by senators on the Ides of ____, 44 BCE.',
        answer: 'March',
      },
    ],
    edges: [
      { to: 'roman-republic', relation: 'part_of' },
      { to: 'roman-empire', relation: 'caused' },
    ],
  },
  {
    id: 'roman-empire',
    name: 'The Roman Empire',
    domain: 'history',
    approxYear: 117,
    eras: ['classical'],
    lat: 41.9,
    lng: 12.5,
    summary:
      'At its height around 117 CE under Trajan, Rome ruled the entire Mediterranean and much of Europe and the Near East. It gave the western world its roads, law, Latin language, and the calendar. Its capital was Rome; later it split, with the eastern half surviving as the Byzantine Empire.',
    wikipedia: 'https://en.wikipedia.org/wiki/Roman_Empire',
    questions: [
      {
        format: 'cloze',
        prompt: 'The capital of the Roman Empire was ____.',
        answer: 'Rome',
      },
    ],
    edges: [
      { to: 'roman-republic', relation: 'successor_of' },
      { to: 'colosseum', relation: 'caused' },
      { to: 'christianity-core', relation: 'contemporary_of' },
      { to: 'fall-of-western-rome', relation: 'caused' },
      { to: 'byzantine-empire', relation: 'successor_of' },
    ],
  },
  {
    id: 'christianity-core',
    name: 'Christianity',
    domain: 'religions',
    approxYear: 30,
    eras: ['classical'],
    summary:
      'A monotheistic religion centred on the life and teachings of Jesus of Nazareth in 1st-century Roman Judea. Christians believe Jesus is the Son of God who died and rose again. From a small movement it became the official religion of the Roman Empire and is now the largest religion in the world.',
    wikipedia: 'https://en.wikipedia.org/wiki/Christianity',
    questions: [
      {
        format: 'cloze',
        prompt: 'Christianity centres on the life and teachings of ____ of Nazareth.',
        answer: 'Jesus',
      },
      {
        format: 'contrast',
        prompt: 'Which is the largest religion in the world today?',
        answer: 'Christianity',
        distractors: ['Islam', 'Hinduism', 'Buddhism'],
      },
    ],
    edges: [
      { to: 'judaism-core', relation: 'successor_of' },
      { to: 'roman-empire', relation: 'contemporary_of' },
      { to: 'islam-core', relation: 'influenced_by' },
    ],
  },
  {
    id: 'colosseum',
    name: 'The Colosseum',
    domain: 'culture',
    approxYear: 80,
    eras: ['classical'],
    lat: 41.89,
    lng: 12.49,
    summary:
      'A vast stone amphitheatre in the centre of Rome, completed around 80 CE, where tens of thousands watched gladiator fights and public spectacles. It remains the largest amphitheatre ever built and is an enduring symbol of imperial Rome.',
    wikipedia: 'https://en.wikipedia.org/wiki/Colosseum',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Colosseum, an amphitheatre for gladiator fights, stands in the city of ____.',
        answer: 'Rome',
      },
    ],
    edges: [{ to: 'roman-empire', relation: 'part_of' }],
  },
  {
    id: 'euclid',
    name: 'Euclid',
    domain: 'science',
    approxYear: -300,
    eras: ['classical'],
    summary:
      'A Greek mathematician working in Alexandria around 300 BCE, known as the father of geometry. His textbook, the Elements, built geometry up logically from a handful of axioms and was used to teach mathematics for over two thousand years.',
    wikipedia: 'https://en.wikipedia.org/wiki/Euclid',
    questions: [
      {
        format: 'cloze',
        prompt: 'Euclid, the father of geometry, wrote a famous textbook called the ____.',
        answer: 'Elements',
      },
    ],
    edges: [{ to: 'isaac-newton', relation: 'influenced_by' }],
  },
  {
    id: 'fall-of-western-rome',
    name: 'The fall of the Western Roman Empire',
    domain: 'history',
    approxYear: 476,
    eras: ['medieval'],
    summary:
      'In 476 CE the last emperor of the western Roman Empire was deposed by a Germanic leader, a date often used to mark the end of antiquity and the start of the Middle Ages in Europe. The eastern half carried on for another thousand years as the Byzantine Empire.',
    wikipedia: 'https://en.wikipedia.org/wiki/Fall_of_the_Western_Roman_Empire',
    questions: [
      {
        format: 'cloze',
        prompt: 'The fall of the Western Roman Empire is conventionally dated to the year ____.',
        answer: '476',
      },
    ],
    edges: [
      { to: 'roman-empire', relation: 'successor_of' },
      { to: 'byzantine-empire', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'byzantine-empire',
    name: 'The Byzantine Empire',
    domain: 'history',
    approxYear: 550,
    eras: ['medieval'],
    lat: 41.0,
    lng: 28.98,
    summary:
      'The eastern continuation of the Roman Empire, centred on its capital Constantinople (modern Istanbul). It survived the fall of the west by nearly a thousand years, preserving Greek and Roman learning and Orthodox Christianity, until Constantinople fell to the Ottomans in 1453.',
    wikipedia: 'https://en.wikipedia.org/wiki/Byzantine_Empire',
    questions: [
      {
        format: 'cloze',
        prompt: 'The capital of the Byzantine Empire was ____, now called Istanbul.',
        answer: 'Constantinople',
      },
    ],
    edges: [
      { to: 'roman-empire', relation: 'successor_of' },
      { to: 'fall-of-western-rome', relation: 'contemporary_of' },
    ],
  },
  {
    id: 'islam-core',
    name: 'Islam',
    domain: 'religions',
    approxYear: 622,
    eras: ['medieval'],
    summary:
      'A monotheistic religion founded in 7th-century Arabia by the prophet Muhammad, who Muslims believe received the Quran as revelation from God. Its five pillars are the declaration of faith, prayer, charity, fasting in Ramadan, and pilgrimage to Mecca. It is the world\'s second-largest religion.',
    wikipedia: 'https://en.wikipedia.org/wiki/Islam',
    questions: [
      {
        format: 'cloze',
        prompt: 'Islam was founded in 7th-century Arabia by the prophet ____.',
        answer: 'Muhammad',
      },
      {
        format: 'contrast',
        prompt: 'Which religion has the five pillars, including pilgrimage to Mecca?',
        answer: 'Islam',
        distractors: ['Christianity', 'Judaism', 'Hinduism'],
      },
    ],
    edges: [
      { to: 'judaism-core', relation: 'successor_of' },
      { to: 'christianity-core', relation: 'successor_of' },
      { to: 'islamic-golden-age', relation: 'caused' },
    ],
  },
  {
    id: 'islamic-golden-age',
    name: 'The Islamic Golden Age',
    domain: 'science',
    approxYear: 900,
    eras: ['medieval'],
    summary:
      'A period from roughly the 8th to the 13th century when scholars across the Islamic world led the world in mathematics, astronomy, medicine, and philosophy. They preserved and built on Greek learning; the word "algebra" and many star names come from Arabic.',
    wikipedia: 'https://en.wikipedia.org/wiki/Islamic_Golden_Age',
    questions: [
      {
        format: 'cloze',
        prompt: 'The branch of mathematics called ____ takes its name from Arabic.',
        answer: 'algebra',
      },
    ],
    edges: [
      { to: 'islam-core', relation: 'part_of' },
      { to: 'the-renaissance', relation: 'influenced_by' },
    ],
  },
  {
    id: 'charlemagne',
    name: 'Charlemagne',
    domain: 'history',
    approxYear: 800,
    eras: ['medieval'],
    summary:
      'King of the Franks who united much of western Europe and was crowned Holy Roman Emperor by the Pope on Christmas Day in the year 800. He is sometimes called the father of Europe for reviving learning and a sense of common Christian rule after the fall of Rome.',
    wikipedia: 'https://en.wikipedia.org/wiki/Charlemagne',
    questions: [
      {
        format: 'cloze',
        prompt: 'Charlemagne was crowned Holy Roman Emperor by the Pope in the year ____.',
        answer: '800',
      },
    ],
    edges: [{ to: 'christianity-core', relation: 'influenced_by' }],
  },
  {
    id: 'magna-carta',
    name: 'Magna Carta',
    domain: 'politics',
    approxYear: 1215,
    eras: ['medieval'],
    summary:
      'A charter that rebellious barons forced King John of England to seal in 1215, limiting the king\'s power and establishing that even the ruler is subject to the law. It became a founding symbol of constitutional government and influenced later bills of rights.',
    wikipedia: 'https://en.wikipedia.org/wiki/Magna_Carta',
    questions: [
      {
        format: 'cloze',
        prompt: 'Magna Carta was sealed by King John of England in the year ____.',
        answer: '1215',
      },
      {
        format: 'contrast',
        prompt: 'Which document first established that even a king is subject to the law?',
        answer: 'Magna Carta',
        distractors: ['The Code of Hammurabi', 'The US Constitution', 'The Declaration of the Rights of Man'],
      },
    ],
    edges: [
      { to: 'separation-of-powers', relation: 'influenced_by' },
      { to: 'uk-government-structure', relation: 'influenced_by' },
    ],
  },
  {
    id: 'genghis-khan',
    name: 'Genghis Khan',
    domain: 'history',
    approxYear: 1206,
    eras: ['medieval'],
    summary:
      'The founder of the Mongol Empire, who united the nomadic tribes of the steppe and from 1206 led conquests that created the largest contiguous land empire in history, stretching from the Pacific to eastern Europe. The Mongol roads briefly made trade and travel across Asia safe.',
    wikipedia: 'https://en.wikipedia.org/wiki/Genghis_Khan',
    questions: [
      {
        format: 'cloze',
        prompt: 'Genghis Khan founded the ____ Empire, the largest contiguous land empire in history.',
        answer: 'Mongol',
      },
    ],
    edges: [{ to: 'black-death', relation: 'caused' }],
  },
  {
    id: 'black-death',
    name: 'The Black Death',
    domain: 'history',
    approxYear: 1347,
    eras: ['medieval'],
    summary:
      'A plague pandemic that reached Europe in 1347 and killed perhaps a third to a half of its population within a few years. It reshaped society: with so few workers left, wages rose and the rigid feudal order began to crack.',
    wikipedia: 'https://en.wikipedia.org/wiki/Black_Death',
    questions: [
      {
        format: 'cloze',
        prompt: 'The Black Death killed roughly a ____ of Europe\'s population.',
        answer: 'third',
        chipDistractors: ['tenth', 'fifth', 'half'],
      },
    ],
    edges: [{ to: 'the-renaissance', relation: 'caused' }],
  },
]
