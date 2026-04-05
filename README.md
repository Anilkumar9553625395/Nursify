# NurseCare 🏥

A full-stack Next.js platform where patients can browse and book verified nurses for home care, nurses can register and showcase their skills, and admins can manage everything.

---

## Features

### Patient-facing
- **Homepage** – Hero, Services section, Why Choose Us, How It Works
- **Find Nurses** – Browse approved nurses, search by name/specialization, filter by availability, sort by rating/experience/price
- **Nurse Profile** – Full bio, qualifications, languages, ratings, reviews, and booking form
- **Book a Nurse** – By the hour or by the day, with cost calculator
- **My Bookings** – Look up bookings by email address

### Nurse-facing
- **Multi-step Registration** – 3-step form: personal info → professional details → bio
- **Profile Showcase** – Photo, specializations, languages, qualifications, rates
- **Pending Approval Flow** – Submitted profiles go to admin queue

### Admin Panel (`/admin`)
- **Dashboard** – Stats overview (total nurses, pending approvals, bookings, revenue), recent activity
- **Nurses Management** – View all nurses, filter by status (pending/approved/rejected), approve or reject registrations
- **Bookings Management** – View all bookings, confirm/complete/cancel them, revenue tracking

---

## Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Framework | Next.js 14 (App Router)       |
| Styling   | Tailwind CSS                   |
| Icons     | Lucide React                   |
| Language  | TypeScript                     |
| Data      | In-memory store (module-level) |

> **Production note**: Replace the in-memory store in `lib/store.ts` with a real database (e.g. Prisma + PostgreSQL). Add authentication (NextAuth.js) to protect admin routes and associate bookings with user accounts.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

## Pages

| Route                  | Description                        |
|------------------------|------------------------------------|
| `/`                    | Homepage                           |
| `/find-nurses`         | Browse verified nurses             |
| `/nurse/[id]`          | Nurse profile + booking + reviews  |
| `/register`            | Nurse registration form            |
| `/bookings`            | Patient booking lookup             |
| `/admin`               | Admin dashboard                    |
| `/admin/nurses`        | Manage nurse approvals             |
| `/admin/bookings`      | Manage all bookings                |

## API Routes

| Method | Endpoint                        | Description                   |
|--------|---------------------------------|-------------------------------|
| GET    | `/api/nurses`                   | List approved nurses          |
| POST   | `/api/nurses`                   | Register a new nurse          |
| GET    | `/api/nurses/[id]`              | Get nurse details             |
| POST   | `/api/nurses/[id]/review`       | Submit a review               |
| GET    | `/api/bookings?email=...`       | Get bookings by patient email |
| POST   | `/api/bookings`                 | Create a booking              |
| GET    | `/api/admin/nurses`             | Admin: all nurses             |
| PATCH  | `/api/admin/nurses/[id]`        | Admin: update nurse status    |
| GET    | `/api/admin/bookings`           | Admin: all bookings           |
| PATCH  | `/api/admin/bookings/[id]`      | Admin: update booking status  |

## Project Structure

```
nursecare/
├── app/
│   ├── page.tsx                   # Homepage
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Global styles
│   ├── find-nurses/page.tsx       # Nurse directory
│   ├── nurse/[id]/page.tsx        # Nurse profile
│   ├── register/page.tsx          # Nurse registration
│   ├── bookings/page.tsx          # My bookings
│   ├── admin/
│   │   ├── layout.tsx             # Admin sidebar layout
│   │   ├── page.tsx               # Admin dashboard
│   │   ├── nurses/page.tsx        # Nurse management
│   │   └── bookings/page.tsx      # Booking management
│   └── api/
│       ├── nurses/route.ts
│       ├── nurses/[id]/route.ts
│       ├── nurses/[id]/review/route.ts
│       ├── bookings/route.ts
│       └── admin/
│           ├── nurses/route.ts
│           ├── nurses/[id]/route.ts
│           ├── bookings/route.ts
│           └── bookings/[id]/route.ts
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── NurseCard.tsx
├── lib/
│   └── store.ts                   # In-memory data store + helpers
└── README.md
```

## Seed Data

The app ships with 5 approved nurses and 2 sample bookings to get you started immediately. One nurse (`James Wilson`) is in `pending` status so you can test the admin approval flow at `/admin/nurses`.
