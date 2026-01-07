# Bookwise - Library Enterprise Platform

**Version:** 1.0.0  
**Tech Stack:** Next.js 15, Drizzle ORM, Upstash Redis, QStash, NextAuth.js, Nodemailer

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack Details](#tech-stack-details)
4. [Features](#features)
5. [Database Schema](#database-schema)
6. [Authentication Flow](#authentication-flow)
7. [User Workflows](#user-workflows)
8. [Admin Workflows](#admin-workflows)
9. [Email Notifications](#email-notifications)
10. [Rate Limiting](#rate-limiting)
11. [API Endpoints](#api-endpoints)
12. [Environment Variables](#environment-variables)
13. [Installation & Setup](#installation--setup)
14. [Deployment](#deployment)
15. [Security Considerations](#security-considerations)
16. [Troubleshooting](#troubleshooting)

---

## Overview

Bookwise is a comprehensive library enterprise platform that enables educational institutions and organizations to manage their book lending operations efficiently. The platform provides a complete workflow from user registration to book borrowing and automated deadline management.

### Key Capabilities

- **User Management**: Email-based authentication with admin approval workflow
- **Book Catalog**: Browse, search, and manage library inventory
- **Borrowing System**: Request, approve, and track book loans
- **Automated Notifications**: Deadline reminders via scheduled emails
- **Admin Dashboard**: Centralized control for user and book management
- **Rate Limiting**: Protected authentication endpoints against abuse

---

## Architecture

### System Architecture

```
┌─────────────────┐
│   Client (Web)  │
│   Next.js App   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Next.js Server │
│  (App Router)   │
├─────────────────┤
│  NextAuth.js    │
│  Authentication │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬─────────────┐
    ↓         ↓          ↓             ↓
┌─────┐  ┌────────┐  ┌───────┐  ┌──────────┐
│Redis│  │Postgres│  │QStash │  │Nodemailer│
│Cache│  │ (DB)   │  │(Queue)│  │ (Email)  │
└─────┘  └────────┘  └───────┘  └──────────┘
```

### Application Flow

1. **Registration**: User signs up → Email verification sent → Admin approval required
2. **Authentication**: Rate-limited login → Session management via NextAuth
3. **Browsing**: Users explore catalog → View book details and availability
4. **Borrowing**: User requests book → Admin approves → QStash schedules reminders
5. **Returns**: User returns book → Admin confirms → System updates availability
6. **Notifications**: QStash triggers emails 2 days before deadline and on due date

---

## Tech Stack Details

### Frontend
- **Next.js 15**: React framework with App Router for server-side rendering
- **React 19**: UI component library
- **Tailwind CSS**: Utility-first styling framework
- **shadcn/ui**: Pre-built accessible components

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **NextAuth.js**: Authentication and session management
- **Drizzle ORM**: Type-safe database queries and migrations

### Database
- **PostgreSQL**: Primary database (via Vercel Postgres/Neon/Supabase)
- **Drizzle Schema**: Type-safe schema definitions

### Caching & Rate Limiting
- **Upstash Redis**: Serverless Redis for rate limiting and caching
- **@upstash/ratelimit**: Redis-based rate limiting

### Queue & Scheduling
- **QStash**: HTTP-based message queue and scheduler
- **Use Case**: Scheduled email reminders for book due dates

### Email Service
- **Nodemailer**: Email sending library
- **SMTP Configuration**: Supports Gmail, custom SMTP servers

### Additional Tools
- **TypeScript**: Type safety throughout the application
- **ESLint**: Code quality and consistency
- **Zod**: Runtime validation for forms and API inputs

---

## Features

### User Features

#### 1. Registration & Authentication
- Email-based registration with verification
- Password hashing and secure storage
- Account status: Pending → Approved → Active
- Session management with JWT tokens

#### 2. Book Browsing
- Search books by title, author, or genre
- Filter by availability status
- View detailed book information (cover, description, ISBN)
- See borrowing history

#### 3. Book Borrowing
- Request to borrow available books
- View borrowing status (Pending, Approved, Borrowed)
- Receive confirmation emails
- Track due dates and return deadlines

#### 4. Book Returns
- Initiate return request
- Admin verification process
- Automatic status updates

### Admin Features

#### 1. User Management
- View all registered users
- Approve/reject user registrations
- Monitor user borrowing history
- Suspend or activate accounts

#### 2. Book Management
- Add new books to the catalog
- Edit book details (title, author, ISBN, cover image)
- Update availability status
- Remove books from inventory

#### 3. Borrowing Management
- Approve/reject borrow requests
- Manually assign books to users
- Process return requests
- View overdue books dashboard

#### 4. System Monitoring
- View active loans
- Track overdue books
- Generate reports (future feature)

---

## Database Schema

### Users Table

```typescript
users {
  id: uuid (primary key)
  email: string (unique)
  password: string (hashed)
  fullName: string
  universityId: string
  universityCard: string (URL to uploaded ID)
  status: enum ('pending', 'approved', 'rejected')
  role: enum ('user', 'admin')
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Books Table

```typescript
books {
  id: uuid (primary key)
  title: string
  author: string
  genre: string
  rating: float
  totalCopies: integer
  availableCopies: integer
  description: text
  coverUrl: string
  coverColor: string
  videoUrl: string (optional)
  summary: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Borrow Records Table

```typescript
borrowRecords {
  id: uuid (primary key)
  userId: uuid (foreign key → users.id)
  bookId: uuid (foreign key → books.id)
  status: enum ('pending', 'approved', 'borrowed', 'returned', 'overdue')
  borrowDate: timestamp
  dueDate: timestamp
  returnDate: timestamp (nullable)
  approvedBy: uuid (foreign key → users.id, nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Relationships

- **Users → BorrowRecords**: One-to-Many (one user can have multiple borrow records)
- **Books → BorrowRecords**: One-to-Many (one book can have multiple borrow records)
- **Admins → BorrowRecords**: One-to-Many (admin approval tracking)

---

## Authentication Flow

### 1. Registration Process

```
User Submits Form
    ↓
Validate Input (Zod)
    ↓
Check Rate Limit (Redis)
    ↓
Hash Password (bcrypt)
    ↓
Create User Record (status: pending)
    ↓
Send Verification Email (Nodemailer)
    ↓
Return Success Response
```

**Implementation:**

```typescript
// app/api/auth/signup/route.ts
export async function POST(request: Request) {
  // Rate limiting check
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(identifier);
  
  if (!success) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  // Validate input
  const body = await request.json();
  const validatedData = signupSchema.parse(body);

  // Hash password
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  // Create user
  const user = await db.insert(users).values({
    email: validatedData.email,
    password: hashedPassword,
    fullName: validatedData.fullName,
    status: 'pending'
  });

  // Send verification email
  await sendVerificationEmail(user.email);

  return Response.json({ success: true });
}
```

### 2. Email Verification

**Verification Email Content:**

```
Subject: Verify Your Bookwise Account

Hello [User Name],

Thank you for registering with Bookwise! Please verify your email address by clicking the link below:

[Verification Link]

This link will expire in 24 hours.

Note: Your account requires admin approval before you can start borrowing books.

Best regards,
The Bookwise Team
```

### 3. Admin Approval

```
Admin Logs In
    ↓
Views Pending Users Dashboard
    ↓
Reviews User Details
    ↓
Approves/Rejects User
    ↓
Update User Status in DB
    ↓
Send Approval/Rejection Email
    ↓
User Can Now Login (if approved)
```

### 4. Login Process

```
User Submits Credentials
    ↓
Check Rate Limit (Redis)
    ↓
Validate Credentials (NextAuth)
    ↓
Check User Status (approved?)
    ↓
Create Session (JWT)
    ↓
Redirect to Dashboard
```

**NextAuth Configuration:**

```typescript
// auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Rate limit check
        const { success } = await ratelimit.limit(credentials.email);
        if (!success) throw new Error('Too many login attempts');

        // Verify credentials
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email)
        });

        if (!user) throw new Error('Invalid credentials');

        // Check account status
        if (user.status !== 'approved') {
          throw new Error('Account pending approval');
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error('Invalid credentials');

        return { id: user.id, email: user.email, role: user.role };
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/sign-in',
    error: '/error'
  }
};
```

---

## User Workflows

### Browsing Books

**Flow:**

1. User navigates to `/books` page
2. Server fetches books from database with availability
3. Client displays book grid with filters
4. User can search, filter by genre, or sort by rating
5. Click on book card to view details

**Implementation:**

```typescript
// app/books/page.tsx
export default async function BooksPage({ searchParams }) {
  const books = await db.query.books.findMany({
    where: searchParams.search 
      ? like(books.title, `%${searchParams.search}%`)
      : undefined,
    orderBy: [desc(books.rating)]
  });

  return <BookGrid books={books} />;
}
```

### Borrowing a Book

**Step-by-Step Flow:**

1. **User Action**: Click "Borrow" button on book page
2. **Client Validation**: Check if book is available
3. **API Request**: POST `/api/borrow`
4. **Server Processing**:
   - Verify user session
   - Check book availability
   - Create borrow record with status "pending"
   - Decrement available copies
5. **Admin Notification**: Email sent to admin
6. **Response**: Show success message to user

**API Endpoint:**

```typescript
// app/api/borrow/route.ts
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { bookId } = await request.json();

  // Check availability
  const book = await db.query.books.findFirst({
    where: eq(books.id, bookId)
  });

  if (book.availableCopies < 1) {
    return Response.json({ error: 'Book not available' }, { status: 400 });
  }

  // Create borrow record
  const borrowRecord = await db.insert(borrowRecords).values({
    userId: session.user.id,
    bookId: bookId,
    status: 'pending',
    dueDate: addDays(new Date(), 14) // 2 weeks
  }).returning();

  // Update book availability
  await db.update(books)
    .set({ availableCopies: sql`${books.availableCopies} - 1` })
    .where(eq(books.id, bookId));

  // Notify admin
  await sendAdminNotification(borrowRecord);

  return Response.json({ success: true, borrowId: borrowRecord.id });
}
```

### Returning a Book

**Flow:**

1. User clicks "Return Book" from their borrowed books list
2. System creates return request
3. Admin receives notification
4. Admin verifies physical return
5. Admin approves return in system
6. Book status updated, available copies incremented
7. QStash scheduled emails cancelled

---

## Admin Workflows

### Approving a User

**Dashboard View:**

```
┌─────────────────────────────────────────┐
│ Pending User Approvals                  │
├─────────────────────────────────────────┤
│ Name: John Doe                          │
│ Email: john@university.edu              │
│ University ID: U123456                  │
│ ID Card: [View Document]                │
│                                         │
│ [Approve] [Reject]                      │
└─────────────────────────────────────────┘
```

**Implementation:**

```typescript
// app/api/admin/approve-user/route.ts
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check admin role
  if (session?.user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId, action } = await request.json();

  // Update user status
  await db.update(users)
    .set({ 
      status: action === 'approve' ? 'approved' : 'rejected',
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));

  // Send notification email
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  });

  if (action === 'approve') {
    await sendApprovalEmail(user.email, user.fullName);
  } else {
    await sendRejectionEmail(user.email, user.fullName);
  }

  return Response.json({ success: true });
}
```

### Approving a Borrow Request

**Flow:**

1. Admin views pending borrow requests dashboard
2. Verifies book availability
3. Approves request
4. System updates borrow record status to "borrowed"
5. QStash schedules reminder emails
6. User receives confirmation email

**QStash Integration:**

```typescript
// Schedule reminder emails
import { Client } from '@upstash/qstash';

const qstashClient = new Client({ token: process.env.QSTASH_TOKEN });

async function scheduleBorrowReminders(borrowRecord) {
  const twoDaysBefore = subDays(borrowRecord.dueDate, 2);
  const onDueDate = borrowRecord.dueDate;

  // Schedule first reminder (2 days before)
  await qstashClient.publishJSON({
    url: `${process.env.APP_URL}/api/webhooks/send-reminder`,
    body: {
      borrowId: borrowRecord.id,
      type: 'two_day_warning'
    },
    notBefore: Math.floor(twoDaysBefore.getTime() / 1000)
  });

  // Schedule due date reminder
  await qstashClient.publishJSON({
    url: `${process.env.APP_URL}/api/webhooks/send-reminder`,
    body: {
      borrowId: borrowRecord.id,
      type: 'due_date'
    },
    notBefore: Math.floor(onDueDate.getTime() / 1000)
  });

  // Schedule overdue check
  const oneDayAfter = addDays(onDueDate, 1);
  await qstashClient.publishJSON({
    url: `${process.env.APP_URL}/api/webhooks/check-overdue`,
    body: { borrowId: borrowRecord.id },
    notBefore: Math.floor(oneDayAfter.getTime() / 1000)
  });
}
```

### Adding a New Book

**Form Fields:**

- Title (required)
- Author (required)
- Genre (required)
- ISBN (optional)
- Total Copies (required)
- Description (required)
- Cover Image URL (required)
- Cover Color (for UI theming)
- Video URL (optional)
- Summary (optional)

**Validation:**

```typescript
const bookSchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(100),
  genre: z.string().min(1),
  totalCopies: z.number().int().positive(),
  description: z.string().min(50),
  coverUrl: z.string().url(),
  coverColor: z.string().regex(/^#[0-9A-F]{6}$/i)
});
```

---

## Email Notifications

### Email Types

#### 1. Verification Email
**Trigger**: User signs up  
**Template**:
```
Subject: Verify Your Bookwise Account

Hi [Name],

Welcome to Bookwise! Click below to verify your email:
[Verification Link]

Your account will be reviewed by our admin team.

Thanks,
Bookwise Team
```

#### 2. Approval Email
**Trigger**: Admin approves user  
**Template**:
```
Subject: Your Bookwise Account Has Been Approved!

Hi [Name],

Great news! Your account has been approved.
You can now log in and start borrowing books.

[Login Link]

Happy reading!
Bookwise Team
```

#### 3. Borrow Confirmation
**Trigger**: Admin approves borrow request  
**Template**:
```
Subject: Book Borrowed Successfully

Hi [Name],

Your request to borrow "[Book Title]" has been approved!

Borrow Date: [Date]
Due Date: [Date]
Return Location: [Library Address]

You'll receive a reminder 2 days before the due date.

Bookwise Team
```

#### 4. Two-Day Reminder
**Trigger**: QStash scheduled (2 days before due date)  
**Template**:
```
Subject: Reminder: Book Due in 2 Days

Hi [Name],

This is a reminder that "[Book Title]" is due on [Date].

Please return it on time to avoid late fees.

Need to extend? Contact the library.

Bookwise Team
```

#### 5. Due Date Reminder
**Trigger**: QStash scheduled (on due date)  
**Template**:
```
Subject: Book Due Today!

Hi [Name],

"[Book Title]" is due today!

Please return it to avoid overdue status.

Bookwise Team
```

#### 6. Overdue Notice
**Trigger**: QStash checks day after due date  
**Template**:
```
Subject: Overdue Book Notice

Hi [Name],

"[Book Title]" was due on [Date] and is now overdue.

Please return it as soon as possible.
Late fees may apply.

Bookwise Team
```

### Nodemailer Configuration

```typescript
// lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}
```

---

## Rate Limiting

### Strategy

Bookwise implements Redis-based rate limiting using Upstash to prevent abuse on authentication endpoints.

### Configuration

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

// Login rate limit: 5 attempts per 15 minutes
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true
});

// Signup rate limit: 3 attempts per hour
export const signupRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '60 m'),
  analytics: true
});

// General API rate limit: 100 requests per minute
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true
});
```

### Protected Endpoints

| Endpoint | Rate Limit | Window |
|----------|-----------|---------|
| `/api/auth/signin` | 5 requests | 15 minutes |
| `/api/auth/signup` | 3 requests | 1 hour |
| `/api/borrow` | 10 requests | 1 hour |
| `/api/*` (general) | 100 requests | 1 minute |

### Implementation Example

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import { apiRateLimit } from '@/lib/rate-limit';

export async function middleware(request) {
  const identifier = 
    request.headers.get('x-forwarded-for') || 
    request.ip || 
    'anonymous';

  const { success, pending, limit, reset, remaining } = 
    await apiRateLimit.limit(identifier);

  const response = success
    ? NextResponse.next()
    : NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );

  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());

  return response;
}

export const config = {
  matcher: '/api/:path*'
};
```

---

## API Endpoints

### Authentication

#### POST `/api/auth/signup`
**Description**: Register a new user  
**Rate Limit**: 3 per hour  
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "universityId": "U123456",
  "universityCard": "https://storage.url/card.jpg"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

#### POST `/api/auth/signin`
**Description**: Login user  
**Rate Limit**: 5 per 15 minutes  
**Handled by**: NextAuth.js

### Books

#### GET `/api/books`
**Description**: Get all books with filters  
**Query Parameters**:
- `search`: string (optional)
- `genre`: string (optional)
- `available`: boolean (optional)

**Response**:
```json
{
  "books": [
    {
      "id": "uuid",
      "title": "Book Title",
      "author": "Author Name",
      "availableCopies": 3,
      "totalCopies": 5,
      "coverUrl": "https://...",
      "rating": 4.5
    }
  ]
}
```

#### GET `/api/books/[id]`
**Description**: Get single book details

#### POST `/api/admin/books` (Admin Only)
**Description**: Add new book  
**Request Body**:
```json
{
  "title": "New Book",
  "author": "Author",
  "genre": "Fiction",
  "totalCopies": 5,
  "description": "...",
  "coverUrl": "https://..."
}
```

### Borrowing

#### POST `/api/borrow`
**Description**: Request to borrow a book  
**Rate Limit**: 10 per hour  
**Authentication**: Required  
**Request Body**:
```json
{
  "bookId": "uuid"
}
```

#### GET `/api/my-borrows`
**Description**: Get user's borrow history  
**Authentication**: Required

#### POST `/api/admin/approve-borrow` (Admin Only)
**Description**: Approve borrow request  
**Request Body**:
```json
{
  "borrowId": "uuid"
}
```

### Admin

#### GET `/api/admin/pending-users` (Admin Only)
**Description**: Get users pending approval

#### POST `/api/admin/approve-user` (Admin Only)
**Description**: Approve/reject user  
**Request Body**:
```json
{
  "userId": "uuid",
  "action": "approve" | "reject"
}
```

#### GET `/api/admin/overdue-books` (Admin Only)
**Description**: Get list of overdue books

### Webhooks

#### POST `/api/webhooks/send-reminder`
**Description**: QStash webhook for sending reminders  
**Authentication**: QStash signature verification  
**Request Body**:
```json
{
  "borrowId": "uuid",
  "type": "two_day_warning" | "due_date"
}
```

#### POST `/api/webhooks/check-overdue`
**Description**: QStash webhook for checking overdue books  
**Request Body**:
```json
{
  "borrowId": "uuid"
}
```

---

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/bookwise"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32

# Upstash Redis (Rate Limiting & Caching)
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# QStash (Scheduled Emails)
QSTASH_URL="https://qstash.upstash.io/v2/publish"
QSTASH_TOKEN="your-qstash-token"
QSTASH_CURRENT_SIGNING_KEY="your-signing-key"
QSTASH_NEXT_SIGNING_KEY="your-next-signing-key"

# Email (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="465"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="Bookwise <noreply@bookwise.com>"

# App Configuration
APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Getting API Keys

#### Upstash Redis
1. Go to [upstash.com](https://upstash.com)
2. Create account and database
3. Copy REST URL and token

#### QStash
1. Same Upstash account
2. Go to QStash section
3. Copy token and signing keys

#### Gmail SMTP
1. Enable 2-factor authentication
2. Generate app password
3. Use in EMAIL_PASSWORD

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Upstash account (Redis & QStash)
- SMTP email account

### Step-by-Step Installation

#### 1. Clone Repository
```bash
git clone https://github.com/rahulCoder9417/Library.git
cd Library
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

#### 4. Setup Database
```bash
# Generate Drizzle migrations
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Seed database with sample data
npm run db:seed
```

#### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

#### 6. Create Admin User

Run this script to create your first admin:

```bash
npm run create-admin
```

Or manually insert into database:

```sql
INSERT INTO users (email, password, full_name, status, role)
VALUES (
  'admin@bookwise.com',
  -- Use bcrypt to hash password: password123
  '$2b$10$xxxxxxxxxxxxxxxxxxx',
  'Admin User',
  'approved',
  'admin'
);
```

---

## Deployment

### Vercel Deployment (Recommended)

#### 1. Prepare Production Database

Use one of these PostgreSQL providers:
- **Vercel Postgres** (integrated)
- **Neon** (serverless)
- **Supabase** (includes auth features)

#### 2. Configure Environment Variables

In Vercel dashboard, add all environment variables from `.env.local`

#### 3. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect GitHub repository in Vercel dashboard for auto-deployment.

#### 4. Run Migrations

```bash
# From local machine with production DATABASE_URL
npm run db:push
```

#### 5. Verify QStash Webhooks

Update QStash webhook URLs to production domain:
- `https://your-app.vercel.app/api/webhooks/send-reminder`
- `https://your-app.vercel.app/api/webhooks/check-overdue`

### Alternative: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t bookwise .
docker run -p 3000:3000 --env-file .env.local bookwise
```

---

## Security Considerations

### 1. Authentication Security

- **Password Hashing**: Uses bcrypt with salt rounds of 10
- **Session Management**: JWT tokens with 30-day expiration
- **CSRF Protection**: NextAuth.js built-in protection
- **Rate Limiting**: Prevents brute force attacks

### 2. Authorization

- **Role-Based Access Control**: User vs Admin roles
- **Protected Routes**: Middleware checks authentication
- **API