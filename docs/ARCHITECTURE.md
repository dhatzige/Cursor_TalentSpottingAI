# TalentSpottingAI - Architecture Documentation

## Onboarding System Architecture

### Profile Completion Step Enhancement (January 2025)

The final step of the student onboarding process has been completely rebuilt to provide a comprehensive skills selection system and accurate profile summary display.

#### Skills System Architecture

**Data Layer** (`frontend/src/lib/data/comprehensive-skills.ts`):
- **18 Skill Categories**: Organized taxonomy covering all academic and professional domains
- **500+ Skills Database**: Comprehensive collection including programming, business, healthcare, arts, etc.
- **Intelligent Recommendations**: Academic level and field-specific skill suggestions
- **Search & Filtering**: Optimized algorithms for real-time skill discovery

**Component Architecture**:
```typescript
ProfileStep.tsx
├── Skills Input System
│   ├── Real-time autocomplete with suggestions dropdown
│   ├── Tag-based skill management (add/remove)
│   ├── Keyboard navigation and accessibility
│   └── Smart search with prioritized matching
├── Recommendation Engine
│   ├── Academic level detection (bachelor/master/phd)
│   ├── Field-specific mappings (CS → programming skills)
│   ├── One-click skill addition from recommendations
│   └── Visual feedback for selected vs available skills
└── Profile Summary Display
    ├── Real university data integration
    ├── Complete user information preview
    ├── Bio truncation and formatting
    └── Skills count and validation status
```

#### Recommendation System Logic

The skills recommendation system uses a multi-tiered approach:

1. **Academic Level Detection**:
   ```typescript
   const level = studyLevel.toLowerCase().includes('bachelor') ? 'bachelor' :
                studyLevel.toLowerCase().includes('master') ? 'master' :
                studyLevel.toLowerCase().includes('phd') ? 'phd' : 'bachelor';
   ```

2. **Field Mapping**:
   ```typescript
   const fieldMapping = {
     'computer-science': 'computer-science',
     'business-administration': 'business',
     'medicine': 'medicine',
     // ... comprehensive mapping
   };
   ```

3. **Recommendation Prioritization**:
   - General skills for academic level (always shown)
   - Field-specific skills (when applicable)
   - Contextual descriptions explaining why skills are relevant

#### Data Flow Integration

**University Data Flow**:
```
OnboardingPage → University Fetching → Selected University Object → ProfileStep
                                                                  ↓
                                      Profile Summary with Actual Data
```

**Skills Data Flow**:
```
User Input → Real-time Search → Filtered Suggestions → Selection → Tag Display
                                      ↓
Recommendations Engine → Academic Level + Field → Suggested Skills → One-click Add
```

#### Performance Optimizations

- **Search Performance**: Early termination algorithms with result limits
- **Memory Management**: Efficient Set operations for duplicate prevention
- **React Optimization**: useEffect dependencies and state batching
- **UI Responsiveness**: Debounced search with instant visual feedback

### Academic Step Enhancement System

**Location**: `frontend/src/lib/data/study-fields.ts` & `frontend/src/components/onboarding/AcademicStep.tsx`

**Features**:
- 70+ study fields across 13 professional categories
- Bilingual support (English/Greek titles)
- Autocomplete search with real-time filtering
- Professional dropdown interface
- Graduation year validation with smart defaults
- Keyboard navigation and accessibility
- Responsive design patterns

**Enhanced User Experience**:
- Smart search functionality
- Category-based organization
- Visual feedback systems
- Form validation and error handling
- Consistent design language integration

---

## Team Management System Architecture

### Equal Access Pattern

The team management system implements a democratic approach where all team members have equal access and permissions. This architectural decision simplifies the codebase and eliminates complex role-based permission systems.

#### Design Principles

1. **Democratic Access** - All team members have identical capabilities
2. **Simplified Permissions** - No role hierarchy or permission checks
3. **Clean Data Model** - Minimal database schema without role complexity
4. **Unified UI** - Single interface for all team members

#### Database Schema

```typescript
// Simplified team membership model
model OrganizationMember {
  id             String   @id @default(cuid())
  userId         String
  organizationId String
  joinedAt       DateTime @default(now())
  lastActiveAt   DateTime @default(now())
  // Note: No role field - all members are equal
}

model OrganizationInvite {
  id             String   @id @default(cuid())
  email          String
  organizationId String
  invitedBy      String
  token          String   @unique
  expiresAt      DateTime
  createdAt      DateTime @default(now())
  // Note: No role field - invites are for equal membership
}
```

#### Backend Controller Pattern

The team management controller follows a simplified pattern:

```typescript
// Equal access - any team member can perform any action
export const inviteMember = async (req: Request, res: Response) => {
  // No role checks - any member can invite
  const { email } = req.body;
  // Simple invitation logic
};

export const removeMember = async (req: Request, res: Response) => {
  // No role checks - any member can remove others
  const { memberId } = req.params;
  // Simple removal logic
};
```

#### Frontend Component Architecture

```
organization-dashboard/team/
├── page.tsx                   # Main team management page
├── components/
│   ├── InviteMemberForm.tsx   # Simple email invitation form
│   ├── TeamMemberCard.tsx     # Equal member display
│   ├── PendingInvites.tsx     # Invitation status tracking
│   └── types.ts               # Shared type definitions
```

#### API Endpoints (Equal Access)

- `POST /api/organization/invite` - Any member can invite new members
- `GET /api/organization/members` - Any member can view the team
- `DELETE /api/organization/members/:id` - Any member can remove others
- `GET /api/organization/invitations` - Any member can view pending invites

#### Benefits of Equal Access Pattern

1. **Reduced Complexity** - No permission logic or role validation
2. **Faster Development** - Simple CRUD operations without authorization layers
3. **Better UX** - No confusing role selection or permission restrictions
4. **Easier Testing** - Fewer edge cases and permission scenarios
5. **Democratic Culture** - Promotes team equality and shared responsibility

## Frontend Architecture

### Modular Component Pattern

The frontend codebase follows a strict modular component pattern to ensure maintainability, code reuse, and adherence to the 300-400 line limit rule. Each UI page is broken down into smaller, focused components that handle specific aspects of the functionality.

#### Component Structure

1. **Page Components** - Top-level components that:
   - Handle data fetching and state management
   - Orchestrate the layout of child components
   - Manage routing and navigation
   - Connect to services and API calls

2. **Feature Components** - Mid-level components that:
   - Implement specific feature functionality
   - Handle local state management
   - Delegate rendering to presentation components

3. **Presentation Components** - Low-level, reusable UI components that:
   - Focus on visual representation
   - Accept props for data display
   - Trigger callbacks for user interactions
   - Have minimal or no internal state

4. **Utility Components** - Shared components that:
   - Provide common functionality (loading states, error messages)
   - Enforce consistent UI patterns
   - Can be reused across multiple features

#### Directory Structure

```
src/app/[feature-area]/[specific-feature]/
├── page.tsx                    # Main page component
├── components/                 # Feature-specific components
│   ├── index.ts                # Consolidated exports
│   ├── types.ts                # Shared type definitions
│   ├── FeatureComponent.tsx    # Feature components
│   ├── [sub-feature]/          # Grouped sub-feature components
│   │   ├── SubComponent1.tsx
│   │   └── SubComponent2.tsx
```

#### Component Communication

Components communicate primarily through:
1. **Props** - For parent-to-child communication
2. **Callbacks** - For child-to-parent communication
3. **Context** - For cross-component state sharing (when needed)

### Examples

#### Application Page Modularity

The Applications page in the Organization Dashboard has been refactored into these components:

```
organization-dashboard/applications/
├── page.tsx                   # Main page handling data & state
├── components/                
│   ├── index.ts               # Consolidated exports
│   ├── ApplicationsHeader.tsx # Page header with job info
│   ├── StatusFilter.tsx       # Application status filtering
│   ├── ErrorDisplay.tsx       # Error message display
│   ├── ComparisonControl.tsx  # Comparison feature controls
│   ├── ApplicationsContent.tsx # Main layout container
│   ├── loading/
│   │   └── LoadingState.tsx   # Loading indicator
│   ├── empty/
│   │   ├── NoApplicationsState.tsx   # Empty state
│   │   └── NoSelectedApplicationState.tsx  # No selection
```

## Backend Architecture

### Controller Modularity

The backend follows a similar modular approach where each controller is broken down into smaller, focused functions that adhere to the 300-400 line limit rule.

#### Service Layer Pattern

Services are organized by domain function:
```
services/
├── employer/
│   ├── index.ts               # Main export
│   ├── jobs-service.ts        # Job posting operations
│   ├── applications-service.ts # Application management
│   ├── talent-search-service.ts # Candidate search
│   └── dashboard-service.ts   # Statistics and summaries
```

## TypeScript Best Practices

1. **Explicit Type Definitions**
   - Create interface or type definitions for all data structures
   - Export and reuse types across components
   - Use explicit return types for functions

2. **Type Safety in API Calls**
   - Define explicit types for request and response objects
   - Use type guards for response validation
   - Handle edge cases with union types

3. **Avoiding Implicit Any**
   - Always provide explicit types for parameters
   - Use TypeScript's built-in utility types when appropriate
   - Enable strict mode in the TypeScript config

## Performance Considerations

1. **Component Rendering Optimization**
   - Use memoization for expensive calculations
   - Implement virtualization for long lists
   - Lazy load components when appropriate

2. **Code Splitting**
   - Split code by route using Next.js dynamic imports
   - Separate vendor code from application code
   - Preload critical resources

## Integration Testing Strategy

1. **Component Testing**
   - Test each component in isolation
   - Mock dependencies and services
   - Verify component behavior with different props

2. **Integration Testing**
   - Test component integration with service layer
   - Verify proper data flow between components
   - Test user flows across multiple components

3. **End-to-End Testing**
   - Test complete user journeys
   - Verify application behavior in a production-like environment
   - Focus on critical paths and high-value features

## Conclusion

This modular architecture enables the team to:
1. Maintain a clean and organized codebase
2. Scale development across multiple developers
3. Reuse components across different features
4. Test components in isolation
5. Improve performance through targeted optimizations

By following these patterns consistently, we ensure that the codebase remains maintainable and scalable as the application grows.
