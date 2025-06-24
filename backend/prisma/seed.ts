import { PrismaClient, UserRole, AdminRole, VerificationStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Comprehensive Greek Universities Data
const GREEK_UNIVERSITIES = [
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

async function main() {
  console.log('🌱 Start seeding ...');

  const saltRounds = 10;
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create a default admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@talentspotting.ai' },
    update: {},
    create: {
      email: 'admin@talentspotting.ai',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
      adminRole: AdminRole.SUPER_ADMIN,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      dashboardCode: 'ADMIN001'
    },
  });

  console.log('✅ Created admin user with email: admin@talentspotting.ai');

  // Seed universities
  console.log('🏛️  Seeding universities...');
  for (const uni of GREEK_UNIVERSITIES) {
    await prisma.university.upsert({
      where: { id: uni.id },
      update: {},
      create: {
        id: uni.id,
        name: uni.name,
        nameEn: uni.nameEn,
        type: uni.type,
        city: uni.city,
        location: uni.city + ', Greece',
        emailDomains: uni.emailDomains,
        website: uni.website,
        established: uni.established,
        isActive: true
      }
    });
    console.log(`✅ Created university: ${uni.nameEn}`);
  }

  // Create comprehensive test users for development
  console.log('👥 Creating comprehensive test users...');
  
  // 1. Student User with Complete Profile
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@uoa.gr' },
    update: {},
    create: {
      email: 'student@uoa.gr',
      name: 'Maria Papadopoulos',
      password: hashedPassword,
      role: UserRole.STUDENT,
      universityId: 'uoa',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      dashboardCode: 'STU2024001'
    }
  });

  // Create student record
  if (studentUser) {
    await prisma.student.upsert({
      where: { userId: studentUser.id },
      update: {},
      create: {
        userId: studentUser.id,
        placed: false
      }
    });
    console.log('👩‍🎓 Created student record for Maria Papadopoulos');
  }

  // 2. Employer User with Organization
  const employerUser = await prisma.user.upsert({
    where: { email: 'hr@techstartup.gr' },
    update: {},
    create: {
      email: 'hr@techstartup.gr',
      name: 'Dimitris Kostas',
      password: hashedPassword,
      role: UserRole.EMPLOYER,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      dashboardCode: 'EMP2024001'
    }
  });

  // Create organization for the employer
  let organization = null;
  if (employerUser) {
    organization = await prisma.organization.upsert({
      where: { id: `org-${employerUser.id}` },
      update: {},
      create: {
        id: `org-${employerUser.id}`,
        name: 'TechStartup Greece',
        industry: 'Technology',
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date()
      }
    });

    // Update user with organization
    await prisma.user.update({
      where: { id: employerUser.id },
      data: { organizationId: organization.id }
    });

    // Create employer record
    await prisma.employer.upsert({
      where: { id: `emp-${employerUser.id}` },
      update: {},
      create: {
        id: `emp-${employerUser.id}`,
        name: 'TechStartup Greece',
        industry: 'Technology'
      }
    });
    console.log('🏢 Created employer and organization for TechStartup Greece');

    // Create organization members for testing team management
    await prisma.organizationMember.upsert({
      where: { 
        userId_organizationId: {
          userId: employerUser.id,
          organizationId: organization.id
        }
      },
      update: {},
      create: {
        userId: employerUser.id,
        organizationId: organization.id,
        acceptedAt: new Date(),
        isActive: true
      }
    });

    // Create additional team members for testing
    const additionalMembers = [
      {
        email: 'john.doe@techstartup.gr',
        name: 'John Doe'
      },
      {
        email: 'jane.smith@techstartup.gr', 
        name: 'Jane Smith'
      }
    ];

    for (const member of additionalMembers) {
      const memberUser = await prisma.user.upsert({
        where: { email: member.email },
        update: {},
        create: {
          email: member.email,
          name: member.name,
          password: hashedPassword,
          role: UserRole.EMPLOYER,
          organizationId: organization.id,
          verificationStatus: VerificationStatus.VERIFIED,
          verifiedAt: new Date(),
          dashboardCode: `EMP${Date.now()}`
        }
      });

      await prisma.organizationMember.upsert({
        where: {
          userId_organizationId: {
            userId: memberUser.id,
            organizationId: organization.id
          }
        },
        update: {},
        create: {
          userId: memberUser.id,
          organizationId: organization.id,
          invitedById: employerUser.id,
          acceptedAt: new Date(),
          isActive: true
        }
      });
    }

    // Create a pending invitation for testing
    await prisma.organizationInvite.upsert({
      where: { token: 'test-invitation-token-123' },
      update: {
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Reset expiry
      },
      create: {
        email: 'pending@techstartup.gr',
        organizationId: organization.id,
        token: 'test-invitation-token-123',
        invitedBy: employerUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });

    console.log('👥 Created organization team members and test invitation');
  }

  // 3. University Admin User
  const universityUser = await prisma.user.upsert({
    where: { email: 'career@auth.gr' },
    update: {},
    create: {
      email: 'career@auth.gr',
      name: 'Prof. Elena Katsarou',
      password: hashedPassword,
      role: UserRole.UNIVERSITY,
      universityId: 'auth',
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      dashboardCode: 'UNI2024001'
    }
  });
  console.log('🎓 Created university admin for AUTH Career Services');

  // Create some sample job postings
  console.log('💼 Creating sample job postings...');
  
  if (employerUser && organization) {
    const sampleJobs = [
      {
        title: 'Frontend Developer Intern',
        description: 'Join our team as a frontend developer intern. Work with React, TypeScript, and modern web technologies.',
        organizationId: organization.id,
        postedById: employerUser.id
      },
      {
        title: 'Backend Developer',
        description: 'Seeking a junior backend developer to work on our microservices architecture.',
        organizationId: organization.id,
        postedById: employerUser.id
      }
    ];

    // Create jobs
    for (const job of sampleJobs) {
      await prisma.job.create({
        data: job
      });
    }
    console.log('💼 Created sample job postings');
  }

  console.log('\n🎉 Seeding finished successfully!');
  console.log('\n📋 Test Accounts Created:');
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│                    TEST CREDENTIALS                     │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│ 👩‍🎓 STUDENT: student@uoa.gr / password123               │');
  console.log('│    → Maria Papadopoulos (Computer Science, UOA)        │');
  console.log('│                                                         │');
  console.log('│ 🏢 EMPLOYER: hr@techstartup.gr / password123            │');
  console.log('│    → Dimitris Kostas (TechStartup Greece)              │');
  console.log('│                                                         │');
  console.log('│ 👥 TEAM MEMBERS: password123 for all                    │');
  console.log('│    → john.doe@techstartup.gr (Team Member)             │');
  console.log('│    → jane.smith@techstartup.gr (Team Member)           │');
  console.log('│                                                         │');
  console.log('│ 🎓 UNIVERSITY: career@auth.gr / password123             │');
  console.log('│    → Prof. Elena Katsarou (AUTH Career Services)       │');
  console.log('│                                                         │');
  console.log('│ ⚡ ADMIN: admin@talentspotting.ai / password123          │');
  console.log('│    → Super Admin (Full Access)                         │');
  console.log('└─────────────────────────────────────────────────────────┘');
  console.log('\n🚀 Usage Options:');
  console.log('• 🎯 RECOMMENDED: http://localhost:3001/dev-dashboard');
  console.log('• 🔐 Real Login: http://localhost:3001/sign-in');
  console.log('• ⚡ Dev Bypass: Add ?dev_bypass=true to any dashboard URL');
  console.log('\n💡 Servers:');
  console.log('• Backend: cd backend && npm run dev');
  console.log('• Frontend: cd frontend && npm run dev');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
