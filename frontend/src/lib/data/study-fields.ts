export interface StudyField {
  id: string;
  englishTitle: string;
  greekTitle: string;
  category: string;
}

export const STUDY_FIELDS: StudyField[] = [
  // Computer Science & Technology
  {
    id: 'computer-science',
    englishTitle: 'Computer Science',
    greekTitle: 'Πληροφορική',
    category: 'Technology'
  },
  {
    id: 'software-engineering',
    englishTitle: 'Software Engineering',
    greekTitle: 'Μηχανική Λογισμικού',
    category: 'Technology'
  },
  {
    id: 'information-systems',
    englishTitle: 'Information Systems',
    greekTitle: 'Συστήματα Πληροφοριών',
    category: 'Technology'
  },
  {
    id: 'cybersecurity',
    englishTitle: 'Cybersecurity',
    greekTitle: 'Κυβερνοασφάλεια',
    category: 'Technology'
  },
  {
    id: 'data-science',
    englishTitle: 'Data Science',
    greekTitle: 'Επιστήμη Δεδομένων',
    category: 'Technology'
  },
  {
    id: 'artificial-intelligence',
    englishTitle: 'Artificial Intelligence',
    greekTitle: 'Τεχνητή Νοημοσύνη',
    category: 'Technology'
  },
  
  // Engineering
  {
    id: 'mechanical-engineering',
    englishTitle: 'Mechanical Engineering',
    greekTitle: 'Μηχανολογία',
    category: 'Engineering'
  },
  {
    id: 'electrical-engineering',
    englishTitle: 'Electrical Engineering',
    greekTitle: 'Ηλεκτρολογία',
    category: 'Engineering'
  },
  {
    id: 'civil-engineering',
    englishTitle: 'Civil Engineering',
    greekTitle: 'Πολιτικός Μηχανικός',
    category: 'Engineering'
  },
  {
    id: 'chemical-engineering',
    englishTitle: 'Chemical Engineering',
    greekTitle: 'Χημικός Μηχανικός',
    category: 'Engineering'
  },
  {
    id: 'aerospace-engineering',
    englishTitle: 'Aerospace Engineering',
    greekTitle: 'Αεροναυπηγική',
    category: 'Engineering'
  },
  {
    id: 'biomedical-engineering',
    englishTitle: 'Biomedical Engineering',
    greekTitle: 'Βιοϊατρική Μηχανική',
    category: 'Engineering'
  },
  {
    id: 'environmental-engineering',
    englishTitle: 'Environmental Engineering',
    greekTitle: 'Περιβαλλοντική Μηχανική',
    category: 'Engineering'
  },
  {
    id: 'industrial-engineering',
    englishTitle: 'Industrial Engineering',
    greekTitle: 'Βιομηχανική Μηχανική',
    category: 'Engineering'
  },

  // Business & Economics
  {
    id: 'business-administration',
    englishTitle: 'Business Administration',
    greekTitle: 'Διοίκηση Επιχειρήσεων',
    category: 'Business'
  },
  {
    id: 'economics',
    englishTitle: 'Economics',
    greekTitle: 'Οικονομικά',
    category: 'Business'
  },
  {
    id: 'finance',
    englishTitle: 'Finance',
    greekTitle: 'Χρηματοοικονομικά',
    category: 'Business'
  },
  {
    id: 'marketing',
    englishTitle: 'Marketing',
    greekTitle: 'Μάρκετινγκ',
    category: 'Business'
  },
  {
    id: 'accounting',
    englishTitle: 'Accounting',
    greekTitle: 'Λογιστική',
    category: 'Business'
  },
  {
    id: 'international-business',
    englishTitle: 'International Business',
    greekTitle: 'Διεθνείς Επιχειρήσεις',
    category: 'Business'
  },
  {
    id: 'management',
    englishTitle: 'Management',
    greekTitle: 'Διοίκηση',
    category: 'Business'
  },

  // Medicine & Health Sciences
  {
    id: 'medicine',
    englishTitle: 'Medicine',
    greekTitle: 'Ιατρική',
    category: 'Health Sciences'
  },
  {
    id: 'dentistry',
    englishTitle: 'Dentistry',
    greekTitle: 'Οδοντιατρική',
    category: 'Health Sciences'
  },
  {
    id: 'pharmacy',
    englishTitle: 'Pharmacy',
    greekTitle: 'Φαρμακευτική',
    category: 'Health Sciences'
  },
  {
    id: 'nursing',
    englishTitle: 'Nursing',
    greekTitle: 'Νοσηλευτική',
    category: 'Health Sciences'
  },
  {
    id: 'veterinary-medicine',
    englishTitle: 'Veterinary Medicine',
    greekTitle: 'Κτηνιατρική',
    category: 'Health Sciences'
  },
  {
    id: 'physiotherapy',
    englishTitle: 'Physiotherapy',
    greekTitle: 'Φυσιοθεραπεία',
    category: 'Health Sciences'
  },
  {
    id: 'psychology',
    englishTitle: 'Psychology',
    greekTitle: 'Ψυχολογία',
    category: 'Health Sciences'
  },

  // Natural Sciences
  {
    id: 'mathematics',
    englishTitle: 'Mathematics',
    greekTitle: 'Μαθηματικά',
    category: 'Natural Sciences'
  },
  {
    id: 'physics',
    englishTitle: 'Physics',
    greekTitle: 'Φυσική',
    category: 'Natural Sciences'
  },
  {
    id: 'chemistry',
    englishTitle: 'Chemistry',
    greekTitle: 'Χημεία',
    category: 'Natural Sciences'
  },
  {
    id: 'biology',
    englishTitle: 'Biology',
    greekTitle: 'Βιολογία',
    category: 'Natural Sciences'
  },
  {
    id: 'geology',
    englishTitle: 'Geology',
    greekTitle: 'Γεωλογία',
    category: 'Natural Sciences'
  },
  {
    id: 'environmental-science',
    englishTitle: 'Environmental Science',
    greekTitle: 'Περιβαλλοντικές Επιστήμες',
    category: 'Natural Sciences'
  },

  // Social Sciences
  {
    id: 'law',
    englishTitle: 'Law',
    greekTitle: 'Νομική',
    category: 'Social Sciences'
  },
  {
    id: 'political-science',
    englishTitle: 'Political Science',
    greekTitle: 'Πολιτικές Επιστήμες',
    category: 'Social Sciences'
  },
  {
    id: 'sociology',
    englishTitle: 'Sociology',
    greekTitle: 'Κοινωνιολογία',
    category: 'Social Sciences'
  },
  {
    id: 'international-relations',
    englishTitle: 'International Relations',
    greekTitle: 'Διεθνείς Σχέσεις',
    category: 'Social Sciences'
  },
  {
    id: 'public-administration',
    englishTitle: 'Public Administration',
    greekTitle: 'Δημόσια Διοίκηση',
    category: 'Social Sciences'
  },
  {
    id: 'social-work',
    englishTitle: 'Social Work',
    greekTitle: 'Κοινωνική Εργασία',
    category: 'Social Sciences'
  },

  // Arts & Humanities
  {
    id: 'architecture',
    englishTitle: 'Architecture',
    greekTitle: 'Αρχιτεκτονική',
    category: 'Arts & Design'
  },
  {
    id: 'fine-arts',
    englishTitle: 'Fine Arts',
    greekTitle: 'Καλές Τέχνες',
    category: 'Arts & Design'
  },
  {
    id: 'graphic-design',
    englishTitle: 'Graphic Design',
    greekTitle: 'Γραφιστική',
    category: 'Arts & Design'
  },
  {
    id: 'interior-design',
    englishTitle: 'Interior Design',
    greekTitle: 'Εσωτερική Αρχιτεκτονική',
    category: 'Arts & Design'
  },
  {
    id: 'music',
    englishTitle: 'Music',
    greekTitle: 'Μουσική',
    category: 'Arts & Design'
  },
  {
    id: 'theater',
    englishTitle: 'Theater Arts',
    greekTitle: 'Θεατρικές Σπουδές',
    category: 'Arts & Design'
  },
  {
    id: 'film-studies',
    englishTitle: 'Film Studies',
    greekTitle: 'Κινηματογραφικές Σπουδές',
    category: 'Arts & Design'
  },

  // Humanities
  {
    id: 'history',
    englishTitle: 'History',
    greekTitle: 'Ιστορία',
    category: 'Humanities'
  },
  {
    id: 'philosophy',
    englishTitle: 'Philosophy',
    greekTitle: 'Φιλοσοφία',
    category: 'Humanities'
  },
  {
    id: 'literature',
    englishTitle: 'Literature',
    greekTitle: 'Φιλολογία',
    category: 'Humanities'
  },
  {
    id: 'linguistics',
    englishTitle: 'Linguistics',
    greekTitle: 'Γλωσσολογία',
    category: 'Humanities'
  },
  {
    id: 'archaeology',
    englishTitle: 'Archaeology',
    greekTitle: 'Αρχαιολογία',
    category: 'Humanities'
  },
  {
    id: 'theology',
    englishTitle: 'Theology',
    greekTitle: 'Θεολογία',
    category: 'Humanities'
  },

  // Education
  {
    id: 'education',
    englishTitle: 'Education',
    greekTitle: 'Παιδαγωγικά',
    category: 'Education'
  },
  {
    id: 'early-childhood-education',
    englishTitle: 'Early Childhood Education',
    greekTitle: 'Προσχολική Αγωγή',
    category: 'Education'
  },
  {
    id: 'special-education',
    englishTitle: 'Special Education',
    greekTitle: 'Ειδική Αγωγή',
    category: 'Education'
  },
  {
    id: 'physical-education',
    englishTitle: 'Physical Education',
    greekTitle: 'Φυσική Αγωγή',
    category: 'Education'
  },

  // Communication & Media
  {
    id: 'journalism',
    englishTitle: 'Journalism',
    greekTitle: 'Δημοσιογραφία',
    category: 'Communication'
  },
  {
    id: 'communication-studies',
    englishTitle: 'Communication Studies',
    greekTitle: 'Επικοινωνία και ΜΜΕ',
    category: 'Communication'
  },
  {
    id: 'public-relations',
    englishTitle: 'Public Relations',
    greekTitle: 'Δημόσιες Σχέσεις',
    category: 'Communication'
  },
  {
    id: 'digital-media',
    englishTitle: 'Digital Media',
    greekTitle: 'Ψηφιακά Μέσα',
    category: 'Communication'
  },

  // Agriculture & Food Sciences
  {
    id: 'agriculture',
    englishTitle: 'Agriculture',
    greekTitle: 'Γεωπονία',
    category: 'Agriculture'
  },
  {
    id: 'food-science',
    englishTitle: 'Food Science & Technology',
    greekTitle: 'Επιστήμη και Τεχνολογία Τροφίμων',
    category: 'Agriculture'
  },
  {
    id: 'forestry',
    englishTitle: 'Forestry',
    greekTitle: 'Δασολογία',
    category: 'Agriculture'
  },

  // Tourism & Hospitality
  {
    id: 'tourism-management',
    englishTitle: 'Tourism Management',
    greekTitle: 'Διοίκηση Τουρισμού',
    category: 'Tourism'
  },
  {
    id: 'hospitality-management',
    englishTitle: 'Hospitality Management',
    greekTitle: 'Διοίκηση Φιλοξενίας',
    category: 'Tourism'
  },

  // Other
  {
    id: 'other',
    englishTitle: 'Other',
    greekTitle: 'Άλλο',
    category: 'Other'
  }
];

export const STUDY_CATEGORIES = [
  'Technology',
  'Engineering', 
  'Business',
  'Health Sciences',
  'Natural Sciences',
  'Social Sciences',
  'Arts & Design',
  'Humanities',
  'Education',
  'Communication',
  'Agriculture',
  'Tourism',
  'Other'
]; 