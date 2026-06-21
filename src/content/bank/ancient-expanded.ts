import type { BankConcept } from '../types'

// Ancient Near East, Persia, Greece (expanded), Asia, and Roman Republic detail.
// Well-established facts only. Years at a precision held with confidence.

export const ANCIENT_EXPANDED: BankConcept[] = [
  // ── ANCIENT NEAR EAST & PERSIA ─────────────────────────────────────────────

  {
    id: 'persian-empire',
    name: 'The Persian Empire',
    domain: 'history',
    approxYear: -550,
    eras: ['antiquity', 'classical'],
    lat: 32.0,
    lng: 53.0,
    summary:
      'The first great empire to span three continents, founded by Cyrus the Great around 550 BCE. At its peak under Darius I it stretched from Greece to northwestern India, governing diverse peoples through a system of provinces called satrapies. Its fall to Alexander the Great in 330 BCE spread Greek culture across the Near East.',
    wikipedia: 'https://en.wikipedia.org/wiki/Achaemenid_Empire',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Persian Empire was founded by ____ around 550 BCE.', answer: 'Cyrus the Great' },
      {
        format: 'contrast',
        prompt: 'Which empire stretched from Greece to India under Darius I?',
        answer: 'The Persian Empire',
        distractors: ['The Roman Empire', 'The Macedonian Empire', 'The Babylonian Empire'],
      },
    ],
    edges: [
      { to: 'cyrus-the-great', relation: 'part_of' },
      { to: 'darius-i', relation: 'part_of' },
      { to: 'xerxes-i', relation: 'part_of' },
      { to: 'alexander-the-great', relation: 'successor_of' },
      { to: 'achaemenid-satrapy', relation: 'caused' },
      { to: 'zoroastrianism', relation: 'influenced_by' },
    ],
  },

  {
    id: 'cyrus-the-great',
    name: 'Cyrus the Great',
    domain: 'history',
    approxYear: -559,
    eras: ['antiquity'],
    lat: 29.93,
    lng: 53.66,
    summary:
      'The founder of the Achaemenid Persian Empire, who conquered the Median, Lydian, and Babylonian empires in rapid succession between 559 and 539 BCE. Unusually for a conqueror of antiquity, Cyrus freed the Jews exiled in Babylon and respected the religions of conquered peoples. He is praised in the Hebrew Bible as a liberator.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cyrus_the_Great',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Cyrus the Great freed the Jews exiled in ____ in 539 BCE.', answer: 'Babylon' },
      {
        format: 'contrast',
        prompt: 'Which Persian ruler conquered Babylon in 539 BCE and is praised in the Hebrew Bible?',
        answer: 'Cyrus the Great',
        distractors: ['Darius I', 'Xerxes I', 'Nebuchadnezzar II'],
      },
    ],
    edges: [
      { to: 'persian-empire', relation: 'caused' },
      { to: 'neo-babylonian-empire', relation: 'successor_of' },
      { to: 'hebrew-bible', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'darius-i',
    name: 'Darius I',
    domain: 'history',
    approxYear: -522,
    eras: ['antiquity', 'classical'],
    lat: 29.93,
    lng: 53.66,
    summary:
      'The third king of the Achaemenid Persian Empire, who brought it to its greatest territorial extent and organised it into twenty provinces called satrapies. He launched the first Persian invasion of Greece, which ended in Persian defeat at the Battle of Marathon in 490 BCE. Darius also built Persepolis as the ceremonial capital.',
    wikipedia: 'https://en.wikipedia.org/wiki/Darius_the_Great',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Darius I organised the Persian Empire into provinces called ____.', answer: 'satrapies' },
      {
        format: 'contrast',
        prompt: 'Which Persian king was defeated at the Battle of Marathon in 490 BCE?',
        answer: 'Darius I',
        distractors: ['Xerxes I', 'Cyrus the Great', 'Cambyses II'],
      },
    ],
    edges: [
      { to: 'persian-empire', relation: 'part_of' },
      { to: 'battle-of-marathon', relation: 'caused' },
      { to: 'achaemenid-satrapy', relation: 'caused' },
    ],
  },

  {
    id: 'xerxes-i',
    name: 'Xerxes I',
    domain: 'history',
    approxYear: -480,
    eras: ['classical'],
    lat: 29.93,
    lng: 53.66,
    summary:
      'The Persian king who launched the second and largest invasion of Greece in 480 BCE, leading a vast army through the pass of Thermopylae and burning Athens. Despite his victories on land, his fleet was destroyed at the Battle of Salamis and he retreated, ending the Persian threat to Greece.',
    wikipedia: 'https://en.wikipedia.org/wiki/Xerxes_I',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Xerxes I launched a massive invasion of Greece in ____ BCE.', answer: '480' },
      {
        format: 'contrast',
        prompt: 'Which Persian king burned Athens but then lost his fleet at the Battle of Salamis?',
        answer: 'Xerxes I',
        distractors: ['Darius I', 'Cyrus the Great', 'Artaxerxes I'],
      },
    ],
    edges: [
      { to: 'persian-empire', relation: 'part_of' },
      { to: 'battle-of-thermopylae', relation: 'caused' },
      { to: 'battle-of-salamis', relation: 'caused' },
    ],
  },

  {
    id: 'zoroastrianism',
    name: 'Zoroastrianism',
    domain: 'religions',
    approxYear: -600,
    eras: ['antiquity', 'classical'],
    lat: 35.0,
    lng: 51.0,
    summary:
      'One of the world\'s oldest monotheistic religions, founded in ancient Iran by the prophet Zarathustra (Zoroaster), probably between 1500 and 600 BCE. It teaches a cosmic struggle between truth and lies, with a supreme god Ahura Mazda opposing the evil Angra Mainyu. It was the state religion of the Achaemenid Persian Empire and influenced Judaism, Christianity, and Islam.',
    wikipedia: 'https://en.wikipedia.org/wiki/Zoroastrianism',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Zoroastrianism was founded by the prophet ____.', answer: 'Zarathustra' },
      {
        format: 'contrast',
        prompt: 'Which ancient religion was the state religion of the Persian Empire and influenced later monotheisms?',
        answer: 'Zoroastrianism',
        distractors: ['Hinduism', 'Buddhism', 'Taoism'],
      },
    ],
    edges: [
      { to: 'persian-empire', relation: 'part_of' },
      { to: 'judaism-core', relation: 'influenced_by' },
      { to: 'christianity-core', relation: 'influenced_by' },
    ],
  },

  {
    id: 'achaemenid-satrapy',
    name: 'The Achaemenid satrapy system',
    domain: 'politics',
    approxYear: -522,
    eras: ['antiquity', 'classical'],
    summary:
      'The administrative system by which the Persian Empire governed its vast territories, dividing them into roughly twenty provinces each ruled by a governor called a satrap. Satraps collected taxes and maintained order but were supervised by royal inspectors known as the "eyes and ears of the king". It was an early model of how to govern a multiethnic empire.',
    wikipedia: 'https://en.wikipedia.org/wiki/Satrapy',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Governors of Persian provinces were called ____.', answer: 'satraps' },
      {
        format: 'contrast',
        prompt: 'What was the term for a province in the Persian Achaemenid Empire?',
        answer: 'Satrapy',
        distractors: ['Prefecture', 'Province', 'Duchy'],
      },
    ],
    edges: [
      { to: 'persian-empire', relation: 'part_of' },
      { to: 'darius-i', relation: 'caused' },
    ],
  },

  {
    id: 'babylon-city',
    name: 'Babylon',
    domain: 'history',
    approxYear: -600,
    eras: ['antiquity'],
    lat: 32.54,
    lng: 44.42,
    summary:
      'The greatest city of ancient Mesopotamia, located on the Euphrates south of modern Baghdad. Under Nebuchadnezzar II it became the largest city on earth, famed for its massive Ishtar Gate and legendary Hanging Gardens. It was the centre of the Neo-Babylonian Empire before Cyrus the Great captured it peacefully in 539 BCE.',
    wikipedia: 'https://en.wikipedia.org/wiki/Babylon',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Babylon stood on the river ____ in what is now Iraq.', answer: 'Euphrates' },
      {
        format: 'contrast',
        prompt: 'Which ancient city was captured peacefully by Cyrus the Great in 539 BCE?',
        answer: 'Babylon',
        distractors: ['Carthage', 'Athens', 'Nineveh'],
      },
    ],
    edges: [
      { to: 'mesopotamia', relation: 'part_of' },
      { to: 'neo-babylonian-empire', relation: 'part_of' },
      { to: 'cyrus-the-great', relation: 'successor_of' },
      { to: 'code-of-hammurabi', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'neo-babylonian-empire',
    name: 'The Neo-Babylonian Empire',
    domain: 'history',
    approxYear: -605,
    eras: ['antiquity'],
    lat: 32.54,
    lng: 44.42,
    summary:
      'The last great Mesopotamian empire, ruling from Babylon between 626 and 539 BCE. Under King Nebuchadnezzar II it conquered Jerusalem, destroyed Solomon\'s Temple, and exiled the Jewish people to Babylon in an event known as the Babylonian captivity. It fell when Cyrus the Great of Persia captured Babylon.',
    wikipedia: 'https://en.wikipedia.org/wiki/Neo-Babylonian_Empire',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Neo-Babylonian Empire exiled the Jewish people to Babylon under King ____.', answer: 'Nebuchadnezzar II' },
      {
        format: 'contrast',
        prompt: 'Which empire destroyed Solomon\'s Temple and exiled the Jews to Babylon?',
        answer: 'The Neo-Babylonian Empire',
        distractors: ['The Assyrian Empire', 'The Persian Empire', 'The Egyptian Empire'],
      },
    ],
    edges: [
      { to: 'mesopotamia', relation: 'part_of' },
      { to: 'babylon-city', relation: 'part_of' },
      { to: 'assyrian-empire', relation: 'successor_of' },
      { to: 'hebrew-bible', relation: 'contemporary_of' },
      { to: 'cyrus-the-great', relation: 'successor_of' },
    ],
  },

  {
    id: 'assyrian-empire',
    name: 'The Assyrian Empire',
    domain: 'history',
    approxYear: -700,
    eras: ['antiquity'],
    lat: 36.36,
    lng: 43.15,
    summary:
      'The first true empire to dominate the ancient Near East, centred on the city of Nineveh in modern northern Iraq. At its height in the 7th century BCE it controlled territory from Egypt to Iran, governing through brutal military campaigns. Its library at Nineveh preserved thousands of cuneiform tablets, including the Epic of Gilgamesh.',
    wikipedia: 'https://en.wikipedia.org/wiki/Assyrian_Empire',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Assyrian capital, site of a great ancient library, was ____.',  answer: 'Nineveh' },
      {
        format: 'contrast',
        prompt: 'Which ancient Near Eastern empire first controlled territory stretching from Egypt to Iran?',
        answer: 'The Assyrian Empire',
        distractors: ['The Persian Empire', 'The Neo-Babylonian Empire', 'The Egyptian Empire'],
      },
    ],
    edges: [
      { to: 'mesopotamia', relation: 'part_of' },
      { to: 'neo-babylonian-empire', relation: 'successor_of' },
    ],
  },

  {
    id: 'phoenicia',
    name: 'Phoenicia and the alphabet',
    domain: 'history',
    approxYear: -1000,
    eras: ['antiquity'],
    lat: 33.9,
    lng: 35.5,
    summary:
      'A seafaring civilisation on the coast of modern Lebanon, whose city-states including Tyre and Sidon dominated Mediterranean trade in the first millennium BCE. The Phoenicians developed an alphabet of 22 consonants around 1050 BCE, which became the ancestor of Greek, Latin, Arabic, and Hebrew scripts. Their greatest colonial city was Carthage, founded on the coast of North Africa.',
    wikipedia: 'https://en.wikipedia.org/wiki/Phoenicia',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Phoenician alphabet had ____ consonant letters.', answer: '22' },
      {
        format: 'contrast',
        prompt: 'Which ancient civilisation created the alphabet that became the ancestor of Greek and Latin scripts?',
        answer: 'Phoenicia',
        distractors: ['Ancient Egypt', 'Mesopotamia', 'Ancient Greece'],
      },
    ],
    edges: [
      { to: 'carthage', relation: 'caused' },
      { to: 'ancient-egypt', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'carthage',
    name: 'Carthage',
    domain: 'history',
    approxYear: -250,
    eras: ['classical'],
    lat: 36.86,
    lng: 10.32,
    summary:
      'A powerful city-state on the coast of modern Tunisia, founded by Phoenician colonists around 814 BCE. It became the dominant power of the western Mediterranean, controlling trade routes from Spain to Sicily, until it was destroyed by Rome in 146 BCE at the end of the three Punic Wars. The Roman general at its destruction ordered salt ploughed into the ruins.',
    wikipedia: 'https://en.wikipedia.org/wiki/Carthage',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Carthage was founded by colonists from ____.', answer: 'Phoenicia' },
      {
        format: 'contrast',
        prompt: 'Which city was destroyed by Rome in 146 BCE at the end of the Punic Wars?',
        answer: 'Carthage',
        distractors: ['Corinth', 'Syracuse', 'Numantia'],
      },
    ],
    edges: [
      { to: 'phoenicia', relation: 'part_of' },
      { to: 'punic-wars', relation: 'caused' },
      { to: 'hannibal', relation: 'part_of' },
    ],
  },

  {
    id: 'hebrew-bible',
    name: 'The Hebrew Bible / Torah',
    domain: 'religions',
    approxYear: -800,
    eras: ['antiquity'],
    summary:
      'The collection of sacred texts at the heart of Judaism, composed and edited over many centuries, from around 900 to 400 BCE. The Torah, its first five books, presents the laws and covenant between God and Israel attributed to Moses. These texts were later incorporated into the Christian Old Testament and shaped Islamic tradition.',
    wikipedia: 'https://en.wikipedia.org/wiki/Hebrew_Bible',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The first five books of the Hebrew Bible are called the ____.', answer: 'Torah' },
      {
        format: 'contrast',
        prompt: 'Which collection of texts later became the Christian Old Testament?',
        answer: 'The Hebrew Bible',
        distractors: ['The Quran', 'The Vedas', 'The Upanishads'],
      },
    ],
    edges: [
      { to: 'judaism-core', relation: 'part_of' },
      { to: 'ancient-israel', relation: 'part_of' },
      { to: 'christianity-core', relation: 'influenced_by' },
    ],
  },

  {
    id: 'ancient-israel',
    name: 'Ancient Israel',
    domain: 'history',
    approxYear: -1000,
    eras: ['antiquity'],
    lat: 31.8,
    lng: 35.2,
    summary:
      'A kingdom in the southern Levant at its height under kings David and Solomon around 1000 BCE, who built the First Temple in Jerusalem. It later split into the northern Kingdom of Israel and the southern Kingdom of Judah. The Assyrians destroyed Israel in 722 BCE and the Babylonians destroyed Judah and its Temple in 587 BCE, exiling the population.',
    wikipedia: 'https://en.wikipedia.org/wiki/Kingdom_of_Israel_(united_monarchy)',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'King Solomon built the First Temple in the city of ____.', answer: 'Jerusalem' },
      {
        format: 'contrast',
        prompt: 'Which ancient kingdom destroyed the First Temple in Jerusalem in 587 BCE?',
        answer: 'The Neo-Babylonian Empire',
        distractors: ['The Assyrian Empire', 'The Persian Empire', 'Egypt'],
      },
    ],
    edges: [
      { to: 'judaism-core', relation: 'part_of' },
      { to: 'hebrew-bible', relation: 'caused' },
      { to: 'assyrian-empire', relation: 'contemporary_of' },
      { to: 'neo-babylonian-empire', relation: 'contemporary_of' },
    ],
  },

  // ── ANCIENT GREECE ─────────────────────────────────────────────────────────

  {
    id: 'sparta',
    name: 'Sparta',
    domain: 'history',
    approxYear: -500,
    eras: ['classical'],
    lat: 37.07,
    lng: 22.43,
    summary:
      'A Greek city-state in the Peloponnese renowned for its militaristic society, in which boys entered state training at age seven in a brutal regimen called the agoge. Sparta fielded the finest infantry in the ancient Greek world and, uniquely, gave women a degree of education and physical freedom unusual for the time. It defeated Athens in the Peloponnesian War but declined thereafter.',
    wikipedia: 'https://en.wikipedia.org/wiki/Sparta',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Spartan boys entered a rigorous state military training called the ____.', answer: 'agoge' },
      {
        format: 'contrast',
        prompt: 'Which Greek city-state defeated Athens in the Peloponnesian War?',
        answer: 'Sparta',
        distractors: ['Corinth', 'Thebes', 'Argos'],
      },
    ],
    edges: [
      { to: 'greek-city-states', relation: 'part_of' },
      { to: 'battle-of-thermopylae', relation: 'part_of' },
      { to: 'peloponnesian-war', relation: 'caused' },
      { to: 'athenian-democracy', relation: 'opposed' },
    ],
  },

  {
    id: 'battle-of-marathon',
    name: 'The Battle of Marathon',
    domain: 'history',
    approxYear: -490,
    eras: ['classical'],
    lat: 38.15,
    lng: 23.97,
    summary:
      'A battle in 490 BCE in which a smaller Athenian force defeated the invading Persian army of Darius I on the plain of Marathon, northeast of Athens. The unexpected Greek victory showed that Persian infantry could be beaten and inspired Greek confidence in resisting further invasions. Legend holds that a messenger ran the forty kilometres to Athens to announce the victory before dying.',
    wikipedia: 'https://en.wikipedia.org/wiki/Battle_of_Marathon',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Battle of Marathon in 490 BCE was a Greek victory over the army of Persian king ____.', answer: 'Darius I' },
      {
        format: 'contrast',
        prompt: 'The modern marathon race derives its distance from a legendary run after which ancient battle?',
        answer: 'The Battle of Marathon',
        distractors: ['The Battle of Thermopylae', 'The Battle of Salamis', 'The Battle of Plataea'],
      },
    ],
    edges: [
      { to: 'darius-i', relation: 'successor_of' },
      { to: 'athenian-democracy', relation: 'part_of' },
      { to: 'battle-of-thermopylae', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'battle-of-thermopylae',
    name: 'The Battle of Thermopylae',
    domain: 'history',
    approxYear: -480,
    eras: ['classical'],
    lat: 38.8,
    lng: 22.54,
    summary:
      'A three-day stand in 480 BCE at a narrow coastal pass where three hundred Spartans under King Leonidas, joined by several thousand Greek allies, held back Xerxes\' enormous Persian army. Betrayed by a local Greek, they were ultimately surrounded and killed to the last man. The battle became the defining symbol of courage against overwhelming odds.',
    wikipedia: 'https://en.wikipedia.org/wiki/Battle_of_Thermopylae',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'At Thermopylae, three hundred Spartans were led by King ____.', answer: 'Leonidas' },
      {
        format: 'contrast',
        prompt: 'Where did a small Greek force famously hold back Xerxes\' Persian army for three days in 480 BCE?',
        answer: 'Thermopylae',
        distractors: ['Marathon', 'Salamis', 'Plataea'],
      },
    ],
    edges: [
      { to: 'xerxes-i', relation: 'part_of' },
      { to: 'sparta', relation: 'part_of' },
      { to: 'battle-of-salamis', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'battle-of-salamis',
    name: 'The Battle of Salamis',
    domain: 'history',
    approxYear: -480,
    eras: ['classical'],
    lat: 37.96,
    lng: 23.47,
    summary:
      'A naval battle in 480 BCE in which the Athenian-led Greek fleet, under the strategist Themistocles, lured the larger Persian fleet into the narrow strait of Salamis and crushed it. Xerxes watched from a throne on the shore as his navy was destroyed, effectively ending the Persian invasion of Greece.',
    wikipedia: 'https://en.wikipedia.org/wiki/Battle_of_Salamis',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Greek victory at Salamis was masterminded by the Athenian strategist ____.', answer: 'Themistocles' },
      {
        format: 'contrast',
        prompt: 'Which battle in 480 BCE saw a Greek naval victory that ended the main Persian invasion?',
        answer: 'The Battle of Salamis',
        distractors: ['The Battle of Marathon', 'The Battle of Thermopylae', 'The Battle of Plataea'],
      },
    ],
    edges: [
      { to: 'xerxes-i', relation: 'part_of' },
      { to: 'battle-of-thermopylae', relation: 'contemporary_of' },
      { to: 'athenian-democracy', relation: 'part_of' },
    ],
  },

  {
    id: 'pericles',
    name: 'Pericles and the Athenian Golden Age',
    domain: 'history',
    approxYear: -450,
    eras: ['classical'],
    lat: 37.97,
    lng: 23.73,
    summary:
      'Pericles dominated Athenian politics for three decades from around 461 BCE, turning Athens into the cultural capital of Greece. He funded the construction of the Parthenon and the other buildings on the Acropolis, and expanded democratic participation. His era saw the flowering of tragedy, philosophy, and art that defined classical Greek culture.',
    wikipedia: 'https://en.wikipedia.org/wiki/Pericles',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Pericles funded the construction of the ____ on the Athenian Acropolis.', answer: 'Parthenon' },
      {
        format: 'contrast',
        prompt: 'Which Athenian statesman oversaw the Golden Age and funded the building of the Parthenon?',
        answer: 'Pericles',
        distractors: ['Themistocles', 'Cleisthenes', 'Solon'],
      },
    ],
    edges: [
      { to: 'athenian-democracy', relation: 'part_of' },
      { to: 'the-parthenon', relation: 'caused' },
      { to: 'peloponnesian-war', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'the-parthenon',
    name: 'The Parthenon',
    domain: 'culture',
    approxYear: -432,
    eras: ['classical'],
    lat: 37.97,
    lng: 23.73,
    summary:
      'A marble temple dedicated to the goddess Athena, built on the Acropolis of Athens between 447 and 432 BCE under the direction of the sculptor Pheidias. Its refined Doric columns and sculptural friezes set the standard for Western classical architecture. The British Museum holds its most famous sculptures, the Elgin Marbles, removed by Lord Elgin in 1801.',
    wikipedia: 'https://en.wikipedia.org/wiki/Parthenon',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Parthenon was built as a temple to the goddess ____.', answer: 'Athena' },
      {
        format: 'contrast',
        prompt: 'On which hill does the Parthenon stand?',
        answer: 'The Acropolis',
        distractors: ['The Palatine Hill', 'Mount Olympus', 'The Capitoline Hill'],
      },
    ],
    edges: [
      { to: 'pericles', relation: 'part_of' },
      { to: 'athenian-democracy', relation: 'part_of' },
    ],
  },

  {
    id: 'peloponnesian-war',
    name: 'The Peloponnesian War',
    domain: 'history',
    approxYear: -431,
    eras: ['classical'],
    summary:
      'A devastating war fought from 431 to 404 BCE between Athens and its empire on one side, and Sparta leading the Peloponnesian League on the other. Athens suffered a catastrophic plague early in the war that killed Pericles, and its ill-fated invasion of Sicily ended in total disaster. Sparta won, but the war exhausted both city-states and ended the Athenian Golden Age.',
    wikipedia: 'https://en.wikipedia.org/wiki/Peloponnesian_War',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Peloponnesian War was between Athens and ____ and ended in 404 BCE.', answer: 'Sparta' },
      {
        format: 'contrast',
        prompt: 'Which historian wrote our main account of the Peloponnesian War?',
        answer: 'Thucydides',
        distractors: ['Herodotus', 'Plutarch', 'Xenophon'],
      },
    ],
    edges: [
      { to: 'sparta', relation: 'part_of' },
      { to: 'athenian-democracy', relation: 'opposed' },
      { to: 'pericles', relation: 'contemporary_of' },
      { to: 'thucydides', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'plato',
    name: 'Plato',
    domain: 'culture',
    approxYear: -380,
    eras: ['classical'],
    lat: 37.97,
    lng: 23.73,
    summary:
      'An Athenian philosopher who studied under Socrates and founded the Academy, the world\'s first institution of higher learning, around 387 BCE. He wrote philosophical dialogues featuring Socrates as a character to explore justice, beauty, equality, and the theory of ideal Forms. His vision of philosopher-kings governing an ideal republic has influenced political thought ever since.',
    wikipedia: 'https://en.wikipedia.org/wiki/Plato',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Plato founded the ____, the world\'s first institution of higher learning, around 387 BCE.', answer: 'Academy' },
      {
        format: 'contrast',
        prompt: 'Which philosopher was both a student of Socrates and a teacher of Aristotle?',
        answer: 'Plato',
        distractors: ['Epicurus', 'Pythagoras', 'Thales'],
      },
    ],
    edges: [
      { to: 'socrates', relation: 'student_of' },
      { to: 'aristotle', relation: 'influenced_by' },
      { to: 'athenian-democracy', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'olympic-games',
    name: 'The Olympic Games',
    domain: 'culture',
    approxYear: -776,
    eras: ['antiquity', 'classical'],
    lat: 37.64,
    lng: 21.63,
    summary:
      'A panhellenic religious and athletic festival held every four years at Olympia in honour of Zeus, traditionally dated from 776 BCE. Athletes from competing Greek city-states competed in foot races, wrestling, chariot racing, and the pentathlon; wars were paused for a sacred truce. The games were abolished in 393 CE by the Christian emperor Theodosius I and revived in 1896.',
    wikipedia: 'https://en.wikipedia.org/wiki/Ancient_Olympic_Games',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The ancient Olympic Games were held at ____, in honour of Zeus.', answer: 'Olympia' },
      {
        format: 'contrast',
        prompt: 'In what year are the ancient Olympic Games traditionally said to have begun?',
        answer: '776 BCE',
        distractors: ['500 BCE', '1000 BCE', '490 BCE'],
      },
    ],
    edges: [
      { to: 'greek-city-states', relation: 'part_of' },
    ],
  },

  {
    id: 'homer',
    name: 'Homer and the Iliad',
    domain: 'culture',
    approxYear: -750,
    eras: ['antiquity'],
    summary:
      'Homer is the name given to the ancient Greek poet traditionally credited with composing the Iliad and the Odyssey, the two foundational epics of Western literature, probably in the 8th century BCE. The Iliad tells of the final weeks of the Trojan War, centring on the rage of the warrior Achilles. Whether Homer was a single poet or a tradition of oral singers remains debated.',
    wikipedia: 'https://en.wikipedia.org/wiki/Homer',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Iliad centres on the rage of the Greek warrior ____.', answer: 'Achilles' },
      {
        format: 'contrast',
        prompt: 'Which ancient poem tells the story of the Trojan War through the final weeks of combat?',
        answer: 'The Iliad',
        distractors: ['The Odyssey', 'The Aeneid', 'The Epic of Gilgamesh'],
      },
    ],
    edges: [
      { to: 'trojan-war', relation: 'part_of' },
      { to: 'greek-city-states', relation: 'part_of' },
    ],
  },

  {
    id: 'trojan-war',
    name: 'The Trojan War',
    domain: 'history',
    approxYear: -1200,
    eras: ['antiquity'],
    lat: 39.96,
    lng: 26.24,
    summary:
      'A legendary war between an alliance of Greek city-states and the city of Troy (Ilion) on the northwest coast of modern Turkey, traditionally dated around 1200 BCE. Archaeology at Hisarlik has revealed a Bronze Age city destroyed around that time, suggesting a historical basis to the myth. The Greeks won through the famous stratagem of the wooden horse.',
    wikipedia: 'https://en.wikipedia.org/wiki/Trojan_War',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Greeks captured Troy using the stratagem of the wooden ____.', answer: 'horse' },
      {
        format: 'contrast',
        prompt: 'Where was ancient Troy located?',
        answer: 'Northwest Turkey',
        distractors: ['Greece', 'Cyprus', 'Crete'],
      },
    ],
    edges: [
      { to: 'homer', relation: 'part_of' },
      { to: 'greek-city-states', relation: 'part_of' },
    ],
  },

  {
    id: 'archimedes',
    name: 'Archimedes',
    domain: 'science',
    approxYear: -250,
    eras: ['classical'],
    lat: 37.07,
    lng: 15.29,
    summary:
      'A mathematician and engineer from Syracuse (in Sicily), working in the 3rd century BCE, who is regarded as the greatest mathematician of antiquity. He calculated an accurate approximation of pi, discovered the principle of buoyancy (the eureka moment), and designed war machines to defend Syracuse against Rome. He was killed by a Roman soldier when the city fell in 212 BCE.',
    wikipedia: 'https://en.wikipedia.org/wiki/Archimedes',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Archimedes discovered the principle of ____, explaining why objects float or sink.', answer: 'buoyancy' },
      {
        format: 'contrast',
        prompt: 'Which ancient mathematician shouted "eureka" upon discovering his principle of buoyancy?',
        answer: 'Archimedes',
        distractors: ['Euclid', 'Pythagoras', 'Thales'],
      },
    ],
    edges: [
      { to: 'euclid', relation: 'contemporary_of' },
      { to: 'greek-city-states', relation: 'part_of' },
    ],
  },

  {
    id: 'herodotus',
    name: 'Herodotus',
    domain: 'culture',
    approxYear: -440,
    eras: ['classical'],
    summary:
      'A Greek writer from Halicarnassus (modern Bodrum) often called the "Father of History" for writing the first systematic account of the past, his Histories, composed around 440 BCE. His work covers the Persian Wars and the peoples of the known world from Egypt to Scythia, blending careful inquiry with marvellous stories. He was the first to treat history as an investigation rather than a myth.',
    wikipedia: 'https://en.wikipedia.org/wiki/Herodotus',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Herodotus is called the "Father of ____" for his accounts of the Persian Wars.', answer: 'History' },
      {
        format: 'contrast',
        prompt: 'Which 5th-century BCE Greek writer produced the first major work of historical prose?',
        answer: 'Herodotus',
        distractors: ['Thucydides', 'Xenophon', 'Plutarch'],
      },
    ],
    edges: [
      { to: 'thucydides', relation: 'influenced_by' },
      { to: 'battle-of-marathon', relation: 'part_of' },
      { to: 'battle-of-thermopylae', relation: 'part_of' },
    ],
  },

  {
    id: 'thucydides',
    name: 'Thucydides',
    domain: 'culture',
    approxYear: -410,
    eras: ['classical'],
    summary:
      'An Athenian general and historian who wrote the History of the Peloponnesian War, an account of the conflict between Athens and Sparta from 431 BCE in which he himself fought. He rejected divine explanations for events in favour of rational causes rooted in human nature and power, setting a standard for rigorous political history. His analysis of imperial overreach remains studied in military academies today.',
    wikipedia: 'https://en.wikipedia.org/wiki/Thucydides',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Thucydides wrote the History of the ____ War.', answer: 'Peloponnesian' },
      {
        format: 'contrast',
        prompt: 'Which ancient historian rejected divine explanations and analysed the Peloponnesian War through rational causes?',
        answer: 'Thucydides',
        distractors: ['Herodotus', 'Plutarch', 'Livy'],
      },
    ],
    edges: [
      { to: 'peloponnesian-war', relation: 'part_of' },
      { to: 'herodotus', relation: 'successor_of' },
    ],
  },

  {
    id: 'greek-city-states',
    name: 'Greek city-states (the polis)',
    domain: 'politics',
    approxYear: -700,
    eras: ['antiquity', 'classical'],
    summary:
      'Ancient Greece was not a single nation but a patchwork of hundreds of independent city-states (poleis), each with its own government, laws, and coinage. The polis typically consisted of an urban centre and surrounding farmland. This fragmented political structure produced remarkable diversity, including democracy in Athens and oligarchy in Sparta, and fostered intense competition and innovation.',
    wikipedia: 'https://en.wikipedia.org/wiki/Polis',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Greek term for a city-state is ____.', answer: 'polis' },
      {
        format: 'contrast',
        prompt: 'Ancient Greece was organised as which type of political unit?',
        answer: 'Independent city-states (poleis)',
        distractors: ['A unified kingdom', 'A federal republic', 'A tribal confederacy'],
      },
    ],
    edges: [
      { to: 'athenian-democracy', relation: 'part_of' },
      { to: 'sparta', relation: 'part_of' },
      { to: 'olympic-games', relation: 'part_of' },
    ],
  },

  {
    id: 'hellenism',
    name: 'Hellenism and the Hellenistic period',
    domain: 'history',
    approxYear: -300,
    eras: ['classical'],
    summary:
      'The Hellenistic period (323-31 BCE) followed Alexander the Great\'s death and saw Greek language, culture, and philosophy spread across Egypt, Persia, and into Central Asia. Successor kingdoms carved up Alexander\'s empire, and cities like Alexandria in Egypt became global centres of scholarship. This Greek cultural koine (common tongue) shaped the world into which Christianity and Roman culture emerged.',
    wikipedia: 'https://en.wikipedia.org/wiki/Hellenistic_period',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Hellenistic period began after the death of ____ the Great in 323 BCE.', answer: 'Alexander' },
      {
        format: 'contrast',
        prompt: 'The Hellenistic period saw Greek culture spread across which regions?',
        answer: 'Egypt, Persia, and Central Asia',
        distractors: ['Western Europe and Britain', 'The Arabian peninsula', 'Sub-Saharan Africa'],
      },
    ],
    edges: [
      { to: 'alexander-the-great', relation: 'successor_of' },
      { to: 'greek-city-states', relation: 'successor_of' },
      { to: 'christianity-core', relation: 'influenced_by' },
    ],
  },

  {
    id: 'philip-ii-macedon',
    name: 'Philip II of Macedon',
    domain: 'history',
    approxYear: -359,
    eras: ['classical'],
    lat: 40.65,
    lng: 22.0,
    summary:
      'King of Macedon from 359 BCE who transformed his small northern Greek kingdom into the dominant military power of Greece through a revolutionary professional army using the long-spear phalanx. He united most of Greece under Macedonian hegemony after defeating the Athenians and Thebans at the Battle of Chaeronea in 338 BCE. His son Alexander inherited this army and used it to conquer the world.',
    wikipedia: 'https://en.wikipedia.org/wiki/Philip_II_of_Macedon',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Philip II of Macedon defeated Athens and Thebes at the Battle of ____ in 338 BCE.', answer: 'Chaeronea' },
      {
        format: 'contrast',
        prompt: 'Who was the father of Alexander the Great and unifier of Greece under Macedonian power?',
        answer: 'Philip II of Macedon',
        distractors: ['Pericles', 'Leonidas', 'Themistocles'],
      },
    ],
    edges: [
      { to: 'alexander-the-great', relation: 'influenced_by' },
      { to: 'greek-city-states', relation: 'contemporary_of' },
    ],
  },

  // ── ANCIENT ASIA ───────────────────────────────────────────────────────────

  {
    id: 'ancient-china',
    name: 'Ancient China overview',
    domain: 'history',
    approxYear: -1000,
    eras: ['antiquity', 'classical'],
    lat: 35.0,
    lng: 104.0,
    summary:
      'Chinese civilisation began along the Yellow River, where the Shang dynasty (c. 1600-1046 BCE) developed bronze casting and the earliest Chinese writing. The Zhou dynasty that followed fostered the philosophical flourishing known as the Hundred Schools of Thought, which produced Confucius, Taoism, and Legalism. China\'s geographic isolation behind deserts, steppes, and mountains shaped its distinctive and continuous cultural tradition.',
    wikipedia: 'https://en.wikipedia.org/wiki/History_of_China',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Chinese civilisation began along the ____ River.', answer: 'Yellow' },
      {
        format: 'contrast',
        prompt: 'Which dynasty first developed Chinese writing and bronze casting?',
        answer: 'The Shang dynasty',
        distractors: ['The Qin dynasty', 'The Han dynasty', 'The Zhou dynasty'],
      },
    ],
    edges: [
      { to: 'confucius', relation: 'caused' },
      { to: 'taoism', relation: 'caused' },
      { to: 'qin-dynasty', relation: 'successor_of' },
    ],
  },

  {
    id: 'confucius',
    name: 'Confucius',
    domain: 'culture',
    approxYear: -500,
    eras: ['classical'],
    lat: 35.6,
    lng: 116.98,
    summary:
      'A Chinese philosopher and teacher (551-479 BCE) whose ideas on morality, government, and social harmony have shaped Chinese and East Asian civilisation for two and a half millennia. He taught that social order rests on proper relationships -- between ruler and subject, parent and child, husband and wife -- and that virtue in rulers produces virtue in the people. His sayings were compiled by students in the Analects.',
    wikipedia: 'https://en.wikipedia.org/wiki/Confucius',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Confucius\' sayings were compiled by students in a text called the ____.', answer: 'Analects' },
      {
        format: 'contrast',
        prompt: 'Which Chinese philosopher taught that social order depends on proper relationships and virtuous rulers?',
        answer: 'Confucius',
        distractors: ['Laozi', 'Mencius', 'Han Feizi'],
      },
    ],
    edges: [
      { to: 'ancient-china', relation: 'part_of' },
      { to: 'han-dynasty', relation: 'influenced_by' },
    ],
  },

  {
    id: 'qin-dynasty',
    name: 'The Qin Dynasty and the first emperor',
    domain: 'history',
    approxYear: -221,
    eras: ['classical'],
    lat: 34.36,
    lng: 108.93,
    summary:
      'In 221 BCE the king of Qin conquered the other warring states and proclaimed himself Qin Shi Huang, "First Emperor of China". He standardised weights, measures, currency, and writing across the country, and began the construction of the Great Wall. His brutal Legalist policies provoked rebellion, and the dynasty lasted only fifteen years after his death, but the unified empire it created became the template for all subsequent Chinese states.',
    wikipedia: 'https://en.wikipedia.org/wiki/Qin_dynasty',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Qin Shi Huang unified China and became its ____ emperor in 221 BCE.', answer: 'first' },
      {
        format: 'contrast',
        prompt: 'What did Qin Shi Huang standardise across all of China to unify the country?',
        answer: 'Weights, measures, currency, and writing',
        distractors: ['Language, religion, and architecture', 'Farming, taxation, and clothing', 'Roads, bridges, and canals'],
      },
    ],
    edges: [
      { to: 'ancient-china', relation: 'successor_of' },
      { to: 'great-wall-of-china', relation: 'caused' },
      { to: 'han-dynasty', relation: 'successor_of' },
    ],
  },

  {
    id: 'great-wall-of-china',
    name: 'The Great Wall of China',
    domain: 'history',
    approxYear: -221,
    eras: ['classical'],
    lat: 40.43,
    lng: 116.57,
    summary:
      'A series of walls and fortifications built across northern China, begun under Qin Shi Huang and extended massively under the Ming dynasty (1368-1644 CE). Stretching over 21,000 kilometres in its Ming-era form, it was designed to protect the Chinese agricultural heartland from nomadic raids from the steppe. Despite the myth, it is not visible from space with the naked eye.',
    wikipedia: 'https://en.wikipedia.org/wiki/Great_Wall_of_China',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Great Wall of China was begun under the emperor ____ Shi Huang.', answer: 'Qin' },
      {
        format: 'contrast',
        prompt: 'What was the primary purpose of building the Great Wall of China?',
        answer: 'To protect against nomadic raids from the steppe',
        distractors: ['To mark the border with Korea', 'To control trade routes', 'To prevent internal rebellions'],
      },
    ],
    edges: [
      { to: 'qin-dynasty', relation: 'part_of' },
      { to: 'ancient-china', relation: 'part_of' },
    ],
  },

  {
    id: 'han-dynasty',
    name: 'The Han Dynasty',
    domain: 'history',
    approxYear: -200,
    eras: ['classical'],
    lat: 34.27,
    lng: 108.94,
    summary:
      'The dynasty that followed the Qin and ruled China from 206 BCE to 220 CE, a period roughly contemporary with the Roman Empire in the west. The Han adopted Confucianism as the state philosophy, created a meritocratic civil service selected by examination, and opened the Silk Road to central Asia. The Chinese people still call themselves "Han people" in its honour.',
    wikipedia: 'https://en.wikipedia.org/wiki/Han_dynasty',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Han dynasty created a civil service selected by ____, rather than by birth.', answer: 'examination' },
      {
        format: 'contrast',
        prompt: 'Why do many Chinese people today call themselves "Han"?',
        answer: 'After the Han dynasty, which defined Chinese culture',
        distractors: ['After the Han River in central China', 'After the legendary emperor Han Yu', 'After a word meaning "civilised people"'],
      },
    ],
    edges: [
      { to: 'qin-dynasty', relation: 'successor_of' },
      { to: 'confucius', relation: 'influenced_by' },
      { to: 'silk-road', relation: 'caused' },
    ],
  },

  {
    id: 'silk-road',
    name: 'The Silk Road',
    domain: 'history',
    approxYear: -130,
    eras: ['classical'],
    summary:
      'A network of overland and maritime trade routes connecting China to the Mediterranean, active from the Han dynasty around 130 BCE. Chinese silk, paper, and porcelain moved west; horses, glassware, gold, and religion moved east. The routes carried Buddhism and later Islam into Central and East Asia alongside goods, making them one of history\'s most powerful channels of cultural exchange.',
    wikipedia: 'https://en.wikipedia.org/wiki/Silk_Road',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Silk Road connected China to the ____ and was opened by the Han dynasty.', answer: 'Mediterranean' },
      {
        format: 'contrast',
        prompt: 'Besides goods, what did the Silk Road carry into Central and East Asia?',
        answer: 'Religions, including Buddhism and Islam',
        distractors: ['Agricultural seeds and farming techniques', 'Political systems and legal codes', 'Only luxury fabrics and jewellery'],
      },
    ],
    edges: [
      { to: 'han-dynasty', relation: 'part_of' },
      { to: 'buddhist-spread', relation: 'influenced_by' },
    ],
  },

  {
    id: 'indus-valley',
    name: 'The Indus Valley Civilisation',
    domain: 'history',
    approxYear: -2500,
    eras: ['antiquity'],
    lat: 27.33,
    lng: 68.13,
    summary:
      'One of the world\'s earliest urban civilisations, flourishing from around 2500 to 1900 BCE in the region of modern Pakistan and northwest India. Its cities, including Mohenjo-daro and Harappa, had sophisticated drainage systems, standardised bricks, and evidence of long-distance trade. Its script remains undeciphered, and the reasons for its decline are still debated.',
    wikipedia: 'https://en.wikipedia.org/wiki/Indus_Valley_Civilisation',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The Indus Valley civilisation is notable for having a script that remains ____.', answer: 'undeciphered' },
      {
        format: 'contrast',
        prompt: 'Where was the Indus Valley Civilisation located?',
        answer: 'Modern Pakistan and northwest India',
        distractors: ['Modern Iran and Iraq', 'Modern Bangladesh and Burma', 'The Ganges river valley'],
      },
    ],
    edges: [
      { to: 'hinduism-core', relation: 'influenced_by' },
      { to: 'vedic-period', relation: 'successor_of' },
      { to: 'mesopotamia', relation: 'contemporary_of' },
      { to: 'ancient-egypt', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'vedic-period',
    name: 'The Vedic Period and Upanishads',
    domain: 'religions',
    approxYear: -1000,
    eras: ['antiquity'],
    lat: 28.0,
    lng: 77.0,
    summary:
      'The period in ancient India from roughly 1500 to 500 BCE during which Indo-Aryan peoples composed the Vedas, the oldest sacred texts of Hinduism, in Sanskrit. The later Upanishads (800-200 BCE) shifted focus from ritual sacrifice to inner contemplation, introducing the concepts of Brahman (universal soul), Atman (individual soul), and their identity. This philosophical turn laid the groundwork for both classical Hinduism and Buddhism.',
    wikipedia: 'https://en.wikipedia.org/wiki/Vedic_period',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The sacred texts of the Vedic period were written in the language ____.', answer: 'Sanskrit' },
      {
        format: 'contrast',
        prompt: 'The Upanishads introduced the idea that the individual soul (Atman) is identical to which concept?',
        answer: 'Brahman (the universal soul)',
        distractors: ['Dharma (cosmic law)', 'Karma (moral action)', 'Moksha (liberation)'],
      },
    ],
    edges: [
      { to: 'hinduism-core', relation: 'caused' },
      { to: 'buddhism-core', relation: 'influenced_by' },
      { to: 'indus-valley', relation: 'successor_of' },
    ],
  },

  {
    id: 'ashoka',
    name: 'Ashoka and the Maurya Empire',
    domain: 'history',
    approxYear: -268,
    eras: ['classical'],
    lat: 20.6,
    lng: 78.96,
    summary:
      'The Maurya Empire (322-185 BCE), founded by Chandragupta Maurya, was the first to unite most of the Indian subcontinent. Its greatest emperor, Ashoka (r. 268-232 BCE), converted to Buddhism after witnessing the carnage of the Kalinga War and renounced further conquest. He spread Buddhism throughout Asia via missionaries and inscribed his edicts of compassion and tolerance on pillars across the empire.',
    wikipedia: 'https://en.wikipedia.org/wiki/Ashoka',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Emperor Ashoka converted to ____ after the Kalinga War and promoted peace.', answer: 'Buddhism' },
      {
        format: 'contrast',
        prompt: 'Which empire first unified most of the Indian subcontinent?',
        answer: 'The Maurya Empire',
        distractors: ['The Gupta Empire', 'The Mughal Empire', 'The Vijayanagara Empire'],
      },
    ],
    edges: [
      { to: 'buddhism-core', relation: 'influenced_by' },
      { to: 'buddhist-spread', relation: 'caused' },
      { to: 'vedic-period', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'taoism',
    name: 'Taoism',
    domain: 'religions',
    approxYear: -400,
    eras: ['classical'],
    lat: 35.0,
    lng: 104.0,
    summary:
      'A Chinese philosophical and religious tradition based on the concept of the Tao, meaning "the Way", the fundamental principle underlying the universe. Attributed to the sage Laozi, its key text the Tao Te Ching advocates living in harmony with nature, simplicity, and non-striving (wu wei). It developed alongside Confucianism as one of the two great intellectual traditions shaping Chinese civilisation.',
    wikipedia: 'https://en.wikipedia.org/wiki/Taoism',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Taoism\'s key concept is the ____, meaning "the Way", the principle underlying all things.', answer: 'Tao' },
      {
        format: 'contrast',
        prompt: 'The Tao Te Ching, the foundational text of Taoism, is attributed to which sage?',
        answer: 'Laozi',
        distractors: ['Confucius', 'Mencius', 'Zhuangzi'],
      },
    ],
    edges: [
      { to: 'ancient-china', relation: 'part_of' },
      { to: 'confucius', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'buddhist-spread',
    name: 'Buddhist spread across Asia',
    domain: 'religions',
    approxYear: -250,
    eras: ['classical'],
    summary:
      'From its origins in northern India, Buddhism spread across Asia in two main branches: Theravada reached Sri Lanka and Southeast Asia via missionary monks; Mahayana travelled along the Silk Road into China, Korea, and Japan. Emperor Ashoka\'s missionaries and the trade routes were the primary vectors. By the 7th century CE, Buddhism had become the dominant religion from Afghanistan to Japan, though it largely disappeared from India itself by 1200 CE.',
    wikipedia: 'https://en.wikipedia.org/wiki/Spread_of_Buddhism',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Buddhism reached China, Korea, and Japan via the branch known as ____.', answer: 'Mahayana' },
      {
        format: 'contrast',
        prompt: 'Which emperor\'s missionaries were key to spreading Buddhism across Asia?',
        answer: 'Ashoka',
        distractors: ['Qin Shi Huang', 'Han Wudi', 'Chandragupta Maurya'],
      },
    ],
    edges: [
      { to: 'buddhism-core', relation: 'part_of' },
      { to: 'ashoka', relation: 'part_of' },
      { to: 'silk-road', relation: 'influenced_by' },
    ],
  },

  // ── ROMAN REPUBLIC DETAIL ──────────────────────────────────────────────────

  {
    id: 'punic-wars',
    name: 'The Punic Wars',
    domain: 'history',
    approxYear: -264,
    eras: ['classical'],
    summary:
      'Three wars fought between Rome and Carthage between 264 and 146 BCE for control of the western Mediterranean. The Second Punic War (218-201 BCE), in which Hannibal invaded Italy, came closest to destroying Rome. Roman victory gave it control of Sicily, Spain, and North Africa, setting it on the path to empire. Carthage was razed to the ground at the end of the Third War.',
    wikipedia: 'https://en.wikipedia.org/wiki/Punic_Wars',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'The three Punic Wars were fought between Rome and ____.', answer: 'Carthage' },
      {
        format: 'contrast',
        prompt: 'Which series of wars gave Rome control of the western Mediterranean between 264 and 146 BCE?',
        answer: 'The Punic Wars',
        distractors: ['The Macedonian Wars', 'The Social Wars', 'The Samnite Wars'],
      },
    ],
    edges: [
      { to: 'roman-republic', relation: 'part_of' },
      { to: 'carthage', relation: 'caused' },
      { to: 'hannibal', relation: 'part_of' },
      { to: 'scipio-africanus', relation: 'part_of' },
    ],
  },

  {
    id: 'hannibal',
    name: 'Hannibal',
    domain: 'history',
    approxYear: -218,
    eras: ['classical'],
    lat: 36.86,
    lng: 10.32,
    summary:
      'A Carthaginian general widely regarded as one of the greatest military commanders in history. In 218 BCE he led an army including war elephants across the Alps into Italy, defeated the Romans in a series of battles including the catastrophic Roman defeat at Cannae (216 BCE), and spent fifteen years ravaging the peninsula. He was ultimately defeated by Scipio Africanus at the Battle of Zama in 202 BCE.',
    wikipedia: 'https://en.wikipedia.org/wiki/Hannibal',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Hannibal famously crossed the ____ mountains with war elephants to invade Italy.', answer: 'Alps' },
      {
        format: 'contrast',
        prompt: 'At which battle did Scipio Africanus finally defeat Hannibal in 202 BCE?',
        answer: 'Zama',
        distractors: ['Cannae', 'Trasimene', 'Trebia'],
      },
    ],
    edges: [
      { to: 'carthage', relation: 'part_of' },
      { to: 'punic-wars', relation: 'part_of' },
      { to: 'scipio-africanus', relation: 'opposed' },
      { to: 'roman-republic', relation: 'opposed' },
    ],
  },

  {
    id: 'scipio-africanus',
    name: 'Scipio Africanus',
    domain: 'history',
    approxYear: -202,
    eras: ['classical'],
    summary:
      'A Roman general who turned the tide of the Second Punic War by taking the fight to Spain and then to North Africa itself, forcing Hannibal to return from Italy. His decisive victory over Hannibal at the Battle of Zama in 202 BCE ended the war and earned him the surname "Africanus". He is considered one of the greatest generals of antiquity and an inspiration to Julius Caesar.',
    wikipedia: 'https://en.wikipedia.org/wiki/Scipio_Africanus',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Scipio Africanus earned his surname by defeating Hannibal at the Battle of ____.', answer: 'Zama' },
      {
        format: 'contrast',
        prompt: 'Who was the Roman general who defeated Hannibal at Zama in 202 BCE?',
        answer: 'Scipio Africanus',
        distractors: ['Julius Caesar', 'Pompey', 'Marcus Aurelius'],
      },
    ],
    edges: [
      { to: 'roman-republic', relation: 'part_of' },
      { to: 'punic-wars', relation: 'part_of' },
      { to: 'hannibal', relation: 'opposed' },
    ],
  },

  {
    id: 'cicero',
    name: 'Cicero',
    domain: 'culture',
    approxYear: -63,
    eras: ['classical'],
    summary:
      'A Roman statesman, lawyer, and philosopher whose writings defined the Latin prose style and transmitted Greek philosophy to the Latin-speaking world. As consul in 63 BCE he suppressed the Catilinarian conspiracy and was celebrated as "father of the fatherland". His letters and speeches survive in huge quantities and shaped Renaissance and Enlightenment thought on republican government and natural law.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cicero',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Cicero served as Roman ____ in 63 BCE, during which he suppressed the Catilinarian conspiracy.', answer: 'consul' },
      {
        format: 'contrast',
        prompt: 'Which Roman writer\'s letters and speeches shaped later ideas about republican government?',
        answer: 'Cicero',
        distractors: ['Virgil', 'Ovid', 'Livy'],
      },
    ],
    edges: [
      { to: 'roman-republic', relation: 'part_of' },
      { to: 'roman-senate', relation: 'part_of' },
      { to: 'julius-caesar', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'roman-senate',
    name: 'The Roman Senate and SPQR',
    domain: 'politics',
    approxYear: -300,
    eras: ['classical'],
    lat: 41.89,
    lng: 12.49,
    summary:
      'The governing council of the Roman Republic, composed of several hundred senior magistrates and former magistrates who served for life. It controlled finances, foreign policy, and the allocation of provinces. The abbreviation SPQR -- Senatus Populusque Romanus, "the Senate and People of Rome" -- was Rome\'s official motto and still appears on manhole covers in Rome today.',
    wikipedia: 'https://en.wikipedia.org/wiki/Roman_Senate',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'SPQR stands for Senatus Populusque ____, "the Senate and People of Rome".', answer: 'Romanus' },
      {
        format: 'contrast',
        prompt: 'Which body controlled Roman foreign policy and finances during the Republic?',
        answer: 'The Roman Senate',
        distractors: ['The Comitia (popular assembly)', 'The College of Pontiffs', 'The Board of Censors'],
      },
    ],
    edges: [
      { to: 'roman-republic', relation: 'part_of' },
      { to: 'julius-caesar', relation: 'contemporary_of' },
      { to: 'cicero', relation: 'part_of' },
    ],
  },

  {
    id: 'gracchi',
    name: 'The Gracchi and the Roman land crisis',
    domain: 'politics',
    approxYear: -133,
    eras: ['classical'],
    summary:
      'Two Roman tribunes, brothers Tiberius and Gaius Gracchus, who in 133 and 123 BCE proposed redistributing public land to landless citizens, challenging the concentrated wealth of the senatorial elite. Both were killed by their opponents, Tiberius by a mob of senators in 133 BCE. Their murders signalled that Roman politics had turned violent, a breakdown that eventually led to the civil wars and the end of the Republic.',
    wikipedia: 'https://en.wikipedia.org/wiki/Gracchi',
    imageUrl: null,
    questions: [
      { format: 'cloze', prompt: 'Tiberius Gracchus was killed by a mob of ____ in 133 BCE while proposing land reform.', answer: 'senators' },
      {
        format: 'contrast',
        prompt: 'What did the Gracchi brothers attempt to do for poor Roman citizens?',
        answer: 'Redistribute public land to them',
        distractors: ['Give them the vote in the Senate', 'Abolish military conscription', 'Cancel their debts'],
      },
    ],
    edges: [
      { to: 'roman-republic', relation: 'part_of' },
      { to: 'roman-senate', relation: 'opposed' },
      { to: 'julius-caesar', relation: 'influenced_by' },
    ],
  },
]
