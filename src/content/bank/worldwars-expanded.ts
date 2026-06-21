import type { BankConcept } from '../types'

export const WORLDWARS_EXPANDED: BankConcept[] = [
  // â”€â”€ WWI BATTLES & EVENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'western-front-trenches',
    name: 'Western Front & Trench Warfare',
    domain: 'history',
    approxYear: 1915,
    eras: ['worldwars'],
    lat: 50.0,
    lng: 3.5,
    summary:
      'A 700-kilometre line of opposing trenches stretching from the Belgian coast to Switzerland defined land warfare on the Western Front from late 1914 to 1918. Soldiers lived in waterlogged ditches under constant shellfire, enduring mud, rats, and poison gas while attacking across open ground that rarely shifted more than a few kilometres. The stalemate cost millions of lives and gave WWI its defining image of industrial slaughter.',
    wikipedia: 'https://en.wikipedia.org/wiki/Western_Front_(World_War_I)',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Western Front was a roughly ____-kilometre line of opposing trenches stretching from the Belgian coast to Switzerland.',
        answer: '700',
      },
      {
        format: 'contrast',
        prompt: 'Which weapon was introduced on the Western Front and epitomised the industrial horror of trench warfare?',
        answer: 'Poison gas',
        distractors: ['Gunpowder artillery', 'Land mines', 'Crossbows'],
      },
    ],
    edges: [
      { to: 'battle-of-the-somme', relation: 'contemporary_of' },
      { to: 'battle-of-verdun', relation: 'contemporary_of' },
      { to: 'wwi-trigger', relation: 'part_of' },
    ],
  },

  {
    id: 'battle-of-the-somme',
    name: 'Battle of the Somme',
    domain: 'history',
    approxYear: 1916,
    eras: ['worldwars'],
    lat: 49.98,
    lng: 2.72,
    summary:
      'One of the bloodiest battles in human history, fought on the Western Front between July and November 1916 between British, French, and German forces. On the first day alone â€” 1 July 1916 â€” the British Army suffered nearly 57,000 casualties, the worst single day in its history. The four-month battle ended with over one million total casualties and minimal territorial gain.',
    wikipedia: 'https://en.wikipedia.org/wiki/Battle_of_the_Somme',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'On 1 July 1916, the first day of the Battle of the Somme, the British Army suffered nearly ____ casualties.',
        answer: '57,000',
      },
      {
        format: 'contrast',
        prompt: 'How many total casualties did the Battle of the Somme produce over four months?',
        answer: 'Over one million',
        distractors: ['Around 100,000', 'About 500,000', 'Nearly two million'],
      },
    ],
    edges: [
      { to: 'western-front-trenches', relation: 'part_of' },
      { to: 'wwi-trigger', relation: 'part_of' },
    ],
  },

  {
    id: 'battle-of-verdun',
    name: 'Battle of Verdun',
    domain: 'history',
    approxYear: 1916,
    eras: ['worldwars'],
    lat: 49.16,
    lng: 5.39,
    summary:
      'The longest battle of WWI, fought between France and Germany near Verdun from February to December 1916. German Chief of Staff Falkenhayn designed it to "bleed France white" by attacking a site the French would feel compelled to defend at any cost; the result was roughly 700,000 casualties on both sides with no decisive outcome. Verdun became the defining symbol of French endurance and sacrifice in the war.',
    wikipedia: 'https://en.wikipedia.org/wiki/Battle_of_Verdun',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'German strategy at Verdun aimed to "bleed France ____" by forcing it to defend a symbolically vital site.',
        answer: 'white',
      },
      {
        format: 'contrast',
        prompt: 'Approximately how many casualties did both sides suffer at the Battle of Verdun?',
        answer: '700,000',
        distractors: ['150,000', '1.5 million', '2 million'],
      },
    ],
    edges: [
      { to: 'western-front-trenches', relation: 'part_of' },
      { to: 'battle-of-the-somme', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'battle-of-gallipoli',
    name: 'Battle of Gallipoli',
    domain: 'history',
    approxYear: 1915,
    eras: ['worldwars'],
    lat: 40.35,
    lng: 26.6,
    summary:
      'A catastrophic Allied campaign (February 1915 â€“ January 1916) to seize the Dardanelles strait and knock the Ottoman Empire out of the war by capturing Constantinople. Allied forces â€” including ANZAC troops from Australia and New Zealand â€” landed on the Gallipoli Peninsula but were pinned down by fierce Ottoman resistance, suffering over 250,000 casualties before evacuating. The campaign forged ANZAC identity and ended Winston Churchill\'s career as First Lord of the Admiralty.',
    wikipedia: 'https://en.wikipedia.org/wiki/Gallipoli_campaign',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Gallipoli campaign aimed to seize the ____ strait and knock the Ottoman Empire out of the war.',
        answer: 'Dardanelles',
      },
      {
        format: 'contrast',
        prompt: 'Which country\'s national identity was profoundly shaped by the Gallipoli campaign?',
        answer: 'Australia',
        distractors: ['Canada', 'India', 'South Africa'],
      },
    ],
    edges: [
      { to: 'wwi-trigger', relation: 'part_of' },
      { to: 'armenian-genocide', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'u-boat-warfare',
    name: 'U-boat Warfare & Unrestricted Submarine Warfare',
    domain: 'history',
    approxYear: 1917,
    eras: ['worldwars'],
    lat: 51.5,
    lng: -15.0,
    summary:
      'Germany\'s use of submarines (U-boats) to blockade Britain reached its most aggressive form with the declaration of unrestricted submarine warfare in February 1917, targeting any ship in British waters regardless of nationality. The sinking of the passenger liner RMS Lusitania in 1915 had already killed 1,198 people including 128 Americans; the 1917 campaign sank millions of tonnes of Allied shipping but fatally drew the United States into the war. By late 1917, the convoy system blunted the U-boat threat.',
    wikipedia: 'https://en.wikipedia.org/wiki/Unrestricted_submarine_warfare',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Germany declared ____ submarine warfare in February 1917, targeting any ship in British waters regardless of flag.',
        answer: 'unrestricted',
      },
      {
        format: 'contrast',
        prompt: 'Which Allied countermeasure in 1917 blunted the effectiveness of the U-boat campaign?',
        answer: 'The convoy system',
        distractors: ['Naval blockade of German ports', 'Depth-charge aircraft', 'Minesweeper fleets'],
      },
    ],
    edges: [
      { to: 'us-entry-wwi', relation: 'caused' },
      { to: 'zimmermann-telegram', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'zimmermann-telegram',
    name: 'Zimmermann Telegram',
    domain: 'history',
    approxYear: 1917,
    eras: ['worldwars'],
    summary:
      'A secret diplomatic cable sent in January 1917 by German Foreign Secretary Arthur Zimmermann to Mexico, proposing a military alliance against the United States: if the US entered the war, Germany would help Mexico recover Texas, New Mexico, and Arizona. British intelligence intercepted and decoded the telegram, and its publication in the American press caused public outrage that helped propel the US into WWI two months later.',
    wikipedia: 'https://en.wikipedia.org/wiki/Zimmermann_Telegram',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Zimmermann Telegram proposed a German-Mexican alliance in which Germany would help Mexico recover Texas, New Mexico, and ____ if the US entered WWI.',
        answer: 'Arizona',
      },
      {
        format: 'contrast',
        prompt: 'Who intercepted and decoded the Zimmermann Telegram?',
        answer: 'British intelligence',
        distractors: ['French intelligence', 'US Navy codebreakers', 'Mexican counter-intelligence'],
      },
    ],
    edges: [
      { to: 'us-entry-wwi', relation: 'caused' },
      { to: 'u-boat-warfare', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'us-entry-wwi',
    name: 'US Entry into WWI',
    domain: 'history',
    approxYear: 1917,
    eras: ['worldwars'],
    lat: 38.9,
    lng: -77.0,
    summary:
      'On 6 April 1917, the United States declared war on Germany, ending three years of official neutrality under President Woodrow Wilson. Unrestricted submarine warfare sinking American ships and the shocking Zimmermann Telegram â€” offering Mexico US territory â€” turned public and congressional opinion decisively. The arrival of two million American troops in France by 1918 tipped the balance decisively against a war-exhausted Germany.',
    wikipedia: 'https://en.wikipedia.org/wiki/American_entry_into_World_War_I',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The United States declared war on Germany on ____ April 1917.',
        answer: '6',
      },
      {
        format: 'contrast',
        prompt: 'Approximately how many American troops had arrived in France by 1918?',
        answer: 'Two million',
        distractors: ['500,000', 'Five million', '250,000'],
      },
    ],
    edges: [
      { to: 'zimmermann-telegram', relation: 'influenced_by' },
      { to: 'u-boat-warfare', relation: 'influenced_by' },
      { to: 'treaty-of-versailles', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'armenian-genocide',
    name: 'Armenian Genocide',
    domain: 'history',
    approxYear: 1915,
    eras: ['worldwars'],
    lat: 39.0,
    lng: 35.0,
    summary:
      'The systematic mass extermination and deportation of the Armenian population of the Ottoman Empire carried out by the Ottoman government from 1915 to 1923. An estimated 600,000 to 1.5 million Armenians were killed through massacres, death marches into the Syrian desert, and starvation. It is widely recognised by scholars and many governments as genocide, though Turkey continues to dispute this characterisation.',
    wikipedia: 'https://en.wikipedia.org/wiki/Armenian_genocide',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Armenian Genocide saw an estimated ____ to 1.5 million Armenians killed by the Ottoman government from 1915 onward.',
        answer: '600,000',
      },
      {
        format: 'contrast',
        prompt: 'Which methods did the Ottoman government use to carry out the Armenian Genocide?',
        answer: 'Massacres and forced death marches into the Syrian desert',
        distractors: [
          'Naval blockades and aerial bombardment',
          'Prison camps in the Balkans',
          'Forced labour on railway construction',
        ],
      },
    ],
    edges: [
      { to: 'battle-of-gallipoli', relation: 'contemporary_of' },
      { to: 'wwi-trigger', relation: 'part_of' },
    ],
  },

  {
    id: 'lawrence-of-arabia',
    name: 'Lawrence of Arabia & the Arab Revolt',
    domain: 'history',
    approxYear: 1916,
    eras: ['worldwars'],
    lat: 27.0,
    lng: 37.0,
    summary:
      'British Army officer T.E. Lawrence advised and led Arab forces under Sharif Hussein of Mecca in a guerrilla revolt against the Ottoman Empire beginning in 1916, sabotaging the Hejaz Railway and capturing the port of Aqaba in 1917. The revolt diverted significant Ottoman resources and helped Allied forces advance into Palestine and Syria. Lawrence later felt betrayed when Britain\'s secret Sykes-Picot Agreement revealed that Arab self-determination had been promised while European powers carved up the Middle East.',
    wikipedia: 'https://en.wikipedia.org/wiki/Arab_Revolt',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'T.E. Lawrence helped Arab forces capture the port of ____ in 1917, a key victory of the Arab Revolt.',
        answer: 'Aqaba',
      },
      {
        format: 'contrast',
        prompt: 'What secret agreement undercut the promises of Arab independence that Lawrence had helped sell?',
        answer: 'The Sykes-Picot Agreement',
        distractors: ['The Balfour Declaration', 'The Treaty of SÃ¨vres', 'The Lausanne Convention'],
      },
    ],
    edges: [
      { to: 'balfour-declaration', relation: 'contemporary_of' },
      { to: 'wwi-trigger', relation: 'part_of' },
    ],
  },

  {
    id: 'balfour-declaration',
    name: 'Balfour Declaration',
    domain: 'history',
    approxYear: 1917,
    eras: ['worldwars'],
    summary:
      'A letter dated 2 November 1917 from British Foreign Secretary Arthur James Balfour to Zionist leader Lord Walter Rothschild, stating that the British government viewed "with favour the establishment in Palestine of a national home for the Jewish people" while stipulating that "nothing shall be done which may prejudice the civil and religious rights of existing non-Jewish communities." Its ambiguity fuelled decades of conflict between Jewish and Arab communities in Mandatory Palestine. It remains one of the most consequential and contested diplomatic documents in modern history.',
    wikipedia: 'https://en.wikipedia.org/wiki/Balfour_Declaration',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Balfour Declaration of 1917 expressed British support for a national home for the Jewish people in ____.',
        answer: 'Palestine',
      },
      {
        format: 'contrast',
        prompt: 'To whom was the Balfour Declaration letter addressed?',
        answer: 'Lord Walter Rothschild',
        distractors: ['Chaim Weizmann', 'David Ben-Gurion', 'Theodor Herzl'],
      },
    ],
    edges: [
      { to: 'lawrence-of-arabia', relation: 'contemporary_of' },
      { to: 'wwi-trigger', relation: 'part_of' },
    ],
  },

  {
    id: 'spanish-flu',
    name: 'Spanish Flu Pandemic',
    domain: 'history',
    approxYear: 1918,
    eras: ['worldwars'],
    summary:
      'The influenza pandemic of 1918â€“1919 infected an estimated 500 million people â€” about one-third of the world\'s population â€” and killed between 50 and 100 million, far more than the First World War itself. Unusually, it struck healthy young adults hardest, with a W-shaped mortality curve across age groups. Called the "Spanish flu" because wartime censorship elsewhere suppressed news coverage while neutral Spain reported freely, it devastated armies on both sides and accelerated the end of the war.',
    wikipedia: 'https://en.wikipedia.org/wiki/Spanish_flu',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The 1918 influenza pandemic killed an estimated ____ to 100 million people worldwide.',
        answer: '50 million',
      },
      {
        format: 'contrast',
        prompt:
          'Why was the 1918 pandemic called the "Spanish flu" even though it did not originate in Spain?',
        answer: 'Spain was neutral and reported the disease freely while censorship suppressed news elsewhere',
        distractors: [
          'The first identified outbreak occurred in Madrid',
          'Spanish troops were the primary vectors in Europe',
          'Spanish scientists first sequenced the virus',
        ],
      },
    ],
    edges: [
      { to: 'wwi-trigger', relation: 'contemporary_of' },
      { to: 'armistice-1918', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'armistice-1918',
    name: 'Armistice of 11 November 1918',
    domain: 'history',
    approxYear: 1918,
    eras: ['worldwars'],
    summary:
      'At the eleventh hour of the eleventh day of the eleventh month of 1918, the guns fell silent on the Western Front when Germany signed an armistice in a railway carriage in CompiÃ¨gne Forest, France. The agreement ended four years of devastating war that had claimed some 20 million lives; it did not formally end the war (that came with the Treaty of Versailles in 1919) but imposed harsh ceasefire terms that stripped Germany of territory and military capacity. The exact time was chosen symbolically and is still marked on Remembrance Day.',
    wikipedia: 'https://en.wikipedia.org/wiki/Armistice_of_11_November_1918',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Germany signed the 1918 armistice in a railway carriage in ____ Forest, France, ending WWI fighting.',
        answer: 'CompiÃ¨gne',
      },
      {
        format: 'contrast',
        prompt: 'What formally ended WWI rather than the armistice itself?',
        answer: 'The Treaty of Versailles in 1919',
        distractors: [
          'The Paris Peace Conference declaration',
          'US Senate ratification of the armistice',
          'The League of Nations founding charter',
        ],
      },
    ],
    edges: [
      { to: 'treaty-of-versailles', relation: 'caused' },
      { to: 'wwi-trigger', relation: 'part_of' },
    ],
  },

  // â”€â”€ RUSSIAN REVOLUTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'february-revolution-1917',
    name: 'February Revolution 1917',
    domain: 'history',
    approxYear: 1917,
    eras: ['worldwars'],
    lat: 59.93,
    lng: 30.32,
    summary:
      'In late February 1917 (early March by the Western calendar), mass protests by workers and soldiers in Petrograd over food shortages and war-weariness escalated into a revolution that toppled Tsar Nicholas II in days. The military refused to fire on the crowds; Nicholas abdicated on 2 March, ending three centuries of Romanov rule. A Provisional Government took power, but its fateful decision to continue fighting in WWI created the opening for the Bolshevik October Revolution eight months later.',
    wikipedia: 'https://en.wikipedia.org/wiki/February_Revolution',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The February Revolution of 1917 forced Tsar ____ to abdicate, ending three centuries of Romanov rule.',
        answer: 'Nicholas II',
      },
      {
        format: 'contrast',
        prompt: 'Why did the Provisional Government\'s decision after the February Revolution prove fatal?',
        answer: 'It chose to continue fighting WWI, which fuelled further discontent and enabled the Bolshevik takeover',
        distractors: [
          'It refused to hold elections, alienating all political parties',
          'It dissolved the army, leaving Russia defenceless',
          'It returned land to the nobility rather than the peasants',
        ],
      },
    ],
    edges: [
      { to: 'october-revolution-1917', relation: 'caused' },
      { to: 'russian-revolution', relation: 'part_of' },
    ],
  },

  {
    id: 'october-revolution-1917',
    name: 'October Revolution 1917',
    domain: 'history',
    approxYear: 1917,
    eras: ['worldwars'],
    lat: 59.93,
    lng: 30.32,
    summary:
      'On the night of 25â€“26 October 1917 (7 November by the Western calendar), the Bolsheviks under Lenin seized power in Petrograd in a near-bloodless coup, storming the Winter Palace and arresting the Provisional Government. Unlike the spontaneous February Revolution, the October coup was carefully planned by Lenin, Trotsky, and the Military Revolutionary Committee. It installed the world\'s first communist government, triggering the Russian Civil War and transforming global politics for the rest of the century.',
    wikipedia: 'https://en.wikipedia.org/wiki/October_Revolution',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Bolsheviks seized the ____ Palace in Petrograd during the October Revolution of 1917, arresting the Provisional Government.',
        answer: 'Winter',
      },
      {
        format: 'contrast',
        prompt: 'How did the October Revolution differ from the February Revolution of the same year?',
        answer: 'It was a planned coup organised by Lenin and Trotsky, not a spontaneous popular uprising',
        distractors: [
          'It required months of street fighting across Russia',
          'It was led by the military rather than a political party',
          'It had broad support from the Russian nobility',
        ],
      },
    ],
    edges: [
      { to: 'february-revolution-1917', relation: 'influenced_by' },
      { to: 'russian-civil-war', relation: 'caused' },
      { to: 'russian-revolution', relation: 'part_of' },
      { to: 'bolsheviks-lenin', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'bolsheviks-lenin',
    name: 'Lenin & the Bolsheviks',
    domain: 'history',
    approxYear: 1917,
    eras: ['worldwars'],
    lat: 55.75,
    lng: 37.62,
    summary:
      'Vladimir Lenin led the Bolshevik faction of the Russian Social Democratic Labour Party, a disciplined revolutionary vanguard that believed a professional elite â€” not spontaneous mass action â€” must seize power on behalf of the working class. Returning to Russia in April 1917 aboard a sealed German train (Germany hoped he would destabilise Russia), Lenin published his April Theses demanding immediate peace, land redistribution, and Soviet rule. He directed the October Revolution, became head of the Soviet government, and shaped world communism until his death in 1924.',
    wikipedia: 'https://en.wikipedia.org/wiki/Vladimir_Lenin',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Lenin returned to Russia in April 1917 aboard a sealed ____ train, as Germany hoped he would destabilise the war effort.',
        answer: 'German',
      },
      {
        format: 'contrast',
        prompt: 'What was Lenin\'s central argument in the April Theses?',
        answer: 'Immediate peace, land redistribution to peasants, and transfer of all power to the Soviets',
        distractors: [
          'Continue the war but transfer command to socialist officers',
          'Hold free elections and form a coalition government',
          'Seek alliance with the Western democracies against Germany',
        ],
      },
    ],
    edges: [
      { to: 'october-revolution-1917', relation: 'contemporary_of' },
      { to: 'trotsky', relation: 'contemporary_of' },
      { to: 'cheka-red-terror', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'trotsky',
    name: 'Leon Trotsky',
    domain: 'history',
    approxYear: 1917,
    eras: ['worldwars'],
    lat: 55.75,
    lng: 37.62,
    summary:
      'Leon Trotsky organised the October 1917 coup as chairman of the Petrograd Soviet\'s Military Revolutionary Committee, then built the Red Army from scratch during the Civil War, forging it into a disciplined fighting force that defeated the White armies. Trotsky championed "permanent revolution" â€” the idea that socialism must spread globally â€” clashing with Stalin\'s "socialism in one country." After Lenin\'s death, Stalin outmanoeuvred him politically; Trotsky was exiled in 1927 and murdered by a Soviet agent in Mexico City in 1940.',
    wikipedia: 'https://en.wikipedia.org/wiki/Leon_Trotsky',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Trotsky was murdered by a Soviet agent in ____ City in 1940, years after Stalin had exiled him.',
        answer: 'Mexico',
      },
      {
        format: 'contrast',
        prompt: 'What was Trotsky\'s main contribution during the Russian Civil War?',
        answer: 'Building and commanding the Red Army',
        distractors: [
          'Negotiating the Treaty of Brest-Litovsk',
          'Directing the Cheka secret police',
          'Administering grain requisitioning from peasants',
        ],
      },
    ],
    edges: [
      { to: 'bolsheviks-lenin', relation: 'contemporary_of' },
      { to: 'russian-civil-war', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'russian-civil-war',
    name: 'Russian Civil War',
    domain: 'history',
    approxYear: 1918,
    eras: ['worldwars'],
    lat: 55.75,
    lng: 37.62,
    summary:
      'After the Bolshevik seizure of power, Russia was engulfed in a brutal civil war (1917â€“1922) between the Red Army â€” the Bolsheviks â€” and a loose coalition of anti-Bolshevik forces known as the Whites, supported by 14 foreign powers including Britain, France, and the US. The Reds prevailed largely because the Whites were politically fragmented and geographically dispersed; an estimated 7â€“12 million people died from fighting, famine, and disease. Victory enabled the Bolsheviks to found the Soviet Union in 1922.',
    wikipedia: 'https://en.wikipedia.org/wiki/Russian_Civil_War',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Russian Civil War was fought between the Bolshevik ____ Army and the anti-Bolshevik White forces supported by 14 foreign powers.',
        answer: 'Red',
      },
      {
        format: 'contrast',
        prompt: 'Why did the White forces ultimately lose the Russian Civil War?',
        answer: 'They were politically fragmented and geographically dispersed, lacking unified command',
        distractors: [
          'They ran out of ammunition due to an Allied weapons embargo',
          'Their generals defected to the Bolsheviks en masse',
          'A 1919 peace agreement forced them to disarm',
        ],
      },
    ],
    edges: [
      { to: 'october-revolution-1917', relation: 'influenced_by' },
      { to: 'cheka-red-terror', relation: 'contemporary_of' },
      { to: 'formation-of-ussr', relation: 'caused' },
    ],
  },

  {
    id: 'cheka-red-terror',
    name: 'Cheka & the Red Terror',
    domain: 'history',
    approxYear: 1918,
    eras: ['worldwars'],
    lat: 55.75,
    lng: 37.62,
    summary:
      'The Cheka â€” the Bolsheviks\' secret police, founded in December 1917 â€” launched the Red Terror in September 1918 following an assassination attempt on Lenin, executing thousands of alleged class enemies, counter-revolutionaries, and hostages without trial. Under Felix Dzerzhinsky, the Cheka operated outside the law by design; Lenin explicitly called for mass terror to consolidate Bolshevik power. The Cheka evolved into the GPU, OGPU, NKVD, and ultimately the KGB, establishing a tradition of political repression that persisted for seven decades.',
    wikipedia: 'https://en.wikipedia.org/wiki/Red_Terror',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Cheka secret police, founded in December 1917, launched the Red Terror after an assassination attempt on ____.',
        answer: 'Lenin',
      },
      {
        format: 'contrast',
        prompt: 'The Cheka eventually evolved into which Soviet institution?',
        answer: 'The KGB',
        distractors: ['The GULAG administration', 'The Politburo secretariat', 'The Red Army commissariat'],
      },
    ],
    edges: [
      { to: 'bolsheviks-lenin', relation: 'contemporary_of' },
      { to: 'russian-civil-war', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'formation-of-ussr',
    name: 'Formation of the USSR',
    domain: 'history',
    approxYear: 1922,
    eras: ['worldwars'],
    lat: 55.75,
    lng: 37.62,
    summary:
      'On 30 December 1922, the Union of Soviet Socialist Republics was formally proclaimed, merging Soviet Russia, Ukraine, Byelorussia, and the Transcaucasian Federation into the world\'s first constitutionally socialist state. The union was theoretically a voluntary federation of republics with the right to secede, but political power was monopolised by the Communist Party of the Soviet Union. It would grow to 15 republics and endure until its dissolution on 25 December 1991.',
    wikipedia: 'https://en.wikipedia.org/wiki/Soviet_Union',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt: 'The USSR was formally proclaimed on 30 December ____, merging Russia, Ukraine, Byelorussia, and the Transcaucasian Federation.',
        answer: '1922',
      },
      {
        format: 'contrast',
        prompt: 'Although the USSR was theoretically a voluntary federation, who held actual political power?',
        answer: 'The Communist Party of the Soviet Union',
        distractors: [
          'An elected Supreme Soviet parliament',
          'The Red Army high command',
          'A council of republic leaders with veto power',
        ],
      },
    ],
    edges: [
      { to: 'russian-civil-war', relation: 'influenced_by' },
      { to: 'stalins-collectivisation', relation: 'contemporary_of' },
    ],
  },

  // â”€â”€ INTERWAR PERIOD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'weimar-republic',
    name: 'Weimar Republic',
    domain: 'history',
    approxYear: 1919,
    eras: ['worldwars'],
    lat: 52.52,
    lng: 13.4,
    summary:
      'Germany\'s first democratic republic, established in 1919 after WWI defeat and named for the city where its constitution was drafted, governed a traumatised nation haunted by the "stab-in-the-back" myth, the humiliation of Versailles, hyperinflation, and the Great Depression. Despite producing remarkable cultural achievements â€” Bauhaus, Expressionism, vibrant Berlin nightlife â€” it was politically fragile, relying on emergency powers and coalition governments. It collapsed when President Hindenburg appointed Adolf Hitler as Chancellor in January 1933.',
    wikipedia: 'https://en.wikipedia.org/wiki/Weimar_Republic',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Weimar Republic collapsed when President Hindenburg appointed ____ as Chancellor in January 1933.',
        answer: 'Adolf Hitler',
      },
      {
        format: 'contrast',
        prompt: 'Which economic catastrophe contributed most to destabilising the Weimar Republic in its early years?',
        answer: 'Hyperinflation in 1923',
        distractors: [
          'The 1929 Wall Street Crash alone',
          'Trade sanctions imposed by France',
          'A nationwide general strike in 1921',
        ],
      },
    ],
    edges: [
      { to: 'hyperinflation-germany-1923', relation: 'contemporary_of' },
      { to: 'treaty-of-versailles', relation: 'influenced_by' },
      { to: 'rise-of-hitler', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'hyperinflation-germany-1923',
    name: 'German Hyperinflation 1923',
    domain: 'history',
    approxYear: 1923,
    eras: ['worldwars'],
    lat: 52.52,
    lng: 13.4,
    summary:
      'In 1923, Weimar Germany experienced one of history\'s most extreme hyperinflations: by November the exchange rate reached 4.2 trillion marks to the US dollar, and workers were paid twice daily so wages could be spent before prices rose again. The crisis was sparked by France and Belgium occupying the Ruhr industrial heartland when Germany defaulted on reparations, prompting the government to print money to fund a general strike against the occupation. The Rentenmark currency reform ended the hyperinflation, but not before devastating the German middle class\'s savings.',
    wikipedia: 'https://en.wikipedia.org/wiki/Hyperinflation_in_the_Weimar_Republic',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'At the peak of Germany\'s 1923 hyperinflation, the exchange rate reached 4.2 ____ marks to the US dollar.',
        answer: 'trillion',
      },
      {
        format: 'contrast',
        prompt: 'What event triggered Germany\'s 1923 hyperinflation?',
        answer: 'France and Belgium occupying the Ruhr when Germany defaulted on war reparations',
        distractors: [
          'A bank run that collapsed the entire German banking system',
          'The US Federal Reserve raising interest rates sharply',
          'A nationwide crop failure causing food import costs to spike',
        ],
      },
    ],
    edges: [
      { to: 'weimar-republic', relation: 'part_of' },
      { to: 'treaty-of-versailles', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'wall-street-crash-1929',
    name: 'Wall Street Crash, October 1929',
    domain: 'history',
    approxYear: 1929,
    eras: ['worldwars'],
    lat: 40.71,
    lng: -74.01,
    summary:
      'On Black Thursday (24 October) and Black Tuesday (29 October) 1929, the New York Stock Exchange collapsed in a panic selling frenzy that wiped out billions of dollars of wealth in days. Share prices had been inflated by speculative buying on margin, and when confidence broke, the cascade was unstoppable: the Dow Jones fell nearly 90% from its 1929 peak to its 1932 trough. The crash did not alone cause the Great Depression â€” subsequent banking failures and policy errors turned a crash into a decade-long crisis â€” but it was the triggering shock.',
    wikipedia: 'https://en.wikipedia.org/wiki/Wall_Street_Crash_of_1929',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Wall Street Crash began on Black Thursday, ____ October 1929, with panic selling that collapsed share prices.',
        answer: '24',
      },
      {
        format: 'contrast',
        prompt: 'By how much did the Dow Jones Industrial Average fall from its 1929 peak to its 1932 trough?',
        answer: 'Nearly 90%',
        distractors: ['About 30%', 'Roughly 50%', 'Over 95%'],
      },
    ],
    edges: [
      { to: 'great-depression', relation: 'caused' },
      { to: 'weimar-republic', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'rise-of-hitler',
    name: 'Rise of Hitler & the Nazi Party',
    domain: 'history',
    approxYear: 1933,
    eras: ['worldwars'],
    lat: 52.52,
    lng: 13.4,
    summary:
      'Adolf Hitler transformed the fringe National Socialist German Workers\' Party (NSDAP) into a mass movement by exploiting German resentment at the Versailles Treaty, hyperinflation, the Depression, and fear of communism. After the failed Beer Hall Putsch of 1923, Hitler used his trial as a platform and his imprisonment to write Mein Kampf; the Nazis became the largest Reichstag party in 1932 elections. On 30 January 1933, President Hindenburg appointed Hitler Chancellor, and within months the Enabling Act had transformed Germany into a one-party dictatorship.',
    wikipedia: 'https://en.wikipedia.org/wiki/Adolf_Hitler%27s_rise_to_power',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Hitler wrote ____, his autobiographical manifesto, while imprisoned after the failed 1923 Beer Hall Putsch.',
        answer: 'Mein Kampf',
      },
      {
        format: 'contrast',
        prompt: 'What law did Hitler use to consolidate dictatorial power after becoming Chancellor in 1933?',
        answer: 'The Enabling Act',
        distractors: [
          'The Emergency Decree of 28 February',
          'The Reichstag Fire Decree alone',
          'The Night of Long Knives order',
        ],
      },
    ],
    edges: [
      { to: 'weimar-republic', relation: 'contemporary_of' },
      { to: 'night-of-long-knives', relation: 'contemporary_of' },
      { to: 'nuremberg-laws', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'caused' },
    ],
  },

  {
    id: 'night-of-long-knives',
    name: 'Night of the Long Knives',
    domain: 'history',
    approxYear: 1934,
    eras: ['worldwars'],
    lat: 47.98,
    lng: 11.33,
    summary:
      'Between 30 June and 2 July 1934, Hitler ordered the purge of his own Stormtrooper (SA) leadership and other perceived rivals in a wave of extrajudicial killings carried out by the SS. SA chief Ernst RÃ¶hm and at least 85 others were murdered; the death toll may have exceeded 200. The purge eliminated the SA as a political rival, assured the conservative military that Hitler would not permit socialist radicalism, and demonstrated the Nazi regime\'s willingness to murder without legal process.',
    wikipedia: 'https://en.wikipedia.org/wiki/Night_of_the_Long_Knives',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Night of the Long Knives in June 1934 saw Hitler order the SS to purge the SA leadership, killing its chief ____.',
        answer: 'Ernst RÃ¶hm',
      },
      {
        format: 'contrast',
        prompt: 'What did the Night of the Long Knives achieve for Hitler politically?',
        answer: 'It eliminated the SA as a rival, reassured the army, and demonstrated the regime\'s lawlessness',
        distractors: [
          'It brought the Catholic Church into alignment with the Nazi state',
          'It triggered international sanctions that Hitler used to rally national sentiment',
          'It enabled Hitler to replace Hindenburg as President immediately',
        ],
      },
    ],
    edges: [
      { to: 'rise-of-hitler', relation: 'contemporary_of' },
      { to: 'nuremberg-laws', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'nuremberg-laws',
    name: 'Nuremberg Laws',
    domain: 'history',
    approxYear: 1935,
    eras: ['worldwars'],
    lat: 49.45,
    lng: 11.08,
    summary:
      'Two antisemitic racial laws passed at the Nazi Party rally in Nuremberg on 15 September 1935: the Law for the Protection of German Blood and German Honour, which banned marriage and sex between Jews and non-Jews, and the Reich Citizenship Law, which stripped Jews of German citizenship. The laws used pseudoscientific racial criteria to define who was Jewish and created a legal basis for the systematic exclusion and persecution of Jews that would escalate to the Holocaust.',
    wikipedia: 'https://en.wikipedia.org/wiki/Nuremberg_Laws',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Nuremberg Laws of 1935 stripped Jews of German ____ and banned marriage between Jews and non-Jews.',
        answer: 'citizenship',
      },
      {
        format: 'contrast',
        prompt: 'How did the Nuremberg Laws define who was Jewish?',
        answer: 'Using pseudoscientific racial criteria based on grandparental ancestry',
        distractors: [
          'By self-identification on a national census form',
          'By religious practice and synagogue membership',
          'By surname and family name records',
        ],
      },
    ],
    edges: [
      { to: 'rise-of-hitler', relation: 'contemporary_of' },
      { to: 'kristallnacht', relation: 'contemporary_of' },
      { to: 'the-holocaust', relation: 'caused' },
    ],
  },

  {
    id: 'kristallnacht',
    name: 'Kristallnacht (Night of Broken Glass)',
    domain: 'history',
    approxYear: 1938,
    eras: ['worldwars'],
    lat: 52.52,
    lng: 13.4,
    summary:
      'On the nights of 9â€“10 November 1938, Nazi stormtroopers and civilians across Germany and Austria attacked Jewish homes, businesses, and synagogues in a coordinated pogrom: over 7,500 Jewish-owned shops were destroyed, 1,400 synagogues burned, and at least 91 Jews killed, while 30,000 were arrested and sent to concentration camps. The name refers to the shards of broken glass that littered streets. Kristallnacht is widely seen as the decisive public escalation from legal discrimination to open violence against Jews.',
    wikipedia: 'https://en.wikipedia.org/wiki/Kristallnacht',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'During Kristallnacht in November 1938, over ____ Jewish-owned shops were destroyed and 30,000 Jews arrested.',
        answer: '7,500',
      },
      {
        format: 'contrast',
        prompt: 'Why is Kristallnacht considered a turning point in Nazi antisemitism?',
        answer: 'It marked the shift from legal discrimination to open, coordinated physical violence against Jews',
        distractors: [
          'It was the first time the Nazi government officially acknowledged antisemitic policy',
          'It resulted in international sanctions that isolated Germany',
          'It triggered the first mass Jewish emigration from Germany',
        ],
      },
    ],
    edges: [
      { to: 'nuremberg-laws', relation: 'contemporary_of' },
      { to: 'the-holocaust', relation: 'caused' },
      { to: 'rise-of-hitler', relation: 'part_of' },
    ],
  },

  {
    id: 'mussolini-italian-fascism',
    name: 'Mussolini & Italian Fascism',
    domain: 'history',
    approxYear: 1922,
    eras: ['worldwars'],
    lat: 41.9,
    lng: 12.5,
    summary:
      'Benito Mussolini founded the Fascist movement in Italy in 1919, pioneering a form of ultranationalist authoritarian politics â€” the word "fascism" derives from the Italian fasces â€” that combined violent squadrismo street militias with a populist rejection of both liberal democracy and communism. His March on Rome in October 1922 convinced King Victor Emmanuel III to appoint him Prime Minister; by 1925 he had dismantled parliamentary government and declared himself Il Duce ("The Leader"). Italy under Mussolini invaded Ethiopia (1935) and Albania (1939) and became Germany\'s Axis partner.',
    wikipedia: 'https://en.wikipedia.org/wiki/Benito_Mussolini',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Mussolini declared himself Il Duce and dismantled Italian parliamentary government by ____.',
        answer: '1925',
      },
      {
        format: 'contrast',
        prompt: 'What did Italian Fascism claim to offer that distinguished it from both liberalism and communism?',
        answer: 'A third way â€” ultranationalist, authoritarian, and rejecting class conflict in favour of national unity',
        distractors: [
          'A return to the Roman Republic\'s constitutional traditions',
          'A mixed economy with strong workers\' rights under state guidance',
          'Democratic governance guided by a technocratic elite',
        ],
      },
    ],
    edges: [
      { to: 'march-on-rome', relation: 'contemporary_of' },
      { to: 'franco-spanish-civil-war', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'march-on-rome',
    name: 'March on Rome',
    domain: 'history',
    approxYear: 1922,
    eras: ['worldwars'],
    lat: 41.9,
    lng: 12.5,
    summary:
      'On 28 October 1922, tens of thousands of Italian Fascist Blackshirts converged on Rome in a show of force while Mussolini waited in Milan. Faced with the choice of signing a martial law decree or negotiating, King Victor Emmanuel III refused to sign and instead invited Mussolini to form a government, handing power to the Fascists without a shot being fired. The "march" was largely theatrical â€” Mussolini arrived by train â€” but became a founding myth of Fascism and inspired imitators across Europe.',
    wikipedia: 'https://en.wikipedia.org/wiki/March_on_Rome',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'During the March on Rome in October 1922, King Victor Emmanuel III refused to sign a martial law decree and instead invited Mussolini to form a ____.',
        answer: 'government',
      },
      {
        format: 'contrast',
        prompt: 'How did Mussolini himself arrive in Rome during the "March on Rome"?',
        answer: 'By train from Milan â€” the march was largely theatrical',
        distractors: [
          'At the head of a column of Blackshirts on horseback',
          'In an armoured vehicle provided by the Italian army',
          'By aeroplane, having coordinated the march remotely',
        ],
      },
    ],
    edges: [{ to: 'mussolini-italian-fascism', relation: 'part_of' }],
  },

  {
    id: 'franco-spanish-civil-war',
    name: 'Franco & the Spanish Civil War',
    domain: 'history',
    approxYear: 1936,
    eras: ['worldwars'],
    lat: 40.42,
    lng: -3.7,
    summary:
      'Spain\'s elected Republican government was challenged by a military coup in July 1936 led by General Francisco Franco, sparking a three-year civil war that became a proxy conflict between the world\'s ideological blocs: Germany and Italy supplied Franco\'s Nationalists with troops and weapons, while Soviet-backed International Brigades fought for the Republic. Franco\'s forces won in April 1939, establishing a dictatorship that lasted until his death in 1975. The war killed an estimated 500,000 people and served as a brutal proving ground for WWII weapons and tactics.',
    wikipedia: 'https://en.wikipedia.org/wiki/Spanish_Civil_War',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Spanish Civil War (1936â€“1939) served as a proving ground for WWII tactics, with Germany and Italy supporting Franco\'s ____ forces.',
        answer: 'Nationalist',
      },
      {
        format: 'contrast',
        prompt: 'Who fought on behalf of the Spanish Republic in the Civil War?',
        answer: 'Soviet-backed International Brigades of foreign volunteers',
        distractors: [
          'British and French regular army units',
          'American expeditionary forces under League of Nations mandate',
          'Turkish and Greek mercenary battalions',
        ],
      },
    ],
    edges: [
      { to: 'guernica', relation: 'contemporary_of' },
      { to: 'mussolini-italian-fascism', relation: 'contemporary_of' },
      { to: 'rise-of-hitler', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'guernica',
    name: 'Bombing of Guernica & Picasso\'s Response',
    domain: 'history',
    approxYear: 1937,
    eras: ['worldwars'],
    lat: 43.31,
    lng: -2.68,
    summary:
      'On 26 April 1937, Nazi Germany\'s Condor Legion and Fascist Italy\'s Aviazione Legionaria carpet-bombed the Basque market town of Guernica on behalf of Franco\'s Nationalists, killing an estimated 150â€“1,600 civilians in a deliberate experiment in terror bombing. Pablo Picasso, then living in Paris, responded with his monumental canvas Guernica (1937) â€” a fractured black-and-white tableau of anguished figures that became one of the most powerful anti-war artworks in history. The painting toured the world and raised awareness of the attack while the Nationalists first denied it had occurred.',
    wikipedia: 'https://en.wikipedia.org/wiki/Bombing_of_Guernica',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Picasso painted ____ in 1937 in response to the Nazi and Italian bombing of the Basque town of Guernica.',
        answer: 'Guernica',
      },
      {
        format: 'contrast',
        prompt: 'Why was the 1937 bombing of Guernica strategically significant beyond its civilian casualties?',
        answer: 'It was a deliberate experiment in terror bombing that previewed WWII aerial tactics',
        distractors: [
          'It destroyed a key railway junction supplying Republican forces',
          'It demonstrated the inadequacy of anti-aircraft defences',
          'It provoked France to supply the Republic with warplanes',
        ],
      },
    ],
    edges: [{ to: 'franco-spanish-civil-war', relation: 'part_of' }],
  },

  {
    id: 'japanese-empire-manchuria',
    name: 'Japanese Empire & the Manchuria Invasion',
    domain: 'history',
    approxYear: 1931,
    eras: ['worldwars'],
    lat: 43.0,
    lng: 125.0,
    summary:
      'On 18 September 1931, the Japanese Kwantung Army staged the Mukden Incident â€” blowing up a section of its own railway as a pretext â€” and invaded the northeastern Chinese region of Manchuria within months, establishing the puppet state of Manchukuo. Japan\'s League of Nations membership meant nothing: when the League condemned the invasion, Japan simply withdrew from it in 1933. The easy conquest encouraged further Japanese expansionism and demonstrated that collective security through the League was hollow.',
    wikipedia: 'https://en.wikipedia.org/wiki/Japanese_invasion_of_Manchuria',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Japan used the staged ____ Incident in 1931 as a pretext to invade Manchuria and establish the puppet state of Manchukuo.',
        answer: 'Mukden',
      },
      {
        format: 'contrast',
        prompt: 'What did Japan do when the League of Nations condemned its invasion of Manchuria?',
        answer: 'It withdrew from the League of Nations in 1933',
        distractors: [
          'It offered financial reparations to China',
          'It accepted a League-supervised ceasefire',
          'It returned Manchuria in exchange for trade concessions',
        ],
      },
    ],
    edges: [
      { to: 'league-of-nations-failure', relation: 'contemporary_of' },
      { to: 'nanking-massacre', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'league-of-nations-failure',
    name: 'League of Nations Failure',
    domain: 'history',
    approxYear: 1935,
    eras: ['worldwars'],
    lat: 46.2,
    lng: 6.15,
    summary:
      'The League of Nations, founded in 1920 as the centrepiece of Woodrow Wilson\'s post-WWI order, collapsed under the weight of critical flaws: the US Senate never ratified membership, so the world\'s largest economy was absent from the start; unanimity rules gave any member a veto; and the League had no independent military force to enforce its decisions. Its failure to stop Japanese aggression in Manchuria (1931) and Italian invasion of Ethiopia (1935) demonstrated that it could not deter determined aggressors, clearing the path to WWII.',
    wikipedia: 'https://en.wikipedia.org/wiki/League_of_Nations',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The League of Nations lacked teeth partly because the US Senate refused to ratify membership, meaning the world\'s largest ____ was absent from the start.',
        answer: 'economy',
      },
      {
        format: 'contrast',
        prompt: 'Which two acts of aggression most clearly demonstrated the League of Nations\' impotence in the 1930s?',
        answer: 'Japan\'s invasion of Manchuria (1931) and Italy\'s invasion of Ethiopia (1935)',
        distractors: [
          'Germany\'s rearmament (1935) and remilitarisation of the Rhineland (1936)',
          'Spain\'s civil war (1936) and the Anschluss with Austria (1938)',
          'The Sudeten crisis (1938) and invasion of Poland (1939)',
        ],
      },
    ],
    edges: [
      { to: 'japanese-empire-manchuria', relation: 'contemporary_of' },
      { to: 'appeasement-munich', relation: 'contemporary_of' },
      { to: 'united-nations', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'appeasement-munich',
    name: 'Appeasement & the Munich Agreement 1938',
    domain: 'history',
    approxYear: 1938,
    eras: ['worldwars'],
    lat: 48.14,
    lng: 11.58,
    summary:
      'At the Munich Conference on 29â€“30 September 1938, British Prime Minister Neville Chamberlain and French Premier Ã‰douard Daladier agreed to hand Czechoslovakia\'s Sudetenland to Hitler in exchange for his promise of no further territorial demands. Chamberlain returned to London declaring "peace for our time"; within six months Hitler had seized the rest of Czechoslovakia, making appeasement synonymous with the catastrophic failure of accommodating dictators. The episode became the defining cautionary tale of modern foreign policy.',
    wikipedia: 'https://en.wikipedia.org/wiki/Munich_Agreement',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Neville Chamberlain returned from Munich in 1938 declaring "peace for our time" after ceding Czechoslovakia\'s ____ to Hitler.',
        answer: 'Sudetenland',
      },
      {
        format: 'contrast',
        prompt: 'How quickly did Hitler break the Munich Agreement?',
        answer: 'Within six months, seizing the rest of Czechoslovakia in March 1939',
        distractors: [
          'He never formally broke it â€” Czechoslovakia dissolved voluntarily',
          'After two years, when he invaded Poland in September 1939',
          'Immediately, by beginning German troop movements within weeks',
        ],
      },
    ],
    edges: [
      { to: 'rise-of-hitler', relation: 'contemporary_of' },
      { to: 'molotov-ribbentrop-pact', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'caused' },
    ],
  },

  {
    id: 'molotov-ribbentrop-pact',
    name: 'Molotov-Ribbentrop Pact',
    domain: 'history',
    approxYear: 1939,
    eras: ['worldwars'],
    summary:
      'Signed on 23 August 1939 between Nazi Germany and the Soviet Union â€” two ideological enemies â€” the pact guaranteed Soviet neutrality if Germany went to war with the West, freeing Hitler to invade Poland without a two-front war. Its secret protocol divided Eastern Europe into German and Soviet spheres of influence, assigning Poland, the Baltic states, and Finland to the Soviets. The pact shocked the world and enabled WWII to begin; Hitler broke it on 22 June 1941 by launching Operation Barbarossa.',
    wikipedia: 'https://en.wikipedia.org/wiki/Molotov%E2%80%93Ribbentrop_Pact',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Molotov-Ribbentrop Pact of August 1939 contained a secret protocol dividing Eastern Europe into German and Soviet spheres, including assigning ____ to the Soviet sphere.',
        answer: 'the Baltic states',
      },
      {
        format: 'contrast',
        prompt: 'When did Hitler break the Molotov-Ribbentrop Pact?',
        answer: '22 June 1941, when Germany launched Operation Barbarossa against the USSR',
        distractors: [
          'In September 1939, when Germany invaded the Soviet-sphere portion of Poland',
          'In June 1940, when France fell and Germany no longer needed Soviet neutrality',
          'In December 1941, after the US entered the war',
        ],
      },
    ],
    edges: [
      { to: 'rise-of-hitler', relation: 'contemporary_of' },
      { to: 'operation-barbarossa', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'caused' },
    ],
  },

  {
    id: 'stalins-collectivisation',
    name: 'Stalin\'s Collectivisation',
    domain: 'history',
    approxYear: 1930,
    eras: ['worldwars'],
    lat: 55.75,
    lng: 37.62,
    summary:
      'From 1929, Stalin forced Soviet peasants to abandon their private farms and join state-controlled collective farms (kolkhozy) in a campaign to industrialise agriculture and extract grain surpluses to fund rapid industrialisation. Kulaks (prosperous peasants) who resisted were killed, deported to gulags, or had their property seized; millions of peasants slaughtered livestock rather than hand them over. The resulting disruption of agriculture caused famines across the USSR, most catastrophically the Holodomor in Ukraine.',
    wikipedia: 'https://en.wikipedia.org/wiki/Collectivization_in_the_Soviet_Union',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Stalin\'s collectivisation campaign forced Soviet peasants onto state-controlled collective farms called ____.',
        answer: 'kolkhozy',
      },
      {
        format: 'contrast',
        prompt: 'What did many Soviet peasants do rather than surrender their livestock to collective farms?',
        answer: 'Slaughter the animals',
        distractors: [
          'Hide livestock in forests and return for them later',
          'Sell them on black markets to urban traders',
          'Transport herds to Poland or Romania across the border',
        ],
      },
    ],
    edges: [
      { to: 'holodomor', relation: 'caused' },
      { to: 'soviet-gulags', relation: 'contemporary_of' },
      { to: 'formation-of-ussr', relation: 'part_of' },
    ],
  },

  {
    id: 'soviet-gulags',
    name: 'Soviet Gulag System',
    domain: 'history',
    approxYear: 1930,
    eras: ['worldwars'],
    lat: 64.0,
    lng: 100.0,
    summary:
      'The Gulag â€” Main Administration of Camps â€” was the Soviet system of forced labour camps that incarcerated millions of political prisoners, criminals, and ethnic minorities, particularly from the late 1920s through Stalin\'s death in 1953. During the Great Terror of 1936â€“1938, around 750,000 people were shot and over a million sent to camps on fabricated charges. Aleksandr Solzhenitsyn\'s The Gulag Archipelago (1973) exposed the system to the wider world; historians estimate 18 million people passed through the camps, with 1.5â€“1.8 million dying there.',
    wikipedia: 'https://en.wikipedia.org/wiki/Gulag',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Gulag system peaked during Stalin\'s Great Terror of 1936â€“1938, when around ____ people were shot and over a million sent to camps.',
        answer: '750,000',
      },
      {
        format: 'contrast',
        prompt: 'Which author\'s work first exposed the Gulag to worldwide attention?',
        answer: 'Aleksandr Solzhenitsyn in The Gulag Archipelago (1973)',
        distractors: [
          'George Orwell in Nineteen Eighty-Four (1949)',
          'Arthur Koestler in Darkness at Noon (1940)',
          'Boris Pasternak in Doctor Zhivago (1957)',
        ],
      },
    ],
    edges: [
      { to: 'stalins-collectivisation', relation: 'contemporary_of' },
      { to: 'holodomor', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'holodomor',
    name: 'Holodomor (Ukrainian Famine 1932â€“33)',
    domain: 'history',
    approxYear: 1933,
    eras: ['worldwars'],
    lat: 49.0,
    lng: 32.0,
    summary:
      'The Holodomor ("death by hunger") was a man-made famine in Soviet Ukraine in 1932â€“1933 that killed an estimated 3.5â€“7.5 million Ukrainians. The Soviet state extracted grain quotas from Ukraine even as starvation spread, banned internal movement to prevent peasants from seeking food, and blacklisted non-compliant villages from receiving any goods. Many countries and historians classify the Holodomor as a genocide deliberately targeting Ukrainians; Russia continues to dispute this. It remains a defining trauma of Ukrainian national identity.',
    wikipedia: 'https://en.wikipedia.org/wiki/Holodomor',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Holodomor killed an estimated 3.5â€“7.5 million Ukrainians in 1932â€“33, while the Soviet state continued to extract ____ quotas from Ukraine.',
        answer: 'grain',
      },
      {
        format: 'contrast',
        prompt: 'Why do many historians classify the Holodomor as genocide rather than mere famine mismanagement?',
        answer: 'The Soviet state deliberately extracted grain, restricted movement, and blacklisted villages even as people starved, targeting Ukrainians specifically',
        distractors: [
          'A Soviet document explicitly ordering the extermination of Ukrainians was discovered',
          'Death rates in Ukraine were identical to those in Kazakhstan, proving deliberate targeting',
          'Soviet officials publicly stated the goal was to destroy Ukrainian culture',
        ],
      },
    ],
    edges: [
      { to: 'stalins-collectivisation', relation: 'influenced_by' },
      { to: 'soviet-gulags', relation: 'contemporary_of' },
    ],
  },

  // â”€â”€ WWII BATTLES & EVENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'blitzkrieg',
    name: 'Blitzkrieg',
    domain: 'history',
    approxYear: 1939,
    eras: ['worldwars'],
    summary:
      'Blitzkrieg ("lightning war") was a German military doctrine combining fast-moving armoured tank columns, motorised infantry, and close air support to break through enemy lines and encircle forces before they could regroup â€” abandoning WWI\'s static attrition for rapid manoeuvre. Debuted in Poland (1939), it was perfected in France (1940) and initially devastating in the Soviet Union (1941). The approach depended on shock, speed, and radio coordination; it faltered when opponents adapted and supply lines stretched.',
    wikipedia: 'https://en.wikipedia.org/wiki/Blitzkrieg',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Blitzkrieg combined fast ____ columns, motorised infantry, and close air support to encircle enemy forces before they could regroup.',
        answer: 'armoured',
      },
      {
        format: 'contrast',
        prompt: 'Against which country was Blitzkrieg first used in WWII?',
        answer: 'Poland in September 1939',
        distractors: ['France in May 1940', 'Denmark in April 1940', 'Norway in April 1940'],
      },
    ],
    edges: [
      { to: 'fall-of-france', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'part_of' },
    ],
  },

  {
    id: 'fall-of-france',
    name: 'Fall of France 1940',
    domain: 'history',
    approxYear: 1940,
    eras: ['worldwars'],
    lat: 48.85,
    lng: 2.35,
    summary:
      'In just six weeks (Mayâ€“June 1940), Germany conquered France and the Low Countries â€” a campaign that stunned the world, as France was expected to hold. German armour bypassed the Maginot Line by driving through the Ardennes Forest, which French planners had considered impassable; the resulting encirclement trapped Allied forces on the Channel coast, leading to the Dunkirk evacuation. France signed an armistice on 22 June 1940 and was divided into German-occupied north and the collaborationist Vichy France in the south.',
    wikipedia: 'https://en.wikipedia.org/wiki/Battle_of_France',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Germany bypassed France\'s Maginot Line in 1940 by driving armour through the ____ Forest, which planners had considered impassable.',
        answer: 'Ardennes',
      },
      {
        format: 'contrast',
        prompt: 'How long did it take Germany to conquer France in 1940?',
        answer: 'About six weeks',
        distractors: ['Six months', 'Three months', 'Eighteen days'],
      },
    ],
    edges: [
      { to: 'dunkirk-evacuation', relation: 'contemporary_of' },
      { to: 'blitzkrieg', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'part_of' },
    ],
  },

  {
    id: 'dunkirk-evacuation',
    name: 'Dunkirk Evacuation',
    domain: 'history',
    approxYear: 1940,
    eras: ['worldwars'],
    lat: 51.04,
    lng: 2.38,
    summary:
      'Between 26 May and 4 June 1940, Operation Dynamo evacuated 338,226 Allied soldiers â€” mostly British â€” from the beaches of Dunkirk in northern France, using a fleet of naval vessels and hundreds of civilian "little ships" ranging from paddle steamers to fishing boats. German forces had them pinned against the sea; Hitler\'s halt order gave the Allies a crucial respite. Churchill called it "a miracle of deliverance" but warned it was a defeat, not a victory; the rescued army would fight again, reconstituting the force that would invade Normandy four years later.',
    wikipedia: 'https://en.wikipedia.org/wiki/Dunkirk_evacuation',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Dunkirk evacuation (Operation Dynamo) rescued ____ Allied soldiers from the beaches of northern France between May and June 1940.',
        answer: '338,226',
      },
      {
        format: 'contrast',
        prompt: 'What enabled the Dunkirk evacuation to succeed despite German pressure?',
        answer: 'Hitler\'s controversial halt order, which paused the German armoured advance for three days',
        distractors: [
          'A massive RAF air cover operation that destroyed the Luftwaffe',
          'French forces successfully counter-attacked and broke the German encirclement',
          'A naval blockade prevented German U-boats from intercepting evacuation ships',
        ],
      },
    ],
    edges: [
      { to: 'fall-of-france', relation: 'part_of' },
      { to: 'battle-of-britain', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'battle-of-britain',
    name: 'Battle of Britain',
    domain: 'history',
    approxYear: 1940,
    eras: ['worldwars'],
    lat: 51.5,
    lng: -0.12,
    summary:
      'From July to October 1940, the Luftwaffe waged an air campaign against Britain to establish air superiority as a prelude to invasion (Operation Sea Lion). RAF Fighter Command, guided by radar and the Dowding System of coordinated control, repelled waves of German bombers and fighters despite being outnumbered; the Luftwaffe\'s shift from bombing airfields to bombing London (the Blitz) in September gave the RAF time to recover. Churchill immortalised the pilots: "Never in the field of human conflict was so much owed by so many to so few."',
    wikipedia: 'https://en.wikipedia.org/wiki/Battle_of_Britain',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Churchill called RAF pilots "the ____" â€” "Never was so much owed by so many to so few" â€” after the Battle of Britain.',
        answer: 'Few',
      },
      {
        format: 'contrast',
        prompt: 'What gave the RAF crucial recovery time during the Battle of Britain?',
        answer: 'The Luftwaffe\'s switch from bombing airfields to bombing London in September 1940',
        distractors: [
          'American volunteer pilots joining the RAF in large numbers',
          'A storm in the English Channel that grounded the Luftwaffe for two weeks',
          'The capture of German radar codes that allowed anticipating every raid',
        ],
      },
    ],
    edges: [
      { to: 'dunkirk-evacuation', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'part_of' },
    ],
  },

  {
    id: 'operation-barbarossa',
    name: 'Operation Barbarossa',
    domain: 'history',
    approxYear: 1941,
    eras: ['worldwars'],
    lat: 52.0,
    lng: 32.0,
    summary:
      'On 22 June 1941, Germany launched the largest land invasion in history, sending 3.8 million Axis troops into the Soviet Union across a 2,900-kilometre front. The initial advance was devastating, encircling and capturing millions of Red Army soldiers within weeks. But German planners had assumed a six-week campaign; instead, Soviet resistance, supply-line overextension, and the brutal Russian winter stalled the Wehrmacht outside Moscow by December 1941. The Eastern Front would consume over half of Germany\'s military effort and become the war\'s decisive theatre.',
    wikipedia: 'https://en.wikipedia.org/wiki/Operation_Barbarossa',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Operation Barbarossa on 22 June 1941 sent 3.8 million Axis troops into the USSR across a ____ kilometre front.',
        answer: '2,900',
      },
      {
        format: 'contrast',
        prompt: 'Why did Operation Barbarossa fail to achieve its planned rapid victory?',
        answer: 'Soviet resistance, overextended supply lines, and the Russian winter combined to halt the advance outside Moscow',
        distractors: [
          'US military aid airlifted to Moscow reversed the balance of forces in weeks',
          'Germany diverted forces to North Africa before the campaign could conclude',
          'Poor German intelligence meant the attack came weeks after Soviet forces had repositioned',
        ],
      },
    ],
    edges: [
      { to: 'molotov-ribbentrop-pact', relation: 'contemporary_of' },
      { to: 'siege-of-leningrad', relation: 'contemporary_of' },
      { to: 'battle-of-stalingrad', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'part_of' },
    ],
  },

  {
    id: 'siege-of-leningrad',
    name: 'Siege of Leningrad',
    domain: 'history',
    approxYear: 1941,
    eras: ['worldwars'],
    lat: 59.93,
    lng: 30.32,
    summary:
      'German and Finnish forces besieged Leningrad (modern St Petersburg) for 872 days from September 1941 to January 1944 â€” the longest and most destructive siege in modern history. An estimated 800,000 to 1 million civilians died, primarily from starvation, as the city survived on rations that fell to as little as 125 grams of bread per day in winter 1941. The only supply line was the "Road of Life" across frozen Lake Ladoga. The city held out, becoming a symbol of Soviet resistance.',
    wikipedia: 'https://en.wikipedia.org/wiki/Siege_of_Leningrad',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'At the siege\'s worst point in winter 1941, Leningrad civilians survived on as little as ____ grams of bread per day.',
        answer: '125',
      },
      {
        format: 'contrast',
        prompt: 'How long did the Siege of Leningrad last?',
        answer: '872 days, from September 1941 to January 1944',
        distractors: ['180 days', 'Over three years (1941â€“1945)', '400 days'],
      },
    ],
    edges: [
      { to: 'operation-barbarossa', relation: 'part_of' },
      { to: 'battle-of-stalingrad', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'battle-of-stalingrad',
    name: 'Battle of Stalingrad',
    domain: 'history',
    approxYear: 1942,
    eras: ['worldwars'],
    lat: 48.7,
    lng: 44.5,
    summary:
      'The Battle of Stalingrad (August 1942 â€“ February 1943) was the largest and bloodiest battle in history, with an estimated 1.8â€“2 million total casualties. German forces fought street-by-street and floor-by-floor for the city on the Volga; Soviet General Zhukov\'s Operation Uranus encircled the entire German 6th Army in November 1942. Field Marshal Paulus surrendered with 91,000 remaining men on 2 February 1943 â€” the first German Field Marshal ever to surrender â€” marking the war\'s psychological turning point on the Eastern Front.',
    wikipedia: 'https://en.wikipedia.org/wiki/Battle_of_Stalingrad',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Soviet Operation Uranus in November 1942 encircled the German ____ Army at Stalingrad, leading to its surrender in February 1943.',
        answer: '6th',
      },
      {
        format: 'contrast',
        prompt: 'Why was the German surrender at Stalingrad psychologically significant?',
        answer: 'Paulus became the first German Field Marshal ever to surrender, shattering the myth of inevitable German victory',
        distractors: [
          'It was the first time Germany had lost a major city since WWI',
          'Hitler personally ordered the retreat, publicly admitting defeat for the first time',
          'The loss directly caused German allies Italy and Hungary to switch sides',
        ],
      },
    ],
    edges: [
      { to: 'operation-barbarossa', relation: 'part_of' },
      { to: 'siege-of-leningrad', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'part_of' },
    ],
  },

  {
    id: 'd-day-normandy',
    name: 'D-Day: Normandy Landings',
    domain: 'history',
    approxYear: 1944,
    eras: ['worldwars'],
    lat: 49.34,
    lng: -0.67,
    summary:
      'On 6 June 1944 (D-Day), Operation Overlord landed 156,000 Allied troops on five Normandy beaches â€” codenamed Utah, Omaha, Gold, Juno, and Sword â€” in the largest seaborne invasion in history. The deception operation Fortitude had convinced Germany the main attack would come at Pas-de-Calais; nevertheless, American troops at Omaha Beach suffered around 2,000 casualties in a few hours of hell against heavily fortified positions. The successful landing opened the long-awaited second front in Western Europe and set in motion the liberation of France.',
    wikipedia: 'https://en.wikipedia.org/wiki/Normandy_landings',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The D-Day landings on 6 June 1944 used five Normandy beaches codenamed Utah, Omaha, Gold, Juno, and ____.',
        answer: 'Sword',
      },
      {
        format: 'contrast',
        prompt: 'How did the Allies mislead Germany about the location of the main D-Day invasion?',
        answer: 'Operation Fortitude convinced Germany the main attack would come at Pas-de-Calais',
        distractors: [
          'Double agents leaked false plans suggesting a Scandinavian landing',
          'A dummy army group in Scotland simulated preparations for a Norway invasion',
          'The Allies attacked Sicily first to draw German reserves south',
        ],
      },
    ],
    edges: [
      { to: 'liberation-of-paris', relation: 'caused' },
      { to: 'world-war-two', relation: 'part_of' },
    ],
  },

  {
    id: 'liberation-of-paris',
    name: 'Liberation of Paris',
    domain: 'history',
    approxYear: 1944,
    eras: ['worldwars'],
    lat: 48.85,
    lng: 2.35,
    summary:
      'Paris was liberated on 25 August 1944, when Free French Forces under General Leclerc entered the city â€” Eisenhower deliberately allowing French troops to lead in recognition of French national dignity. Hitler had ordered Paris burned rather than surrendered; his garrison commander, General Dietrich von Choltitz, refused and negotiated a peaceful handover instead. De Gaulle\'s triumphant march down the Champs-Ã‰lysÃ©es the following day, amid sniper fire, became one of WWII\'s defining images.',
    wikipedia: 'https://en.wikipedia.org/wiki/Liberation_of_Paris',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Paris was liberated on 25 August 1944, with Free French Forces deliberately allowed to lead by General ____.',
        answer: 'Eisenhower',
      },
      {
        format: 'contrast',
        prompt: 'What was Hitler\'s order for Paris as Allied forces approached, and what actually happened?',
        answer: 'He ordered the city burned; garrison commander von Choltitz refused and negotiated a peaceful handover',
        distractors: [
          'He ordered Paris evacuated; German troops retreated in order before the Allies arrived',
          'He ordered a last stand; fierce fighting destroyed much of the historic centre',
          'He offered Paris as an open city; the Allies accepted and entered without combat',
        ],
      },
    ],
    edges: [
      { to: 'd-day-normandy', relation: 'influenced_by' },
      { to: 'fall-of-france', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'hiroshima-atomic-bomb',
    name: 'Hiroshima Atomic Bomb',
    domain: 'history',
    approxYear: 1945,
    eras: ['worldwars'],
    lat: 34.39,
    lng: 132.45,
    summary:
      'On 6 August 1945, the US B-29 Enola Gay dropped the world\'s first atomic bomb used in combat â€” "Little Boy," a uranium gun-type bomb â€” on the Japanese city of Hiroshima, instantly killing an estimated 70,000â€“80,000 people with a further 60,000â€“80,000 dying from radiation and injuries by year\'s end. The city was chosen because it was a major military headquarters relatively undamaged by conventional bombing, ensuring clear assessment of the bomb\'s effects. The attack shocked Japan and the world, raising existential questions about weapons technology that persist to this day.',
    wikipedia: 'https://en.wikipedia.org/wiki/Atomic_bombings_of_Hiroshima_and_Nagasaki',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The atomic bomb dropped on Hiroshima on 6 August 1945 was codenamed "____" and was a uranium gun-type weapon.',
        answer: 'Little Boy',
      },
      {
        format: 'contrast',
        prompt: 'Why was Hiroshima chosen as the target for the first atomic bomb?',
        answer: 'It was a major military headquarters that had been left relatively intact by conventional bombing, allowing clear assessment of the bomb\'s effects',
        distractors: [
          'It had the largest concentration of Japanese military leaders',
          'It was nearest to the American air bases on Okinawa',
          'It had a large civilian population that would maximise casualties as a deterrent',
        ],
      },
    ],
    edges: [
      { to: 'nagasaki-atomic-bomb', relation: 'contemporary_of' },
      { to: 'nuclear-weapons', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'part_of' },
    ],
  },

  {
    id: 'nagasaki-atomic-bomb',
    name: 'Nagasaki Atomic Bomb',
    domain: 'history',
    approxYear: 1945,
    eras: ['worldwars'],
    lat: 32.74,
    lng: 129.87,
    summary:
      'Three days after Hiroshima, on 9 August 1945, the US B-29 Bockscar dropped "Fat Man" â€” a plutonium implosion bomb â€” on Nagasaki after cloud cover blocked the primary target of Kokura. The bomb killed an estimated 40,000 people instantly, with 60,000â€“80,000 total deaths. Combined with the Soviet declaration of war against Japan on the same day, it convinced Emperor Hirohito to broadcast Japan\'s surrender on 15 August 1945, ending WWII. The two bombings remain the only wartime use of nuclear weapons in history.',
    wikipedia: 'https://en.wikipedia.org/wiki/Atomic_bombings_of_Hiroshima_and_Nagasaki',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Nagasaki bomb "Fat Man" was a plutonium ____ bomb, dropped on 9 August 1945 after cloud cover blocked the primary target.',
        answer: 'implosion',
      },
      {
        format: 'contrast',
        prompt: 'What was the original target of the Nagasaki bombing mission?',
        answer: 'Kokura â€” cloud cover redirected the plane to Nagasaki',
        distractors: ['Tokyo', 'Kyoto', 'Osaka'],
      },
    ],
    edges: [
      { to: 'hiroshima-atomic-bomb', relation: 'contemporary_of' },
      { to: 'nuclear-weapons', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'part_of' },
    ],
  },

  {
    id: 'nuremberg-trials',
    name: 'Nuremberg Trials',
    domain: 'history',
    approxYear: 1945,
    eras: ['worldwars'],
    lat: 49.45,
    lng: 11.08,
    summary:
      'Between November 1945 and October 1946, the International Military Tribunal at Nuremberg tried 24 major Nazi war criminals on charges including crimes against peace, war crimes, and crimes against humanity â€” the latter category being newly codified for the occasion. Twelve defendants were sentenced to death, including GÃ¶ring (who cheated the hangman with a cyanide capsule), and others received prison sentences; three were acquitted. The trials established the principle that individuals bear responsibility for war crimes regardless of orders and laid the foundation for international criminal law.',
    wikipedia: 'https://en.wikipedia.org/wiki/Nuremberg_trials',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Nuremberg Trials introduced "crimes against ____" as a new legal category to prosecute Nazi leaders for the Holocaust.',
        answer: 'humanity',
      },
      {
        format: 'contrast',
        prompt: 'How did Hermann GÃ¶ring avoid being hanged after his Nuremberg death sentence?',
        answer: 'He smuggled a cyanide capsule into his cell and committed suicide the night before his execution',
        distractors: [
          'His sentence was commuted to life imprisonment on appeal',
          'He escaped from the Nuremberg prison facility',
          'He died of a heart attack before the execution date',
        ],
      },
    ],
    edges: [
      { to: 'the-holocaust', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'part_of' },
      { to: 'united-nations', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'nanking-massacre',
    name: 'Nanjing Massacre',
    domain: 'history',
    approxYear: 1937,
    eras: ['worldwars'],
    lat: 32.06,
    lng: 118.79,
    summary:
      'In December 1937 and January 1938, Japanese Imperial Army troops occupied the Chinese capital Nanjing (then romanised as Nanking) and killed an estimated 100,000â€“300,000 civilians and prisoners of war in six weeks of systematic atrocity, while committing mass rape and looting. Chinese and Japanese historians still dispute the death toll, and the event remains a central grievance in Sino-Japanese relations. It stands alongside the Holocaust and the Rwandan Genocide as one of the 20th century\'s most documented mass atrocities.',
    wikipedia: 'https://en.wikipedia.org/wiki/Nanjing_massacre',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'During the Nanjing Massacre of December 1937 â€“ January 1938, Japanese forces killed an estimated 100,000â€“____ civilians and prisoners in six weeks.',
        answer: '300,000',
      },
      {
        format: 'contrast',
        prompt: 'Why does the Nanjing Massacre still affect Sino-Japanese relations today?',
        answer: 'Japan and China dispute the death toll, and some Japanese officials and textbooks have downplayed or denied the atrocity',
        distractors: [
          'Japan has never paid reparations to China for the event',
          'China has built nuclear weapons partly in response to continued Japanese denial',
          'A Japanese court in 2001 declared the massacre a fabrication',
        ],
      },
    ],
    edges: [
      { to: 'japanese-empire-manchuria', relation: 'contemporary_of' },
      { to: 'pearl-harbour', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'pearl-harbour',
    name: 'Attack on Pearl Harbour',
    domain: 'history',
    approxYear: 1941,
    eras: ['worldwars'],
    lat: 21.36,
    lng: -157.97,
    summary:
      'On 7 December 1941, the Imperial Japanese Navy launched a surprise attack on the US naval base at Pearl Harbour, Hawaii, sinking or damaging eight battleships, destroying 188 aircraft, and killing 2,403 Americans in less than two hours. Japan\'s aim was to neutralise the US Pacific Fleet while it seized oil-rich Southeast Asian territories embargoed by American sanctions. Roosevelt called it "a date which will live in infamy"; Congress declared war on Japan the next day, and Germany and Italy declared war on the US four days later, fully globalising WWII.',
    wikipedia: 'https://en.wikipedia.org/wiki/Attack_on_Pearl_Harbor',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Japanese attack on Pearl Harbour on 7 December 1941 killed ____ Americans and drew the US into WWII.',
        answer: '2,403',
      },
      {
        format: 'contrast',
        prompt: 'Why did Japan attack Pearl Harbour instead of a purely military target like Midway?',
        answer: 'To neutralise the US Pacific Fleet, protecting Japan\'s flank while it seized oil-rich Southeast Asian colonies',
        distractors: [
          'Intelligence suggested Midway was too heavily defended',
          'Japan hoped to capture the harbour as a forward base for Pacific operations',
          'The attack was intended as a limited strike to negotiate from strength, not trigger war',
        ],
      },
    ],
    edges: [
      { to: 'pacific-island-hopping', relation: 'contemporary_of' },
      { to: 'hiroshima-atomic-bomb', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'part_of' },
    ],
  },

  {
    id: 'pacific-island-hopping',
    name: 'Pacific Island-Hopping Campaign',
    domain: 'history',
    approxYear: 1943,
    eras: ['worldwars'],
    lat: 10.0,
    lng: 155.0,
    summary:
      'American Admiral Chester Nimitz and General Douglas MacArthur pursued a strategy of "island-hopping" (leapfrogging) across the Pacific from 1943 onward: seizing strategically important islands while bypassing and isolating heavily fortified Japanese strongholds, cutting their supply lines. Battles at Guadalcanal, Tarawa, Iwo Jima, and Okinawa were fought with extraordinary ferocity â€” on Iwo Jima, 6,800 Americans and 18,800 Japanese died for a volcanic island eight square miles in size. The campaign progressively brought B-29 bombers within range of Japan\'s home islands.',
    wikipedia: 'https://en.wikipedia.org/wiki/Pacific_War',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The island-hopping strategy bypassed heavily fortified Japanese positions to ____ their supply lines rather than assault every island.',
        answer: 'cut',
      },
      {
        format: 'contrast',
        prompt: 'Why was capturing the Pacific islands strategically essential beyond the islands themselves?',
        answer: 'They brought B-29 long-range bombers within striking range of Japan\'s home islands',
        distractors: [
          'They contained crucial oil reserves Japan depended on for fuel',
          'They provided anchorages deep enough for aircraft carriers to resupply',
          'They were needed as troop staging areas for the planned invasion of China',
        ],
      },
    ],
    edges: [
      { to: 'pearl-harbour', relation: 'contemporary_of' },
      { to: 'hiroshima-atomic-bomb', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'firebombing-of-dresden',
    name: 'Firebombing of Dresden',
    domain: 'history',
    approxYear: 1945,
    eras: ['worldwars'],
    lat: 51.05,
    lng: 13.74,
    summary:
      'Between 13 and 15 February 1945, British and American bombers dropped nearly 4,000 tonnes of explosives and incendiaries on Dresden, creating a firestorm that destroyed the historic city centre. Casualty estimates range from about 22,700 to 25,000 dead, though early post-war German propaganda claimed 200,000+ â€” a figure later exposed as grossly inflated. The bombing\'s moral legitimacy remains contested: Dresden had military and rail significance, but was crowded with refugees; Kurt Vonnegut, a survivor as a POW, memorialised it in Slaughterhouse-Five.',
    wikipedia: 'https://en.wikipedia.org/wiki/Bombing_of_Dresden_in_World_War_II',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Kurt Vonnegut, a prisoner of war who survived the 1945 firebombing of Dresden, memorialised the event in his novel ____.',
        answer: 'Slaughterhouse-Five',
      },
      {
        format: 'contrast',
        prompt: 'How many people died in the Dresden firebombing according to the most reliable modern estimates?',
        answer: 'Around 22,700â€“25,000',
        distractors: ['Over 200,000', 'Approximately 100,000', 'Fewer than 10,000'],
      },
    ],
    edges: [
      { to: 'battle-of-britain', relation: 'contemporary_of' },
      { to: 'world-war-two', relation: 'part_of' },
    ],
  },

  // â”€â”€ HOLOCAUST DETAIL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'wannsee-conference',
    name: 'Wannsee Conference',
    domain: 'history',
    approxYear: 1942,
    eras: ['worldwars'],
    lat: 52.43,
    lng: 13.16,
    summary:
      'On 20 January 1942, fifteen senior Nazi officials met at a villa on Lake Wannsee in Berlin to coordinate the logistics of the "Final Solution to the Jewish Question" â€” the systematic murder of all Jews under German control. Chaired by Reinhard Heydrich and attended by Adolf Eichmann, the 90-minute meeting did not decide to commit genocide (that decision had already been made) but organised transport, jurisdiction, and killing procedures across occupied Europe. The sole surviving copy of the Wannsee Protocol was discovered in 1947 and remains one of the most chilling bureaucratic documents in history.',
    wikipedia: 'https://en.wikipedia.org/wiki/Wannsee_Conference',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The Wannsee Conference of January 1942 coordinated the logistics of what the Nazis called the "Final Solution to the ____."',
        answer: 'Jewish Question',
      },
      {
        format: 'contrast',
        prompt: 'What did the Wannsee Conference actually decide, versus what had already been decided?',
        answer: 'It coordinated logistics (transport, jurisdiction, procedures); the decision to commit genocide had already been taken',
        distractors: [
          'It authorised the construction of the first death camps in Poland',
          'It was the first meeting where senior Nazis openly discussed the genocide',
          'It set numerical targets for how many Jews each region must kill by year end',
        ],
      },
    ],
    edges: [
      { to: 'the-holocaust', relation: 'part_of' },
      { to: 'auschwitz-birkenau', relation: 'contemporary_of' },
      { to: 'einsatzgruppen', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'auschwitz-birkenau',
    name: 'Auschwitz-Birkenau',
    domain: 'history',
    approxYear: 1942,
    eras: ['worldwars'],
    lat: 50.03,
    lng: 19.2,
    summary:
      'Auschwitz-Birkenau in occupied Poland was the largest Nazi concentration and extermination camp complex, where an estimated 1.1 million people were murdered â€” around 1 million of them Jews â€” primarily by Zyklon B gas in four crematoria-equipped gas chambers. Arriving deportees were subjected to "selections" on the ramp: those deemed fit for forced labour were spared temporarily; the elderly, children, and mothers were sent directly to the gas chambers. Soviet forces liberated the camp on 27 January 1945, a date now commemorated as International Holocaust Remembrance Day.',
    wikipedia: 'https://en.wikipedia.org/wiki/Auschwitz_concentration_camp',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Auschwitz-Birkenau used ____ B gas to murder an estimated 1.1 million people, approximately one million of them Jews.',
        answer: 'Zyklon',
      },
      {
        format: 'contrast',
        prompt: 'What happened to deportees arriving at Auschwitz who were deemed unfit for forced labour?',
        answer: 'They were sent directly to the gas chambers, typically within hours of arrival',
        distractors: [
          'They were housed in a separate section and given lighter work assignments',
          'They were returned to their countries of origin under a prisoner exchange programme',
          'They were held in quarantine and reassessed monthly',
        ],
      },
    ],
    edges: [
      { to: 'the-holocaust', relation: 'part_of' },
      { to: 'wannsee-conference', relation: 'contemporary_of' },
      { to: 'nuremberg-trials', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'einsatzgruppen',
    name: 'Einsatzgruppen (Mobile Killing Units)',
    domain: 'history',
    approxYear: 1941,
    eras: ['worldwars'],
    lat: 50.0,
    lng: 31.0,
    summary:
      'The Einsatzgruppen were SS mobile killing squads that followed the Wehrmacht into the Soviet Union after Operation Barbarossa, murdering Jews, Roma, Soviet officials, and other "undesirables" in mass shootings at sites like Babi Yar, where 33,771 Jews were shot in two days in September 1941. By early 1943 the Einsatzgruppen had murdered an estimated 1.5â€“2 million people, making them perpetrators of some of the Holocaust\'s largest single massacres before the death camps reached full scale. The shootings were meticulously documented by the perpetrators themselves.',
    wikipedia: 'https://en.wikipedia.org/wiki/Einsatzgruppen',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'At Babi Yar in September 1941, Einsatzgruppen murdered ____ Jews in just two days in one of the Holocaust\'s largest mass shootings.',
        answer: '33,771',
      },
      {
        format: 'contrast',
        prompt: 'How did the Einsatzgruppen method of killing differ from that of the death camps?',
        answer: 'They used mass shootings in open pits in the field, rather than industrialised gas chambers at fixed sites',
        distractors: [
          'They used mobile gas vans rather than stationary chambers',
          'They relied on local collaborators rather than SS personnel to carry out killings',
          'They deported victims to camps first, then shot them rather than gassing them',
        ],
      },
    ],
    edges: [
      { to: 'the-holocaust', relation: 'part_of' },
      { to: 'operation-barbarossa', relation: 'contemporary_of' },
      { to: 'wannsee-conference', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'righteous-among-nations',
    name: 'Righteous Among the Nations',
    domain: 'history',
    approxYear: 1942,
    eras: ['worldwars'],
    summary:
      'The title "Righteous Among the Nations" is awarded by Yad Vashem, Israel\'s Holocaust memorial authority, to non-Jews who risked their lives to save Jews during the Holocaust. By 2023 over 28,000 individuals from 51 countries had been honoured, including Oskar Schindler, who saved 1,200 Jews by employing them in his factory, Raoul Wallenberg, a Swedish diplomat who issued protective passports to tens of thousands of Hungarian Jews, and Irena Sendler, a Polish nurse who smuggled 2,500 children out of the Warsaw Ghetto.',
    wikipedia: 'https://en.wikipedia.org/wiki/Righteous_Among_the_Nations',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'The title "Righteous Among the Nations" is awarded by Yad Vashem to non-Jews who risked their lives to save Jews; over ____ individuals had been honoured by 2023.',
        answer: '28,000',
      },
      {
        format: 'contrast',
        prompt: 'What did Raoul Wallenberg do to save Jews during the Holocaust?',
        answer: 'As a Swedish diplomat in Hungary, he issued protective passports to tens of thousands of Jews facing deportation',
        distractors: [
          'He employed Jewish workers in his factory to prevent their deportation',
          'He smuggled children out of the Warsaw Ghetto through the city\'s sewer system',
          'He forged German military documents authorising the release of prisoners from Auschwitz',
        ],
      },
    ],
    edges: [
      { to: 'the-holocaust', relation: 'contemporary_of' },
      { to: 'anne-frank', relation: 'contemporary_of' },
    ],
  },

  {
    id: 'anne-frank',
    name: 'Anne Frank',
    domain: 'history',
    approxYear: 1944,
    eras: ['worldwars'],
    lat: 52.37,
    lng: 4.88,
    summary:
      'Anne Frank was a German-Jewish girl who hid with her family in a secret annex at 263 Prinsengracht in Amsterdam for over two years (July 1942 â€“ August 1944), where she kept a diary that became one of the most-read accounts of the Holocaust. Betrayed to the Gestapo in August 1944, she was transported first to Auschwitz and then Bergen-Belsen, where she died of typhus in February or March 1945 â€” just weeks before the camp was liberated. Her father Otto, the only family member to survive, published her diary in 1947.',
    wikipedia: 'https://en.wikipedia.org/wiki/Anne_Frank',
    imageUrl: null,
    questions: [
      {
        format: 'cloze',
        prompt:
          'Anne Frank hid with her family in a secret annex in Amsterdam for over two years before being betrayed to the ____ in August 1944.',
        answer: 'Gestapo',
      },
      {
        format: 'contrast',
        prompt: 'When did Anne Frank die, and what is striking about the timing?',
        answer: 'She died of typhus at Bergen-Belsen in February or March 1945, just weeks before the camp was liberated',
        distractors: [
          'She was executed at Auschwitz in January 1945, the same week Soviet forces arrived',
          'She died during the deportation transport from Amsterdam to Auschwitz in 1944',
          'She survived the war but died of illness in Amsterdam in 1946',
        ],
      },
    ],
    edges: [
      { to: 'the-holocaust', relation: 'part_of' },
      { to: 'righteous-among-nations', relation: 'contemporary_of' },
      { to: 'auschwitz-birkenau', relation: 'contemporary_of' },
    ],
  },
]
