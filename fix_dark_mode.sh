#!/bin/bash

# TalentSpottingAI Dark Mode Test Script
# This script helps test and verify dark mode compatibility across dashboard components

# Set the base directory
BASE_DIR="/Users/dimxatz/Desktop/WindsurfAI projects/Windsurf_TalentSpottingAI_v1/frontend"

# Components updated for dark mode
components=(
  "src/components/dashboard/DashboardHeader.tsx"
  "src/components/dashboard/DashboardSidebar.tsx"
  "src/components/dashboard/StatCard.tsx"
  "src/components/dashboard/ActivityCard.tsx"
  "src/app/components/dashboard/StatCard.tsx"
  "src/app/components/dashboard/ActivityCard.tsx"
  "src/components/ui/input.tsx"
  "src/components/ui/button.tsx"
  "src/components/ui/card.tsx"
  "src/app/organization-dashboard/applications/components/StatusFilter.tsx"
  "src/app/organization-dashboard/applications/components/ApplicationsFilterBar.tsx"
  "src/app/organization-dashboard/applications/components/ApplicationDetails.tsx"
  "src/app/organization-dashboard/applications/components/CandidateScoreCard.tsx"
  "src/app/university-dashboard/EmployerPartners.tsx"
  "src/app/university-dashboard/StudentPlacement.tsx"
  "src/components/employer/TalentSearchForm.tsx"
)

# Function to check if a file has been updated for dark mode
check_dark_mode() {
  local file=$1
  local has_dark_mode=false
  
  if [ -f "$BASE_DIR/$file" ]; then
    # Check for dark mode classes in the file
    if grep -q "dark:" "$BASE_DIR/$file"; then
      has_dark_mode=true
      echo "✅ $file has dark mode support"
    else
      echo "❌ $file may not have dark mode support"
    fi
  else
    echo "⚠️ $file not found"
  fi
}

clear
echo "===== TalentSpottingAI Dark Mode Test Script ====="
echo "This script will help you test the dark mode implementation."
echo 

echo "Components Updated for Dark Mode:"
echo "--------------------------------"

# Check each component for dark mode classes
for component in "${components[@]}"; do
  check_dark_mode "$component"
done

echo 
echo "To test dark mode compatibility:"
echo "1. Start the development server with: cd $BASE_DIR && npm run dev"
echo "2. Open the browser and navigate to each dashboard:"
echo "   - http://localhost:3000/organization-dashboard"
echo "   - http://localhost:3000/university-dashboard"
echo "   - http://localhost:3000/admin-dashboard"
echo "   - http://localhost:3000/student-dashboard"
echo "3. Verify that all components have proper dark mode styling"
echo "4. Check for any contrast issues or inconsistencies"
echo 

echo "Do you want to start the development server now? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  cd "$BASE_DIR" && npm run dev
else
  echo "Script completed. You can manually test dark mode later."
fi
