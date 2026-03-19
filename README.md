# Lost & Found — Frontend

A modern, mobile-responsive web application built with Next.js for the Lost & Found community platform.

## Live Website
```
https://lost-and-found-frontend-phi.vercel.app
```

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Language** — JavaScript
- **Styling** — Tailwind CSS v3
- **HTTP Client** — Axios
- **Auth** — JWT stored in cookies (js-cookie)
- **Fonts** — Syne + DM Sans (Google Fonts)
- **Hosting** — Vercel

## Features

- User registration and login with JWT authentication
- Real-time form validation with password strength meter
- Post lost and found items with image uploads
- Browse and search items by category, type, and location
- Submit and manage claims on items
- Approve or reject claims as item owner
- Email notifications on claim activity
- Admin dashboard for managing all items and users
- Notification bell with unread count
- Share item via clipboard copy
- Related items section on item detail page
- Fully mobile responsive on all screen sizes
- Animated home page with scroll-triggered sections
- 3-step post item wizard
- Skeleton loading states throughout

## Project Structure
```
lost-and-found-frontend/
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── globals.css
│   │   ├── auth/
│   │   │   ├── login/page.js
│   │   │   └── register/page.js
│   │   ├── items/
│   │   │   ├── page.js
│   │   │   └── [id]/page.js
│   │   ├── post/page.js
│   │   ├── my-account/page.js
│   │   └── admin/page.js
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── ItemCard.js
│   │   ├── ClaimModal.js
│   │   └── NotificationBell.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── lib/
│   │   ├── api.js
│   │   └── auth.js
│   └── middleware.js
├── .env.local
├── tailwind.config.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js v18+
- Lost & Found Backend running

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/lost-and-found-frontend.git
cd lost-and-found-frontend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` file in the root directory
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Run in development
```bash
npm run dev
```

5. Build for production
```bash
npm run build
npm start
```

The app runs on `http://localhost:3000`

## Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home page with hero and recent items | Public |
| `/items` | Browse all items with filters | Public |
| `/items/:id` | Item detail with claims | Public |
| `/auth/login` | Login page | Guest only |
| `/auth/register` | Register page | Guest only |
| `/post` | Post a new item | Private |
| `/my-account` | User dashboard | Private |
| `/admin` | Admin dashboard | Admin only |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL including /api |

## Color Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `--teal-600` | `#0d9488` | Primary color |
| `--teal-700` | `#0f766e` | Primary hover |
| `--teal-900` | `#134e4a` | Dark backgrounds |
| `--amber-500` | `#f59e0b` | Accent color |
| `--surface` | `#f8faf9` | Page background |
| `--card` | `#ffffff` | Card background |

## Key Components

**Navbar** — Sticky navbar with mobile hamburger menu, active route highlighting, notification bell, user profile strip, and admin badge.

**ItemCard** — Card component with fluid image height, type badge overlay, category pill, 2-line description clamp, and hover animation.

**ClaimModal** — Mobile bottom sheet on small screens, tips section, character counter, minimum length validation.

**NotificationBell** — Desktop dropdown and mobile bottom sheet, time ago display, unread dot indicator.

**NotificationBell** — Real-time unread count badge, mark all as read, time-ago formatting.

## Deployment

This app is deployed on Vercel.

1. Push code to GitHub
2. Import repository on Vercel
3. Add environment variable `NEXT_PUBLIC_API_URL`
4. Deploy

## Related

- [Backend Repository](https://github.com/Dase23M/lost-and-found-backend)
- [Live API](https://lost-and-found-backend-production-0ce7.up.railway.app)

## Author

Developed by [Dasun Methmal]

## License

MIT