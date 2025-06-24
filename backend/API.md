# TalentSpottingAI API Documentation

## Overview
This document outlines the available endpoints in the TalentSpottingAI API, organized by user role.

## Base URL
All endpoints are prefixed with `/api`.

## Authentication
Most endpoints require JWT authentication using the Bearer token scheme:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required | 
|--------|----------|-------------|--------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and get JWT token | No |
| GET | `/auth/profile` | Get current user profile | Yes |

### Admin Routes
All admin routes require authentication with admin role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard/stats` | Get admin dashboard statistics |
| GET | `/admin/dashboard/activity` | Get recent platform activity |

### Student Routes
All student routes require authentication with student role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/student/dashboard/stats` | Get student dashboard statistics |
| GET | `/student/recommended-jobs` | Get job recommendations for student |
| GET | `/student/applications` | Get student's applications status |

### Employer Routes
All employer routes require authentication with employer role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employer/dashboard/stats` | Get organization dashboard statistics |
| GET | `/employer/jobs/active` | Get active job listings |
| GET | `/employer/candidates/top` | Get top candidates for organization |

### University Routes
All university routes require authentication with university role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/university/dashboard/stats` | Get university dashboard statistics |
| GET | `/university/placements` | Get student placement data by degree |
| GET | `/university/employer-partners` | Get university's employer partners |

### Organization Team Management Routes
All team management routes require authentication with organization member role. **Note: All team members have equal access - no role hierarchy.**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/organization/invite` | Invite new team member (any member can invite) |
| GET | `/organization/members` | Get all team members (any member can view) |
| DELETE | `/organization/members/:id` | Remove team member (any member can remove others) |
| GET | `/organization/invitations` | Get pending invitations (any member can view) |
| POST | `/organization/invitations/:token/accept` | Accept team invitation |

## Request/Response Examples

### Authentication

#### Register
```
POST /api/auth/register
```

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "student"
}
```

Response (201 Created):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student",
    "createdAt": "2023-05-17T14:30:00.000Z",
    "updatedAt": "2023-05-17T14:30:00.000Z"
  }
}
```

#### Login
```
POST /api/auth/login
```

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response (200 OK):
```json
{
  "message": "Login successful",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student",
    "createdAt": "2023-05-17T14:30:00.000Z",
    "updatedAt": "2023-05-17T14:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Organization Team Management

#### Invite Team Member
```
POST /api/organization/invite
```

Request:
```json
{
  "email": "newmember@company.com"
}
```

Response (201 Created):
```json
{
  "message": "Invitation sent successfully",
  "invitation": {
    "id": "inv_123456",
    "email": "newmember@company.com",
    "token": "abc123def456",
    "expiresAt": "2023-05-24T14:30:00.000Z",
    "createdAt": "2023-05-17T14:30:00.000Z"
  }
}
```

#### Get Team Members
```
GET /api/organization/members
```

Response (200 OK):
```json
{
  "members": [
    {
      "id": "member_123",
      "user": {
        "name": "John Doe",
        "email": "john@company.com"
      },
      "joinedAt": "2023-05-01T10:00:00.000Z",
      "lastActiveAt": "2023-05-17T14:30:00.000Z"
    }
  ]
}
```

#### Remove Team Member
```
DELETE /api/organization/members/member_123
```

Response (200 OK):
```json
{
  "message": "Team member removed successfully"
}
```
