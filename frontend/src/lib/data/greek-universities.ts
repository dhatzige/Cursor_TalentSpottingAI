export interface University {
  id: string;
  name: string;
  nameEn: string;
  type: 'public' | 'private';
  city: string;
  emailDomains: string[];
  website: string;
  established?: number;
}

export const GREEK_UNIVERSITIES: University[] = [
  // Major Public Universities (Πανεπιστήμια)
  {
    id: 'uoa',
    name: 'Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών',
    nameEn: 'National and Kapodistrian University of Athens',
    type: 'public',
    city: 'Athens',
    emailDomains: ['uoa.gr', 'di.uoa.gr', 'med.uoa.gr', 'econ.uoa.gr', 'phys.uoa.gr', 'chem.uoa.gr'],
    website: 'https://en.uoa.gr',
    established: 1837
  },
  {
    id: 'auth',
    name: 'Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης',
    nameEn: 'Aristotle University of Thessaloniki',
    type: 'public',
    city: 'Thessaloniki',
    emailDomains: ['auth.gr', 'csd.auth.gr', 'med.auth.gr', 'eng.auth.gr', 'physics.auth.gr'],
    website: 'https://www.auth.gr',
    established: 1925
  },
  {
    id: 'ntua',
    name: 'Εθνικό Μετσόβιο Πολυτεχνείο',
    nameEn: 'National Technical University of Athens',
    type: 'public',
    city: 'Athens',
    emailDomains: ['ntua.gr', 'central.ntua.gr', 'mail.ntua.gr', 'ece.ntua.gr'],
    website: 'https://www.ntua.gr',
    established: 1837
  },
  {
    id: 'aueb',
    name: 'Οικονομικό Πανεπιστήμιο Αθηνών',
    nameEn: 'Athens University of Economics and Business',
    type: 'public',
    city: 'Athens',
    emailDomains: ['aueb.gr', 'cs.aueb.gr', 'dmst.aueb.gr'],
    website: 'https://www.aueb.gr',
    established: 1920
  },
  {
    id: 'aua',
    name: 'Γεωπονικό Πανεπιστήμιο Αθηνών',
    nameEn: 'Agricultural University of Athens',
    type: 'public',
    city: 'Athens',
    emailDomains: ['aua.gr'],
    website: 'https://www.aua.gr',
    established: 1920
  },
  {
    id: 'panteion',
    name: 'Πάντειο Πανεπιστήμιο',
    nameEn: 'Panteion University',
    type: 'public',
    city: 'Athens',
    emailDomains: ['panteion.gr'],
    website: 'https://www.panteion.gr',
    established: 1927
  },
  {
    id: 'unipi',
    name: 'Πανεπιστήμιο Πειραιώς',
    nameEn: 'University of Piraeus',
    type: 'public',
    city: 'Piraeus',
    emailDomains: ['unipi.gr', 'cs.unipi.gr'],
    website: 'https://www.unipi.gr',
    established: 1938
  },
  {
    id: 'uom',
    name: 'Πανεπιστήμιο Μακεδονίας',
    nameEn: 'University of Macedonia',
    type: 'public',
    city: 'Thessaloniki',
    emailDomains: ['uom.gr', 'uom.edu.gr'],
    website: 'https://www.uom.gr',
    established: 1948
  },
  {
    id: 'upatras',
    name: 'Πανεπιστήμιο Πατρών',
    nameEn: 'University of Patras',
    type: 'public',
    city: 'Patras',
    emailDomains: ['upatras.gr', 'ece.upatras.gr', 'med.upatras.gr', 'ceid.upatras.gr'],
    website: 'https://www.upatras.gr',
    established: 1964
  },
  {
    id: 'uoi',
    name: 'Πανεπιστήμιο Ιωαννίνων',
    nameEn: 'University of Ioannina',
    type: 'public',
    city: 'Ioannina',
    emailDomains: ['uoi.gr', 'cs.uoi.gr', 'cc.uoi.gr'],
    website: 'https://www.uoi.gr',
    established: 1964
  },
  {
    id: 'duth',
    name: 'Δημοκρίτειο Πανεπιστήμιο Θράκης',
    nameEn: 'Democritus University of Thrace',
    type: 'public',
    city: 'Komotini',
    emailDomains: ['duth.gr', 'ee.duth.gr', 'med.duth.gr'],
    website: 'https://duth.gr',
    established: 1973
  },
  {
    id: 'uoc',
    name: 'Πανεπιστήμιο Κρήτης',
    nameEn: 'University of Crete',
    type: 'public',
    city: 'Heraklion/Rethymno',
    emailDomains: ['uoc.gr', 'csd.uoc.gr', 'med.uoc.gr', 'edu.uoc.gr'],
    website: 'https://en.uoc.gr',
    established: 1973
  },
  {
    id: 'tuc',
    name: 'Πολυτεχνείο Κρήτης',
    nameEn: 'Technical University of Crete',
    type: 'public',
    city: 'Chania',
    emailDomains: ['tuc.gr', 'students.tuc.gr'],
    website: 'https://www.tuc.gr',
    established: 1977
  },
  {
    id: 'uth',
    name: 'Πανεπιστήμιο Θεσσαλίας',
    nameEn: 'University of Thessaly',
    type: 'public',
    city: 'Volos',
    emailDomains: ['uth.gr', 'ece.uth.gr', 'med.uth.gr'],
    website: 'https://www.uth.gr',
    established: 1984
  },
  {
    id: 'aegean',
    name: 'Πανεπιστήμιο Αιγαίου',
    nameEn: 'University of the Aegean',
    type: 'public',
    city: 'Mytilene',
    emailDomains: ['aegean.gr', 'stt.aegean.gr', 'env.aegean.gr'],
    website: 'https://www.aegean.gr',
    established: 1984
  },
  {
    id: 'ionio',
    name: 'Ιόνιο Πανεπιστήμιο',
    nameEn: 'Ionian University',
    type: 'public',
    city: 'Corfu',
    emailDomains: ['ionio.gr', 'di.ionio.gr'],
    website: 'https://ionio.gr',
    established: 1984
  },
  {
    id: 'hua',
    name: 'Χαροκόπειο Πανεπιστήμιο',
    nameEn: 'Harokopio University',
    type: 'public',
    city: 'Athens',
    emailDomains: ['hua.gr'],
    website: 'https://www.hua.gr',
    established: 1990
  },
  {
    id: 'uop',
    name: 'Πανεπιστήμιο Πελοποννήσου',
    nameEn: 'University of Peloponnese',
    type: 'public',
    city: 'Tripoli',
    emailDomains: ['uop.gr', 'go.uop.gr'],
    website: 'https://www.uop.gr',
    established: 2000
  },
  {
    id: 'uowm',
    name: 'Πανεπιστήμιο Δυτικής Μακεδονίας',
    nameEn: 'University of Western Macedonia',
    type: 'public',
    city: 'Kozani',
    emailDomains: ['uowm.gr'],
    website: 'https://www.uowm.gr',
    established: 2003
  },
  {
    id: 'ihu',
    name: 'Διεθνές Πανεπιστήμιο της Ελλάδος',
    nameEn: 'International Hellenic University',
    type: 'public',
    city: 'Thessaloniki',
    emailDomains: ['ihu.gr', 'ihu.edu.gr', 'teithe.gr'],
    website: 'https://www.ihu.gr',
    established: 2005
  },
  {
    id: 'uniwa',
    name: 'Πανεπιστήμιο Δυτικής Αττικής',
    nameEn: 'University of West Attica',
    type: 'public',
    city: 'Athens',
    emailDomains: ['uniwa.gr', 'teiath.gr', 'teipir.gr'],
    website: 'https://www.uniwa.gr',
    established: 2018
  },
  {
    id: 'hmu',
    name: 'Ελληνικό Μεσογειακό Πανεπιστήμιο',
    nameEn: 'Hellenic Mediterranean University',
    type: 'public',
    city: 'Heraklion',
    emailDomains: ['hmu.gr', 'teicrete.gr'],
    website: 'https://www.hmu.gr',
    established: 2019
  },
  {
    id: 'asfa',
    name: 'Ανωτάτη Σχολή Καλών Τεχνών',
    nameEn: 'Athens School of Fine Arts',
    type: 'public',
    city: 'Athens',
    emailDomains: ['asfa.gr'],
    website: 'https://www.asfa.gr',
    established: 1837
  },
  {
    id: 'eap',
    name: 'Ελληνικό Ανοικτό Πανεπιστήμιο',
    nameEn: 'Hellenic Open University',
    type: 'public',
    city: 'Patras',
    emailDomains: ['eap.gr', 'ac.eap.gr'],
    website: 'https://www.eap.gr',
    established: 1997
  },
  {
    id: 'aspete',
    name: 'Ανώτατη Σχολή Παιδαγωγικής και Τεχνολογικής Εκπαίδευσης',
    nameEn: 'School of Pedagogical and Technological Education',
    type: 'public',
    city: 'Athens',
    emailDomains: ['aspete.gr'],
    website: 'https://www.aspete.gr',
    established: 2002
  },

  // Major Private Institutions
  {
    id: 'acg',
    name: 'The American College of Greece',
    nameEn: 'The American College of Greece - Deree',
    type: 'private',
    city: 'Athens',
    emailDomains: ['acg.edu', 'deree.edu', 'student.deree.edu'],
    website: 'https://www.acg.edu',
    established: 1875
  },
  {
    id: 'act',
    name: 'American College of Thessaloniki',
    nameEn: 'American College of Thessaloniki',
    type: 'private',
    city: 'Thessaloniki',
    emailDomains: ['act.edu'],
    website: 'https://www.act.edu',
    established: 1886
  },
  {
    id: 'alba',
    name: 'ALBA Graduate Business School',
    nameEn: 'ALBA Graduate Business School',
    type: 'private',
    city: 'Athens',
    emailDomains: ['alba.acg.edu', 'alba.edu.gr'],
    website: 'https://alba.acg.edu',
    established: 1992
  },
  {
    id: 'metropolitan',
    name: 'Metropolitan College',
    nameEn: 'Metropolitan College',
    type: 'private',
    city: 'Athens',
    emailDomains: ['metropolitan.edu.gr', 'mitropolitiko.edu.gr'],
    website: 'https://www.metropolitan.edu.gr',
    established: 1982
  },
  {
    id: 'city_unity',
    name: 'City Unity College',
    nameEn: 'City Unity College',
    type: 'private',
    city: 'Athens',
    emailDomains: ['cityu.edu.gr', 'cityunity.gr'],
    website: 'https://www.cityu.edu.gr',
    established: 1999
  },
  {
    id: 'bca',
    name: 'BCA College',
    nameEn: 'BCA College',
    type: 'private',
    city: 'Athens',
    emailDomains: ['bca.edu.gr'],
    website: 'https://www.bca.edu.gr',
    established: 1971
  },
  {
    id: 'ies_abroad',
    name: 'IES Abroad Athens',
    nameEn: 'IES Abroad Athens',
    type: 'private',
    city: 'Athens',
    emailDomains: ['iesabroad.org', 'athens.iesabroad.org'],
    website: 'https://www.iesabroad.org/programs/athens',
    established: 1950
  },
  {
    id: 'mediterranean_college',
    name: 'Mediterranean College',
    nameEn: 'Mediterranean College',
    type: 'private',
    city: 'Athens',
    emailDomains: ['medcollege.edu.gr'],
    website: 'https://www.medcollege.edu.gr',
    established: 1977
  },
  {
    id: 'dei',
    name: 'DEI College',
    nameEn: 'DEI College',
    type: 'private',
    city: 'Thessaloniki',
    emailDomains: ['dei.edu.gr'],
    website: 'https://www.dei.edu.gr',
    established: 1990
  },
  {
    id: 'perrotis',
    name: 'Perrotis College',
    nameEn: 'Perrotis College of Agriculture',
    type: 'private',
    city: 'Thessaloniki',
    emailDomains: ['perrotiscollege.edu.gr', 'afs.edu.gr'],
    website: 'https://www.perrotiscollege.edu.gr',
    established: 1996
  },
  {
    id: 'webster',
    name: 'Webster University Athens',
    nameEn: 'Webster University Athens',
    type: 'private',
    city: 'Athens',
    emailDomains: ['webster.edu', 'websterathens.edu'],
    website: 'https://webster.edu/campuses/athens',
    established: 2014
  },
  {
    id: 'nyu_athens',
    name: 'NYU Athens',
    nameEn: 'New York University Athens',
    type: 'private',
    city: 'Athens',
    emailDomains: ['nyu.edu'],
    website: 'https://www.nyu.edu/global/global-academic-centers/athens.html',
    established: 2019
  },
  {
    id: 'cinotech',
    name: 'Κολλέγιο Τουρισμού CINOTECH',
    nameEn: 'CINOTECH Tourism College',
    type: 'private',
    city: 'Athens',
    emailDomains: ['cinotech.edu.gr'],
    website: 'https://www.cinotech.edu.gr',
    established: 1992
  },
  {
    id: 'vakalo',
    name: 'Σχολή Καλών Τεχνών Βακαλό',
    nameEn: 'Vakalo Art & Design College',
    type: 'private',
    city: 'Athens',
    emailDomains: ['vakalo.gr'],
    website: 'https://www.vakalo.gr',
    established: 1958
  },
  {
    id: 'athens_tech',
    name: 'Athens Tech College',
    nameEn: 'Athens Tech College',
    type: 'private',
    city: 'Athens',
    emailDomains: ['athenstech.gr'],
    website: 'https://www.athenstech.gr',
    established: 1999
  },

  // Technical Education Institutes (now integrated into universities)
  {
    id: 'tei_athens',
    name: 'Τεχνολογικό Εκπαιδευτικό Ίδρυμα Αθήνας',
    nameEn: 'Technological Educational Institute of Athens (now part of UNIWA)',
    type: 'public',
    city: 'Athens',
    emailDomains: ['teiath.gr', 'uniwa.gr'],
    website: 'https://www.uniwa.gr',
    established: 1974
  },
  {
    id: 'tei_thessaloniki',
    name: 'Τεχνολογικό Εκπαιδευτικό Ίδρυμα Θεσσαλονίκης',
    nameEn: 'Technological Educational Institute of Thessaloniki (now part of IHU)',
    type: 'public',
    city: 'Thessaloniki',
    emailDomains: ['teithe.gr', 'ihu.gr'],
    website: 'https://www.ihu.gr',
    established: 1974
  }
];

// Helper function to get university by email domain
export function getUniversityByEmail(email: string): University | null {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return null;

  return GREEK_UNIVERSITIES.find(uni => 
    uni.emailDomains.some(uniDomain => 
      domain === uniDomain || domain.endsWith(`.${uniDomain}`)
    )
  ) || null;
}

// Get all universities
export function getAllUniversities(): University[] {
  return GREEK_UNIVERSITIES;
}

// Get all public universities
export function getPublicUniversities(): University[] {
  return GREEK_UNIVERSITIES.filter(uni => uni.type === 'public');
}

// Get all private universities
export function getPrivateUniversities(): University[] {
  return GREEK_UNIVERSITIES.filter(uni => uni.type === 'private');
}

// Search universities by name or city
export function searchUniversities(query: string): University[] {
  const searchLower = query.toLowerCase();
  return GREEK_UNIVERSITIES.filter(uni => 
    uni.name.toLowerCase().includes(searchLower) ||
    uni.nameEn.toLowerCase().includes(searchLower) ||
    uni.city.toLowerCase().includes(searchLower)
  );
} 