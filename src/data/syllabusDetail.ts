// Detailed syllabus points sourced from the official UPSC CSE notification (Section-III).
// Keys map to SyllabusTopic ids in src/data/mock.ts.

export type SyllabusDetail = {
  paperRef: string;   // e.g. "Mains GS-I · Paper II"
  points: string[];
};

export const syllabusDetail: Record<string, SyllabusDetail> = {
  // ================= GS PAPER I =================
  t1: {
    paperRef: "Prelims Paper I · Mains GS-I",
    points: [
      "History of India and Indian National Movement (Prelims).",
      "Ancient India — sources, prehistoric cultures, Indus Valley, Vedic period, Mahajanapadas.",
      "Mauryan and post-Mauryan polity, economy and society; Gupta age and its cultural efflorescence.",
      "Early medieval India — regional kingdoms, Cholas, Rajputs, temple architecture.",
      "Delhi Sultanate — political history, administration, economy, society and culture.",
      "Mughal Empire — expansion, administration, economic and cultural life; decline.",
      "Bhakti and Sufi movements; syncretic traditions.",
    ],
  },
  t2: {
    paperRef: "Mains GS-I · Paper II",
    points: [
      "Modern Indian history from about the middle of the eighteenth century until the present — significant events, personalities, issues.",
      "The Freedom Struggle — its various stages and important contributors / contributions from different parts of the country.",
      "Post-independence consolidation and reorganization within the country.",
      "British expansion, economic policies and their impact; early uprisings and the Revolt of 1857.",
      "Rise of nationalism — moderates, extremists, revolutionary movements, Gandhian mass movements.",
      "Partition, integration of princely states, linguistic reorganization of states.",
    ],
  },
  t3: {
    paperRef: "Mains GS-I · Paper II",
    points: [
      "Indian culture will cover the salient aspects of Art Forms, Literature and Architecture from ancient to modern times.",
      "Visual arts — painting traditions (Ajanta, Mughal, Rajput, Pahari, Company, modern schools).",
      "Performing arts — classical dance forms, Natyashastra, Hindustani and Carnatic music.",
      "Architecture — rock-cut, temple styles (Nagara, Dravida, Vesara), Indo-Islamic, colonial.",
      "Literature — Sanskrit, Prakrit, Pali, Tamil Sangam, Bhakti-era vernacular, modern Indian literature.",
      "Handicrafts, textiles, and UNESCO tangible / intangible heritage from India.",
    ],
  },
  t4: {
    paperRef: "Mains GS-I · Paper II",
    points: [
      "History of the world will include events from 18th century such as industrial revolution, world wars, redrawal of national boundaries, colonization, decolonization.",
      "Political philosophies — communism, capitalism, socialism etc. — their forms and effect on society.",
      "American and French Revolutions; nationalism and unification movements in Europe.",
      "Colonialism in Asia and Africa; decolonization and the emergence of the Third World.",
      "Cold War, disintegration of the USSR, and the contemporary world order.",
    ],
  },
  t5: {
    paperRef: "Mains GS-I · Paper II",
    points: [
      "Salient features of Indian Society; Diversity of India.",
      "Role of women and women's organization; population and associated issues.",
      "Poverty and developmental issues; urbanization, their problems and their remedies.",
      "Effects of globalization on Indian society.",
      "Social empowerment, communalism, regionalism and secularism.",
    ],
  },
  t6: {
    paperRef: "Prelims Paper I · Mains GS-I",
    points: [
      "Salient features of world's physical geography.",
      "Distribution of key natural resources across the world (incl. South Asia and the Indian subcontinent).",
      "Factors responsible for the location of primary, secondary and tertiary sector industries in various parts of the world (including India).",
      "Important geophysical phenomena such as earthquakes, tsunami, volcanic activity, cyclone etc.",
      "Geographical features and their location — changes in critical geographical features (water-bodies, ice-caps) and in flora and fauna and the effects of such changes.",
      "Indian & world geography — physical, social, economic (Prelims).",
    ],
  },

  // ================= GS PAPER II =================
  t7: {
    paperRef: "Mains GS-II · Paper III",
    points: [
      "Indian Constitution — historical underpinnings, evolution, features, amendments, significant provisions and basic structure.",
      "Functions and responsibilities of the Union and the States; federal structure, devolution of powers and finances up to local levels and challenges.",
      "Separation of powers between various organs; dispute redressal mechanisms and institutions.",
      "Comparison of the Indian constitutional scheme with that of other countries.",
      "Parliament and State Legislatures — structure, functioning, conduct of business, powers & privileges.",
      "Structure, organization and functioning of the Executive and the Judiciary; pressure groups and formal/informal associations.",
      "Salient features of the Representation of People's Act.",
      "Appointment to various Constitutional posts; powers, functions and responsibilities of various Constitutional Bodies.",
      "Statutory, regulatory and various quasi-judicial bodies.",
    ],
  },
  t8: {
    paperRef: "Mains GS-II · Paper III",
    points: [
      "Government policies and interventions for development in various sectors; issues arising out of their design and implementation.",
      "Development processes and the development industry — role of NGOs, SHGs, various groups and associations, donors, charities, institutional and other stakeholders.",
      "Issues relating to development and management of Social Sector / Services relating to Health, Education, Human Resources.",
      "Issues relating to poverty and hunger.",
      "Important aspects of governance, transparency and accountability; e-governance — applications, models, successes, limitations and potential; citizens' charters.",
      "Role of civil services in a democracy.",
    ],
  },
  t9: {
    paperRef: "Mains GS-II · Paper III",
    points: [
      "India and its neighborhood — relations.",
      "Bilateral, regional and global groupings and agreements involving India and/or affecting India's interests.",
      "Effect of policies and politics of developed and developing countries on India's interests; Indian diaspora.",
      "Important International institutions, agencies and fora — their structure, mandate.",
    ],
  },
  t10: {
    paperRef: "Mains GS-II · Paper III",
    points: [
      "Welfare schemes for vulnerable sections of the population by the Centre and States and the performance of these schemes.",
      "Mechanisms, laws, institutions and Bodies constituted for the protection and betterment of these vulnerable sections.",
    ],
  },

  // ================= GS PAPER III =================
  t11: {
    paperRef: "Mains GS-III · Paper IV",
    points: [
      "Indian Economy and issues relating to planning, mobilization of resources, growth, development and employment.",
      "Inclusive growth and issues arising from it.",
      "Government Budgeting.",
      "Major crops — cropping patterns; different types of irrigation and irrigation systems; storage, transport and marketing of agricultural produce; e-technology in the aid of farmers.",
      "Direct and indirect farm subsidies and minimum support prices; PDS — objectives, functioning, limitations, revamping; buffer stocks and food security; Technology missions; economics of animal-rearing.",
      "Food processing and related industries in India — scope and significance, location, upstream and downstream requirements, supply chain management.",
      "Land reforms in India.",
      "Effects of liberalization on the economy; changes in industrial policy and their effects on industrial growth.",
      "Infrastructure: Energy, Ports, Roads, Airports, Railways etc.",
      "Investment models.",
    ],
  },
  t12: {
    paperRef: "Mains GS-III · Paper IV · Prelims",
    points: [
      "Conservation, environmental pollution and degradation, environmental impact assessment.",
      "General issues on Environmental Ecology, Bio-diversity and Climate Change (Prelims — no subject specialization required).",
      "Protected areas, biosphere reserves, wildlife conservation laws.",
      "Climate change negotiations — UNFCCC, Paris Agreement, India's NDCs.",
    ],
  },
  t13: {
    paperRef: "Mains GS-III · Paper IV",
    points: [
      "Science and Technology — developments and their applications and effects in everyday life.",
      "Achievements of Indians in science & technology; indigenization of technology and developing new technology.",
      "Awareness in the fields of IT, Space, Computers, robotics, nano-technology, bio-technology and issues relating to intellectual property rights.",
    ],
  },
  t14: {
    paperRef: "Mains GS-III · Paper IV",
    points: [
      "Linkages between development and spread of extremism.",
      "Role of external state and non-state actors in creating challenges to internal security.",
      "Challenges to internal security through communication networks; role of media and social networking sites; basics of cyber security; money-laundering and its prevention.",
      "Security challenges and their management in border areas; linkages of organized crime with terrorism.",
      "Various Security forces and agencies and their mandate.",
    ],
  },
  t15: {
    paperRef: "Mains GS-III · Paper IV",
    points: [
      "Disaster and disaster management.",
      "Types of disasters — natural and man-made; DM Act 2005; NDMA / SDMA architecture.",
      "Sendai Framework, community-based disaster preparedness, early-warning systems.",
    ],
  },

  // ================= GS PAPER IV =================
  t16: {
    paperRef: "Mains GS-IV · Paper V",
    points: [
      "Ethics and Human Interface: essence, determinants and consequences of Ethics in human actions; dimensions of ethics; ethics in private and public relationships.",
      "Human Values — lessons from the lives and teachings of great leaders, reformers and administrators; role of family, society and educational institutions in inculcating values.",
      "Attitude: content, structure, function; its influence and relation with thought and behaviour; moral and political attitudes; social influence and persuasion.",
      "Emotional intelligence — concepts, and their utilities and application in administration and governance.",
      "Contributions of moral thinkers and philosophers from India and world.",
    ],
  },
  t17: {
    paperRef: "Mains GS-IV · Paper V",
    points: [
      "Case Studies on all the above issues — using the case-study approach to test attitude, integrity and problem-solving.",
      "Typical themes: conflict of interest, whistle-blowing, discretion vs rules, corruption dilemmas, welfare-delivery choices.",
    ],
  },
  t18: {
    paperRef: "Mains GS-IV · Paper V",
    points: [
      "Aptitude and foundational values for Civil Service — integrity, impartiality and non-partisanship, objectivity, dedication to public service, empathy, tolerance and compassion towards weaker sections.",
      "Public / Civil service values and Ethics in Public administration: status and problems; ethical concerns and dilemmas in government and private institutions.",
      "Laws, rules, regulations and conscience as sources of ethical guidance; accountability and ethical governance; strengthening of ethical and moral values in governance.",
      "Ethical issues in international relations and funding; corporate governance.",
      "Probity in Governance: concept of public service; philosophical basis of governance and probity; information sharing and transparency; RTI; codes of ethics; codes of conduct; citizen's charters; work culture; quality of service delivery; utilization of public funds; challenges of corruption.",
    ],
  },
};

// Full paper-level summary shown at the top of each subject dialog.
export const paperOverview: Record<string, string> = {
  gs1: "Indian Heritage & Culture, History and Geography of the World and Society. Tests awareness of India's civilisational continuity, modern history, the freedom struggle, world history from the 18th century, Indian society, and physical & human geography.",
  gs2: "Governance, Constitution, Polity, Social Justice and International Relations. Tests understanding of the Indian constitutional scheme, functioning of institutions, welfare governance, and India's engagement with the world.",
  gs3: "Technology, Economic Development, Bio-diversity, Environment, Security and Disaster Management. Tests analytical grasp of the Indian economy, agriculture, infrastructure, environment, science & technology, internal security and disaster management.",
  gs4: "Ethics, Integrity and Aptitude. Tests attitude and approach to integrity and probity in public life, and problem-solving in conflicts faced by public servants — using the case-study approach.",
};
