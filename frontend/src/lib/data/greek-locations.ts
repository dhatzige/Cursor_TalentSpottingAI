export interface GreekLocation {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  regionEn: string;
  prefecture: string;
  hasUniversities: boolean;
  majorCity: boolean;
}

export interface GreekRegion {
  id: string;
  name: string;
  nameEn: string;
  locations: GreekLocation[];
}

export const GREEK_LOCATIONS: GreekLocation[] = [
  // Attica Region (Αττική)
  {
    id: 'athens',
    name: 'Αθήνα',
    nameEn: 'Athens',
    region: 'Αττική',
    regionEn: 'Attica',
    prefecture: 'Κεντρικός Τομέας Αθηνών',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'piraeus',
    name: 'Πειραιάς',
    nameEn: 'Piraeus',
    region: 'Αττική',
    regionEn: 'Attica',
    prefecture: 'Πειραιάς',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'kallithea',
    name: 'Καλλιθέα',
    nameEn: 'Kallithea',
    region: 'Αττική',
    regionEn: 'Attica',
    prefecture: 'Νότιος Τομέας Αθηνών',
    hasUniversities: false,
    majorCity: false
  },
  {
    id: 'agia-paraskevi',
    name: 'Αγία Παρασκευή',
    nameEn: 'Agia Paraskevi',
    region: 'Αττική',
    regionEn: 'Attica',
    prefecture: 'Ανατολικός Τομέας Αθηνών',
    hasUniversities: true,
    majorCity: false
  },

  // Central Macedonia (Κεντρική Μακεδονία)
  {
    id: 'thessaloniki',
    name: 'Θεσσαλονίκη',
    nameEn: 'Thessaloniki',
    region: 'Κεντρική Μακεδονία',
    regionEn: 'Central Macedonia',
    prefecture: 'Θεσσαλονίκης',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'serres',
    name: 'Σέρρες',
    nameEn: 'Serres',
    region: 'Κεντρική Μακεδονία',
    regionEn: 'Central Macedonia',
    prefecture: 'Σερρών',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'kavala',
    name: 'Καβάλα',
    nameEn: 'Kavala',
    region: 'Κεντρική Μακεδονία',
    regionEn: 'Central Macedonia',
    prefecture: 'Καβάλας',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'drama',
    name: 'Δράμα',
    nameEn: 'Drama',
    region: 'Κεντρική Μακεδονία',
    regionEn: 'Central Macedonia',
    prefecture: 'Δράμας',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'kilkis',
    name: 'Κιλκίς',
    nameEn: 'Kilkis',
    region: 'Κεντρική Μακεδονία',
    regionEn: 'Central Macedonia',
    prefecture: 'Κιλκίς',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'edessa',
    name: 'Έδεσσα',
    nameEn: 'Edessa',
    region: 'Κεντρική Μακεδονία',
    regionEn: 'Central Macedonia',
    prefecture: 'Πέλλας',
    hasUniversities: true,
    majorCity: false
  },

  // Western Greece (Δυτική Ελλάδα)
  {
    id: 'patras',
    name: 'Πάτρα',
    nameEn: 'Patras',
    region: 'Δυτική Ελλάδα',
    regionEn: 'Western Greece',
    prefecture: 'Αχαΐας',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'agrinio',
    name: 'Αγρίνιο',
    nameEn: 'Agrinio',
    region: 'Δυτική Ελλάδα',
    regionEn: 'Western Greece',
    prefecture: 'Αιτωλοακαρνανίας',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'messolonghi',
    name: 'Μεσολόγγι',
    nameEn: 'Messolonghi',
    region: 'Δυτική Ελλάδα',
    regionEn: 'Western Greece',
    prefecture: 'Αιτωλοακαρνανίας',
    hasUniversities: true,
    majorCity: false
  },

  // Epirus (Ήπειρος)
  {
    id: 'ioannina',
    name: 'Ιωάννινα',
    nameEn: 'Ioannina',
    region: 'Ήπειρος',
    regionEn: 'Epirus',
    prefecture: 'Ιωαννίνων',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'arta',
    name: 'Άρτα',
    nameEn: 'Arta',
    region: 'Ήπειρος',
    regionEn: 'Epirus',
    prefecture: 'Άρτας',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'preveza',
    name: 'Πρέβεζα',
    nameEn: 'Preveza',
    region: 'Ήπειρος',
    regionEn: 'Epirus',
    prefecture: 'Πρέβεζας',
    hasUniversities: true,
    majorCity: false
  },

  // Thessaly (Θεσσαλία)
  {
    id: 'volos',
    name: 'Βόλος',
    nameEn: 'Volos',
    region: 'Θεσσαλία',
    regionEn: 'Thessaly',
    prefecture: 'Μαγνησίας',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'larissa',
    name: 'Λάρισα',
    nameEn: 'Larissa',
    region: 'Θεσσαλία',
    regionEn: 'Thessaly',
    prefecture: 'Λάρισας',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'trikala',
    name: 'Τρίκαλα',
    nameEn: 'Trikala',
    region: 'Θεσσαλία',
    regionEn: 'Thessaly',
    prefecture: 'Τρικάλων',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'karditsa',
    name: 'Καρδίτσα',
    nameEn: 'Karditsa',
    region: 'Θεσσαλία',
    regionEn: 'Thessaly',
    prefecture: 'Καρδίτσας',
    hasUniversities: true,
    majorCity: false
  },

  // Crete (Κρήτη)
  {
    id: 'heraklion',
    name: 'Ηράκλειο',
    nameEn: 'Heraklion',
    region: 'Κρήτη',
    regionEn: 'Crete',
    prefecture: 'Ηρακλείου',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'chania',
    name: 'Χανιά',
    nameEn: 'Chania',
    region: 'Κρήτη',
    regionEn: 'Crete',
    prefecture: 'Χανίων',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'rethymno',
    name: 'Ρέθυμνο',
    nameEn: 'Rethymno',
    region: 'Κρήτη',
    regionEn: 'Crete',
    prefecture: 'Ρεθύμνης',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'agios-nikolaos',
    name: 'Άγιος Νικόλαος',
    nameEn: 'Agios Nikolaos',
    region: 'Κρήτη',
    regionEn: 'Crete',
    prefecture: 'Λασιθίου',
    hasUniversities: true,
    majorCity: false
  },

  // South Aegean (Νότιο Αιγαίο)
  {
    id: 'rhodes',
    name: 'Ρόδος',
    nameEn: 'Rhodes',
    region: 'Νότιο Αιγαίο',
    regionEn: 'South Aegean',
    prefecture: 'Δωδεκανήσου',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'syros',
    name: 'Σύρος',
    nameEn: 'Syros',
    region: 'Νότιο Αιγαίο',
    regionEn: 'South Aegean',
    prefecture: 'Κυκλάδων',
    hasUniversities: true,
    majorCity: false
  },

  // North Aegean (Βόρειο Αιγαίο)
  {
    id: 'mytilene',
    name: 'Μυτιλήνη',
    nameEn: 'Mytilene',
    region: 'Βόρειο Αιγαίο',
    regionEn: 'North Aegean',
    prefecture: 'Λέσβου',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'chios',
    name: 'Χίος',
    nameEn: 'Chios',
    region: 'Βόρειο Αιγαίο',
    regionEn: 'North Aegean',
    prefecture: 'Χίου',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'samos',
    name: 'Σάμος',
    nameEn: 'Samos',
    region: 'Βόρειο Αιγαίο',
    regionEn: 'North Aegean',
    prefecture: 'Σάμου',
    hasUniversities: true,
    majorCity: false
  },

  // Ionian Islands (Ιόνια Νησιά)
  {
    id: 'corfu',
    name: 'Κέρκυρα',
    nameEn: 'Corfu',
    region: 'Ιόνια Νησιά',
    regionEn: 'Ionian Islands',
    prefecture: 'Κερκύρας',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'zakynthos',
    name: 'Ζάκυνθος',
    nameEn: 'Zakynthos',
    region: 'Ιόνια Νησιά',
    regionEn: 'Ionian Islands',
    prefecture: 'Ζακύνθου',
    hasUniversities: true,
    majorCity: false
  },

  // Eastern Macedonia and Thrace (Ανατολική Μακεδονία και Θράκη)
  {
    id: 'komotini',
    name: 'Κομοτηνή',
    nameEn: 'Komotini',
    region: 'Ανατολική Μακεδονία και Θράκη',
    regionEn: 'Eastern Macedonia and Thrace',
    prefecture: 'Ροδόπης',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'xanthi',
    name: 'Ξάνθη',
    nameEn: 'Xanthi',
    region: 'Ανατολική Μακεδονία και Θράκη',
    regionEn: 'Eastern Macedonia and Thrace',
    prefecture: 'Ξάνθης',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'alexandroupoli',
    name: 'Αλεξανδρούπολη',
    nameEn: 'Alexandroupoli',
    region: 'Ανατολική Μακεδονία και Θράκη',
    regionEn: 'Eastern Macedonia and Thrace',
    prefecture: 'Έβρου',
    hasUniversities: true,
    majorCity: false
  },

  // Western Macedonia (Δυτική Μακεδονία)
  {
    id: 'kozani',
    name: 'Κοζάνη',
    nameEn: 'Kozani',
    region: 'Δυτική Μακεδονία',
    regionEn: 'Western Macedonia',
    prefecture: 'Κοζάνης',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'florina',
    name: 'Φλώρινα',
    nameEn: 'Florina',
    region: 'Δυτική Μακεδονία',
    regionEn: 'Western Macedonia',
    prefecture: 'Φλώρινας',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'kastoria',
    name: 'Καστοριά',
    nameEn: 'Kastoria',
    region: 'Δυτική Μακεδονία',
    regionEn: 'Western Macedonia',
    prefecture: 'Καστοριάς',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'grevena',
    name: 'Γρεβενά',
    nameEn: 'Grevena',
    region: 'Δυτική Μακεδονία',
    regionEn: 'Western Macedonia',
    prefecture: 'Γρεβενών',
    hasUniversities: true,
    majorCity: false
  },

  // Central Greece (Στερεά Ελλάδα)
  {
    id: 'lamia',
    name: 'Λαμία',
    nameEn: 'Lamia',
    region: 'Στερεά Ελλάδα',
    regionEn: 'Central Greece',
    prefecture: 'Φθιώτιδας',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'livadeia',
    name: 'Λιβαδειά',
    nameEn: 'Livadeia',
    region: 'Στερεά Ελλάδα',
    regionEn: 'Central Greece',
    prefecture: 'Βοιωτίας',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'chalkida',
    name: 'Χαλκίδα',
    nameEn: 'Chalkida',
    region: 'Στερεά Ελλάδα',
    regionEn: 'Central Greece',
    prefecture: 'Εύβοιας',
    hasUniversities: true,
    majorCity: false
  },

  // Peloponnese (Πελοπόννησος)
  {
    id: 'tripoli',
    name: 'Τρίπολη',
    nameEn: 'Tripoli',
    region: 'Πελοπόννησος',
    regionEn: 'Peloponnese',
    prefecture: 'Αρκαδίας',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'kalamata',
    name: 'Καλαμάτα',
    nameEn: 'Kalamata',
    region: 'Πελοπόννησος',
    regionEn: 'Peloponnese',
    prefecture: 'Μεσσηνίας',
    hasUniversities: true,
    majorCity: true
  },
  {
    id: 'sparta',
    name: 'Σπάρτη',
    nameEn: 'Sparta',
    region: 'Πελοπόννησος',
    regionEn: 'Peloponnese',
    prefecture: 'Λακωνίας',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'pyrgos',
    name: 'Πύργος',
    nameEn: 'Pyrgos',
    region: 'Πελοπόννησος',
    regionEn: 'Peloponnese',
    prefecture: 'Ηλείας',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'nafplio',
    name: 'Ναύπλιο',
    nameEn: 'Nafplio',
    region: 'Πελοπόννησος',
    regionEn: 'Peloponnese',
    prefecture: 'Αργολίδας',
    hasUniversities: true,
    majorCity: false
  },
  {
    id: 'corinth',
    name: 'Κόρινθος',
    nameEn: 'Corinth',
    region: 'Πελοπόννησος',
    regionEn: 'Peloponnese',
    prefecture: 'Κορινθίας',
    hasUniversities: true,
    majorCity: false
  }
];

// Group locations by region
export const GREEK_REGIONS: GreekRegion[] = [
  {
    id: 'attica',
    name: 'Αττική',
    nameEn: 'Attica',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'Attica')
  },
  {
    id: 'central-macedonia',
    name: 'Κεντρική Μακεδονία',
    nameEn: 'Central Macedonia',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'Central Macedonia')
  },
  {
    id: 'thessaly',
    name: 'Θεσσαλία',
    nameEn: 'Thessaly',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'Thessaly')
  },
  {
    id: 'crete',
    name: 'Κρήτη',
    nameEn: 'Crete',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'Crete')
  },
  {
    id: 'western-greece',
    name: 'Δυτική Ελλάδα',
    nameEn: 'Western Greece',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'Western Greece')
  },
  {
    id: 'epirus',
    name: 'Ήπειρος',
    nameEn: 'Epirus',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'Epirus')
  },
  {
    id: 'peloponnese',
    name: 'Πελοπόννησος',
    nameEn: 'Peloponnese',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'Peloponnese')
  },
  {
    id: 'eastern-macedonia-thrace',
    name: 'Ανατολική Μακεδονία και Θράκη',
    nameEn: 'Eastern Macedonia and Thrace',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'Eastern Macedonia and Thrace')
  },
  {
    id: 'western-macedonia',
    name: 'Δυτική Μακεδονία',
    nameEn: 'Western Macedonia',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'Western Macedonia')
  },
  {
    id: 'central-greece',
    name: 'Στερεά Ελλάδα',
    nameEn: 'Central Greece',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'Central Greece')
  },
  {
    id: 'north-aegean',
    name: 'Βόρειο Αιγαίο',
    nameEn: 'North Aegean',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'North Aegean')
  },
  {
    id: 'south-aegean',
    name: 'Νότιο Αιγαίο',
    nameEn: 'South Aegean',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'South Aegean')
  },
  {
    id: 'ionian-islands',
    name: 'Ιόνια Νησιά',
    nameEn: 'Ionian Islands',
    locations: GREEK_LOCATIONS.filter(loc => loc.regionEn === 'Ionian Islands')
  }
];

// Helper functions
export function getLocationById(id: string): GreekLocation | null {
  return GREEK_LOCATIONS.find(loc => loc.id === id) || null;
}

export function getLocationsByRegion(regionId: string): GreekLocation[] {
  const region = GREEK_REGIONS.find(r => r.id === regionId);
  return region ? region.locations : [];
}

export function getMajorCities(): GreekLocation[] {
  return GREEK_LOCATIONS.filter(loc => loc.majorCity);
}

export function getUniversityCities(): GreekLocation[] {
  return GREEK_LOCATIONS.filter(loc => loc.hasUniversities);
} 