import { User, Phone, MapPin, Mail, Home, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useRef, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PersonalInfoStepProps {
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    address?: string;
  };
  onChange: (field: string, value: string) => void;
  userEmail?: string;
  onValidationChange?: (isValid: boolean) => void;
}

// Comprehensive Greek cities and regions for autocomplete
// Includes major cities, regional capitals, popular areas, and both Greek/English names
const GREEK_CITIES = [
  // Major Cities & Regional Capitals
  'Athens', 'Αθήνα', 'Thessaloniki', 'Θεσσαλονίκη', 'Patras', 'Πάτρα', 'Heraklion', 'Ηράκλειο',
  'Larissa', 'Λάρισα', 'Volos', 'Βόλος', 'Ioannina', 'Ιωάννινα', 'Kavala', 'Καβάλα',
  'Kalamata', 'Καλαμάτα', 'Serres', 'Σέρρες', 'Chania', 'Χανιά', 'Lamia', 'Λαμία',
  'Kozani', 'Κοζάνη', 'Drama', 'Δράμα', 'Veria', 'Βέροια', 'Mitilini', 'Μυτιλήνη',
  'Mytilene', 'Chios', 'Χίος', 'Syros', 'Σύρος', 'Rhodes', 'Ρόδος', 'Kos', 'Κως',
  
  // Attica Region
  'Piraeus', 'Πειραιάς', 'Glyfada', 'Γλυφάδα', 'Kifisia', 'Κηφισιά', 'Marousi', 'Μαρούσι',
  'Chalandri', 'Χαλάνδρι', 'Agia Paraskevi', 'Αγία Παρασκευή', 'Nea Ionia', 'Νέα Ιωνία',
  'Peristeri', 'Περιστέρι', 'Kallithea', 'Καλλιθέα', 'Nea Smyrni', 'Νέα Σμύρνη',
  'Palaio Faliro', 'Παλαιό Φάληρο', 'Alimos', 'Άλιμος', 'Elliniko', 'Ελληνικό',
  'Voula', 'Βούλα', 'Vouliagmeni', 'Βουλιαγμένη', 'Varkiza', 'Βάρκιζα',
  'Rafina', 'Ραφήνα', 'Marathon', 'Μαραθώνας', 'Lavrio', 'Λαύριο',
  
  // Central Macedonia
  'Halkidiki', 'Χαλκιδική', 'Kassandra', 'Κασσάνδρα', 'Sithonia', 'Σιθωνία',
  'Polygyros', 'Πολύγυρος', 'Nea Moudania', 'Νέα Μουδανιά', 'Neos Marmaras', 'Νέος Μαρμαράς',
  'Ouranoupoli', 'Ουρανούπολη', 'Katerini', 'Κατερίνη', 'Giannitsa', 'Γιαννιτσά',
  'Edessa', 'Έδεσσα', 'Florina', 'Φλώρινα', 'Kastoria', 'Καστοριά',
  'Kilkis', 'Κιλκίς', 'Pella', 'Πέλλα', 'Pieria', 'Πιερία',
  
  // Thessaly
  'Trikala', 'Τρίκαλα', 'Karditsa', 'Καρδίτσα', 'Magnesia', 'Μαγνησία',
  'Skiathos', 'Σκιάθος', 'Skopelos', 'Σκόπελος', 'Alonissos', 'Αλόννησος',
  'Pelion', 'Πήλιο', 'Portaria', 'Πορταριά', 'Zagora', 'Ζαγορά',
  
  // Western Greece
  'Agrinio', 'Αγρίνιο', 'Messolonghi', 'Μεσολόγγι', 'Amfilochia', 'Αμφιλοχία',
  'Preveza', 'Πρέβεζα', 'Lefkada', 'Λευκάδα', 'Arta', 'Άρτα',
  'Igoumenitsa', 'Ηγουμενίτσα', 'Parga', 'Πάργα', 'Syvota', 'Σύβοτα',
  
  // Peloponnese
  'Sparta', 'Σπάρτη', 'Tripoli', 'Τρίπολη', 'Corinth', 'Κόρινθος',
  'Nafplio', 'Ναύπλιο', 'Argos', 'Άργος', 'Pyrgos', 'Πύργος',
  'Olympia', 'Ολυμπία', 'Megalopoli', 'Μεγαλόπολη', 'Gythio', 'Γύθειο',
  'Monemvasia', 'Μονεμβασιά', 'Methoni', 'Μεθώνη', 'Koroni', 'Κορώνη',
  'Stoupa', 'Στούπα', 'Kardamyli', 'Καρδαμύλη',
  
  // Central Greece
  'Livadeia', 'Λιβαδειά', 'Chalcis', 'Χαλκίδα', 'Chalkida', 'Χαλκίδα',
  'Karystos', 'Κάρυστος', 'Kymi', 'Κύμη', 'Aliveri', 'Αλιβέρι',
  'Amfissa', 'Άμφισσα', 'Delphi', 'Δελφοί', 'Arachova', 'Αράχωβα',
  'Kamena Vourla', 'Καμένα Βούρλα', 'Loutraki', 'Λουτράκι',
  
  // Crete
  'Rethymno', 'Ρέθυμνο', 'Agios Nikolaos', 'Άγιος Νικόλαος',
  'Ierapetra', 'Ιεράπετρα', 'Sitia', 'Σητεία', 'Kissamos', 'Κίσσαμος',
  'Malia', 'Μάλια', 'Hersonissos', 'Χερσόνησος', 'Elounda', 'Ελούντα',
  'Paleochora', 'Παλαιόχωρα', 'Sfakia', 'Σφακιά',
  
  // Islands - Ionian
  'Corfu', 'Κέρκυρα', 'Zakynthos', 'Ζάκυνθος', 'Kefalonia', 'Κεφαλονιά',
  'Ithaca', 'Ιθάκη', 'Paxos', 'Παξοί', 'Antipaxos', 'Αντίπαξος',
  
  // Islands - Aegean
  'Mykonos', 'Μύκονος', 'Santorini', 'Σαντορίνη', 'Paros', 'Πάρος',
  'Naxos', 'Νάξος', 'Ios', 'Ίος', 'Milos', 'Μήλος', 'Sifnos', 'Σίφνος',
  'Serifos', 'Σέριφος', 'Kythnos', 'Κύθνος', 'Andros', 'Άνδρος',
  'Tinos', 'Τήνος', 'Amorgos', 'Αμοργός', 'Folegandros', 'Φολέγανδρος',
  
  // Islands - Dodecanese
  'Patmos', 'Πάτμος', 'Leros', 'Λέρος', 'Kalymnos', 'Κάλυμνος',
  'Symi', 'Σύμη', 'Tilos', 'Τήλος', 'Nisyros', 'Νίσυρος',
  'Astypalaia', 'Αστυπάλαια', 'Karpathos', 'Κάρπατθος', 'Kasos', 'Κάσος',
  
  // Islands - North Aegean
  'Samos', 'Σάμος', 'Ikaria', 'Ικαρία', 'Lemnos', 'Λήμνος',
  'Thasos', 'Θάσος', 'Samothrace', 'Σαμοθράκη',
  
  // Eastern Macedonia and Thrace
  'Alexandroupoli', 'Αλεξανδρούπολη', 'Xanthi', 'Ξάνθη', 'Komotini', 'Κομοτηνή',
  'Didymoteicho', 'Διδυμότειχο', 'Orestiada', 'Ορεστιάδα',
  
  // Epirus
  'Metsovo', 'Μέτσοβο', 'Konitsa', 'Κόνιτσα', 'Zagori', 'Ζαγόρι',
  'Papingo', 'Πάπιγκο', 'Monodendri', 'Μονοδένδρι',
  
  // Popular Tourist Destinations
  'Meteora', 'Μετέωρα', 'Mount Athos', 'Άγιον Όρος', 'Delos', 'Δήλος',
  'Hydra', 'Ύδρα', 'Spetses', 'Σπέτσες', 'Aegina', 'Αίγινα',
  'Poros', 'Πόρος', 'Salamina', 'Σαλαμίνα'
];

export function PersonalInfoStep({ formData, onChange, userEmail, onValidationChange }: PersonalInfoStepProps) {
  const [cityQuery, setCityQuery] = useState(formData.city || '');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [citySelectedFromList, setCitySelectedFromList] = useState(
    GREEK_CITIES.includes(formData.city || '')
  );
  const cityInputRef = useRef<HTMLInputElement>(null);
  const citySuggestionsRef = useRef<HTMLDivElement>(null);

  // Validation functions for mandatory fields
  const isFirstNameValid = () => formData.firstName.trim().length >= 2;
  const isLastNameValid = () => formData.lastName.trim().length >= 2;
  const isPhoneValid = () => {
    const phone = formData.phone.trim();
    // Phone is optional - if empty, it's valid
    if (phone.length === 0) return true;
    // If provided, should be at least 8 digits and contain valid phone characters
    return phone.length >= 8 && /^[+]?[\d\s\-()]+$/.test(phone);
  };
  const isCityValid = () => {
    return GREEK_CITIES.includes(formData.city) && citySelectedFromList;
  };

  // Get validation state for styling
  const getFieldValidationClass = (isValid: boolean, hasContent: boolean) => {
    if (!hasContent) return 'border-gray-200 dark:border-gray-600'; // Default state
    return isValid 
      ? 'border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-100 dark:focus:ring-green-900/30' 
      : 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30';
  };

  const getIconValidationClass = (isValid: boolean, hasContent: boolean, baseColor: string) => {
    if (!hasContent) return baseColor; // Default color
    return isValid ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50';
  };

  const getIconColor = (isValid: boolean, hasContent: boolean, baseColor: string) => {
    if (!hasContent) return baseColor; // Default color
    return isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  // Check if all required fields are valid (phone is optional)
  const isFormValid = () => {
    return isFirstNameValid() && isLastNameValid() && isCityValid() && isPhoneValid();
  };

  // Notify parent of validation changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isFormValid());
    }
  }, [formData.firstName, formData.lastName, formData.phone, formData.city, citySelectedFromList, onValidationChange]);

  // Filter cities based on query with improved search - trigger immediately
  useEffect(() => {
    if (cityQuery.length >= 1) { // Show suggestions after just 1 character
      const query = cityQuery.toLowerCase().trim();
      
      // Fast filtering with priority for starts-with matches
      const startsWithMatches: string[] = [];
      const containsMatches: string[] = [];
      
      for (const city of GREEK_CITIES) {
        const cityLower = city.toLowerCase();
        if (cityLower.startsWith(query)) {
          startsWithMatches.push(city);
        } else if (cityLower.includes(query)) {
          containsMatches.push(city);
        }
        
        // Limit total results for performance
        if (startsWithMatches.length + containsMatches.length >= 15) break;
      }
      
      // Combine results with starts-with matches first
      const filtered = [...startsWithMatches, ...containsMatches].slice(0, 12);
      setFilteredCities(filtered);
      setShowCitySuggestions(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setShowCitySuggestions(false);
    }
  }, [cityQuery]); // Remove formData.city dependency for faster response

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        citySuggestionsRef.current &&
        !citySuggestionsRef.current.contains(event.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target as Node)
      ) {
        setShowCitySuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (city: string) => {
    setCityQuery(city);
    onChange('city', city);
    setCitySelectedFromList(true);
    setShowCitySuggestions(false);
  };

  const handleCityInputChange = (value: string) => {
    setCityQuery(value);
    onChange('city', value);
    // Reset selection flag when user types freely
    setCitySelectedFromList(false);
    
    // Show suggestions immediately if there's content
    if (value.length >= 1) {
      // The useEffect will handle filtering and show suggestions
      setShowCitySuggestions(true);
    } else {
      // Hide suggestions if input is empty
      setShowCitySuggestions(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <User className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-gray-900 to-purple-900 dark:from-white dark:to-purple-100 bg-clip-text text-transparent">
          Personal Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
          Tell us a bit about yourself. This information will be used to create your profile and help employers find you.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Email Display (Read-only) */}
        {userEmail && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200/60 dark:border-blue-800/60 rounded-xl">
            <Label className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              Email Address
            </Label>
            <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">{userEmail}</span>
              <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full ml-auto">
                ✓ Verified
              </div>
            </div>
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${getIconValidationClass(isFirstNameValid(), formData.firstName.length > 0, 'bg-purple-100 dark:bg-purple-900/50')}`}>
                <User className={`h-4 w-4 ${getIconColor(isFirstNameValid(), formData.firstName.length > 0, 'text-purple-600 dark:text-purple-400')}`} />
              </div>
              First Name *
            </Label>
            <div className="relative">
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => onChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                className={`h-14 pl-12 pr-4 border-2 rounded-xl focus:ring-4 transition-all duration-200 font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 ${getFieldValidationClass(isFirstNameValid(), formData.firstName.length > 0)}`}
                required
              />
              <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg ${getIconValidationClass(isFirstNameValid(), formData.firstName.length > 0, 'bg-purple-100 dark:bg-purple-900/50')}`}>
                <User className={`h-4 w-4 ${getIconColor(isFirstNameValid(), formData.firstName.length > 0, 'text-purple-600 dark:text-purple-400')}`} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${getIconValidationClass(isLastNameValid(), formData.lastName.length > 0, 'bg-purple-100 dark:bg-purple-900/50')}`}>
                <User className={`h-4 w-4 ${getIconColor(isLastNameValid(), formData.lastName.length > 0, 'text-purple-600 dark:text-purple-400')}`} />
              </div>
              Last Name *
            </Label>
            <div className="relative">
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => onChange('lastName', e.target.value)}
                placeholder="Enter your last name"
                className={`h-14 pl-12 pr-4 border-2 rounded-xl focus:ring-4 transition-all duration-200 font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 ${getFieldValidationClass(isLastNameValid(), formData.lastName.length > 0)}`}
                required
              />
              <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg ${getIconValidationClass(isLastNameValid(), formData.lastName.length > 0, 'bg-purple-100 dark:bg-purple-900/50')}`}>
                <User className={`h-4 w-4 ${getIconColor(isLastNameValid(), formData.lastName.length > 0, 'text-purple-600 dark:text-purple-400')}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Phone Field */}
        <div className="space-y-3">
          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${getIconValidationClass(isPhoneValid(), formData.phone.length > 0, 'bg-green-100 dark:bg-green-900/50')}`}>
              <Phone className={`h-4 w-4 ${getIconColor(isPhoneValid(), formData.phone.length > 0, 'text-green-600 dark:text-green-400')}`} />
            </div>
            Phone Number
          </Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="Enter your phone number (e.g., +30 123 456 7890)"
              className={`h-14 pl-12 pr-4 border-2 rounded-xl focus:ring-4 transition-all duration-200 font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 ${getFieldValidationClass(isPhoneValid(), formData.phone.length > 0)}`}
              required
            />
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg ${getIconValidationClass(isPhoneValid(), formData.phone.length > 0, 'bg-green-100 dark:bg-green-900/50')}`}>
              <Phone className={`h-4 w-4 ${getIconColor(isPhoneValid(), formData.phone.length > 0, 'text-green-600 dark:text-green-400')}`} />
            </div>
          </div>
          <p className={`text-sm flex items-center gap-2 ${formData.phone.length > 0 && !isPhoneValid() ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <span>💡</span>
            {formData.phone.length > 0 && !isPhoneValid() 
              ? 'Please enter a valid phone number (min 8 digits)' 
              : 'Optional - Include country code for international numbers'
            }
          </p>
        </div>

        {/* City Field with Autocomplete */}
        <div className="space-y-3">
          <Label htmlFor="city" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${getIconValidationClass(isCityValid(), formData.city.length > 0, 'bg-orange-100 dark:bg-orange-900/50')}`}>
              <MapPin className={`h-4 w-4 ${getIconColor(isCityValid(), formData.city.length > 0, 'text-orange-600 dark:text-orange-400')}`} />
            </div>
            City *
          </Label>
          <div className="relative">
            <Input
              ref={cityInputRef}
              id="city"
              type="text"
              value={cityQuery}
              onChange={(e) => handleCityInputChange(e.target.value)}
              onFocus={() => {
                // Show suggestions immediately on focus if there's content and matches
                if (cityQuery.length >= 1 && filteredCities.length > 0) {
                  setShowCitySuggestions(true);
                }
              }}
              placeholder="Start typing your city (e.g., Thessaloniki, Halkidiki)"
              className={`h-14 pl-12 pr-4 border-2 rounded-xl focus:ring-4 transition-all duration-200 font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 ${getFieldValidationClass(isCityValid(), formData.city.length > 0)}`}
              autoComplete="off"
              required
            />
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg ${getIconValidationClass(isCityValid(), formData.city.length > 0, 'bg-orange-100 dark:bg-orange-900/50')}`}>
              <MapPin className={`h-4 w-4 ${getIconColor(isCityValid(), formData.city.length > 0, 'text-orange-600 dark:text-orange-400')}`} />
            </div>

            {/* City Suggestions Dropdown */}
            {showCitySuggestions && (
              <div
                ref={citySuggestionsRef}
                className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto"
              >
                <div className="sticky top-0 p-2 border-b border-orange-100 dark:border-orange-800 bg-orange-50/90 dark:bg-orange-900/40 backdrop-blur-sm">
                  <p className="text-xs font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Greek Cities & Regions ({filteredCities.length} found)
                  </p>
                </div>
                <div className="py-1">
                  {filteredCities.map((city, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-3 py-2 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors duration-150 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/70 transition-colors">
                          <MapPin className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-orange-900 dark:group-hover:text-orange-100">
                          {city}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className={`text-sm flex items-center gap-2 ${formData.city.length > 0 && !isCityValid() ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <span>🏙️</span>
            {formData.city.length > 0 && !isCityValid() 
              ? 'Please select a city from the dropdown list' 
              : 'This helps employers find local talent'
            }
          </p>
        </div>

        {/* Optional Address Field */}
        <div className="space-y-3">
          <Label htmlFor="address" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <Home className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            Address
            <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
              Optional
            </div>
          </Label>
          <div className="relative">
            <Input
              id="address"
              type="text"
              value={formData.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Enter your address (e.g., Syntagma Square, Athens)"
              className="h-14 pl-12 pr-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all duration-200 font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <Home className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          {/* Address Benefits Alert */}
          <Alert className="border-2 border-indigo-200/60 bg-gradient-to-r from-indigo-50 to-blue-50 dark:border-indigo-800/60 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-xl">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <AlertDescription className="text-indigo-800 dark:text-indigo-200">
              <div className="space-y-2">
                <p className="font-semibold flex items-center gap-2">
                  <span>🎯</span> Why provide your address?
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>Companies can find you based on proximity to their offices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>You'll appear first in searches for nearby talent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>Get priority for local internships and job opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>Your exact address remains private - only distance is shown</span>
                  </li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Privacy Information Card */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 p-6 rounded-2xl border-2 border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <span>🔒</span> Your Privacy & Security
            </h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                <strong>Personal Information:</strong> Your name, phone, and email are securely stored and only shared with employers when you apply for jobs.
              </p>
              <p>
                <strong>Location Data:</strong> Your city is visible to employers for local opportunities. Your address (if provided) is used only for distance calculations - the exact address remains private.
              </p>
              <p>
                <strong>Control:</strong> You can update or remove this information anytime in your profile settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 