/**
 * Skills Extractor
 * 
 * Extracts skills from resume text content using keyword matching,
 * section analysis, and NLP techniques
 */
import * as natural from 'natural';

// Collections of known skills for matching
const COMMON_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'react', 'vue', 'angular',
  'nodejs', 'express', 'mongodb', 'postgresql', 'sql', 'mysql', 'aws', 'azure', 'gcp',
  'docker', 'kubernetes', 'git', 'agile', 'scrum', 'jira', 'project management',
  'machine learning', 'data science', 'ai', 'nlp', 'cloud computing', 'devops',
  'leadership', 'team management', 'communication', 'problem solving',
  'html', 'css', 'sass', 'scss', 'webpack', 'babel', 'rest api', 'graphql',
  'redux', 'vuex', 'jquery', 'bootstrap', 'tailwind', 'material ui',
  'testing', 'jest', 'mocha', 'cypress', 'selenium', 'qa', 'ci/cd'
];

/**
 * Extract skills from resume text 
 */
export function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(lowerText);
  
  // Find skills from the common skills list
  const foundSkills = new Set<string>();
  
  // Look for individual skills in the entire document
  COMMON_SKILLS.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.add(skill);
    }
  });
  
  // Look for skills in skills section (if it exists)
  const skillSection = extractSkillsSection(text);
  if (skillSection) {
    analyzeSkillSection(skillSection, foundSkills);
  }
  
  return Array.from(foundSkills);
}

/**
 * Extract the skills section from a resume
 */
function extractSkillsSection(text: string): string | null {
  // Try various section header patterns for "skills"
  const skillsSectionRegex = /(?:technical skills|skills|proficiencies|competencies|areas of expertise)[\\s\\n]*[:;-]?([\\s\\S]*?)(?:education|experience|projects|achievements|certification|references|languages|\\n\\n\\n)/i;
  const skillsSectionMatch = text.match(skillsSectionRegex);
  
  if (skillsSectionMatch && skillsSectionMatch[1]) {
    return skillsSectionMatch[1].trim();
  }
  
  return null;
}

/**
 * Analyze the skills section for additional skills
 */
function analyzeSkillSection(skillsSection: string, foundSkills: Set<string>): void {
  const lowerSection = skillsSection.toLowerCase();
  
  // Extract skills from the skills section (more likely to be actual skills)
  COMMON_SKILLS.forEach(skill => {
    if (lowerSection.includes(skill.toLowerCase())) {
      foundSkills.add(skill);
    }
  });
  
  // Extract skills separated by commas, bullets, or new lines
  const skillListPattern = /(?:^|\n|•|,|\|)\\s*([a-zA-Z0-9#\\+]+(?:\\s+[a-zA-Z0-9#\\+]+){0,5})\\s*(?:$|,|•|\n|\|)/g;
  let match;
  
  while ((match = skillListPattern.exec(skillsSection)) !== null) {
    const potentialSkill = match[1].trim().toLowerCase();
    
    // Filter out noise or extremely short tokens
    if (potentialSkill && potentialSkill.length > 2 && !potentialSkill.match(/^(and|with|or|the|[0-9]+)$/i)) {
      // Check if it's similar to a known skill or looks like a technical skill
      const isTechnicalLooking = /^[a-zA-Z0-9#\\.\\+]+$/.test(potentialSkill) && 
        (potentialSkill.length >= 3 || potentialSkill.includes('#') || potentialSkill.includes('+'));
        
      if (isTechnicalLooking) {
        foundSkills.add(potentialSkill);
      }
    }
  }
}
