# Evijnar Health Dashboard - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites

- Node.js 18+
- pnpm (or npm)

### Step 1: Install Dependencies

```bash
cd /Users/varadpendkar/Downloads/Evijnar-Health-main
pnpm install
```

### Step 2: Start Development Server

```bash
# From project root
npm run dev

# Or directly in web app
cd apps/web
npm run dev
```

The dashboard will be available at: **http://localhost:3000**

### Step 3: Configure API (Optional)

Create `.env.local` in `apps/web/`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📋 Dashboard Sections

### 🏠 **Home**

- Overview of Evijnar features
- Key statistics (500+ hospitals, 50+ countries, $2B+ savings)
- Quick access to search and tourism

### 🔍 **Search**

- Find hospitals by procedure
- Filter by:
  - Country/City
  - Price range
  - Accreditation (JCI/NABH)
  - Success rate
- Sort by price, savings, or quality

### 📋 **Procedures**

- Browse 100+ medical procedures
- View typical costs and success rates
- Filter by category (Orthopedics, Cardiology, etc.)
- Filter by complexity (Low/Medium/High)

### ✈️ **Health Tourism**

- Explore all-inclusive treatment packages
- Popular destinations with cost savings %
- Visa requirements and travel times
- Best time to visit each destination

### ❤️ **Recovery Bridge**

- Real-time vital signs monitoring
- Active surgical team alerts
- Medication schedule tracking
- Quick access to doctor consultation
- Recovery progress indicator

### 📅 **Bookings**

- View confirmed appointments
- Track booking status
- Update or cancel bookings
- Download booking details

## 🎯 Common Tasks

### Search for a Hospital

1. Click **Search** in navigation
2. Enter procedure name or symptom
3. Use voice search (🎤) if available
4. Click Advanced to set filters
5. Browse results and click hospital for details

### Explore Health Tourism

1. Click **Health Tourism** in navigation
2. View featured packages
3. Explore popular destinations
4. Check visa requirements and travel times
5. Compare package prices

### Monitor Recovery

1. Go to **Recovery Bridge** section
2. View real-time vital signs
3. Check medication schedule
4. Contact doctor or request video call
5. Track recovery progress (% complete)

### Manage Bookings

1. Click **Bookings** tab
2. View all appointments
3. Check status (Confirmed/Inquiry/Pending)
4. Click "View Details" for full info
5. Use "Update Booking" to make changes

## 🔧 Troubleshooting

### Dashboard Not Loading

```bash
# Clear cache and restart
rm -rf .next
npm run dev
```

### API Connection Issues

- Check if backend is running: `http://localhost:8000/api`
- Verify API URL in `.env.local`
- Check browser console for errors

### Missing Images

- Images use placeholder services
- In production, upload hospital images

### Styling Issues

```bash
# Rebuild Tailwind
npm run build
```

## 📊 Features You'll See

✅ **Working Features:**

- Multi-view dashboard navigation
- Search and filtering
- Hospital grid with pricing
- Procedure browser
- Health tourism section
- Recovery monitoring (simulated vitals)
- Booking management
- Responsive design on mobile

⏳ **Coming Soon:**

- Live backend API connection
- Real vital signs data
- Payment processing
- Video consultations
- Authentication/login

## 🎨 UI Components You Can Use

All components are reusable:

```typescript
import {
  SearchBar,
  HospitalsGrid,
  ProceduresList,
  HealthTourismPackages,
  HealthTourismDestinations,
} from "@/components";
```

## 💻 Code Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── page.tsx         ← Main dashboard (edit here for new features)
│   │   ├── layout.tsx       ← App wrapper
│   │   └── globals.css      ← Global styles
│   ├── components/          ← Reusable UI components
│   │   ├── SearchBar.tsx
│   │   ├── HospitalsGrid.tsx
│   │   ├── ProceduresList.tsx
│   │   └── HealthTourismSection.tsx
│   └── lib/                 ← Utilities & hooks
│       ├── api-client.ts    ← HTTP client
│       ├── types.ts         ← TypeScript types
│       ├── hooks.ts         ← React hooks for data
│       └── index.ts
├── tailwind.config.js       ← Tailwind CSS config
├── next.config.js           ← Next.js config
└── package.json
```

## 🚀 Deploying to Production

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel
```

### Environment Variables for Production

```bash
NEXT_PUBLIC_API_URL=https://api.evijnar.com
```

## 📚 Learning Resources

### Understanding the Code

1. **Start here:** `apps/web/src/app/page.tsx` (main dashboard)
2. **Data fetching:** `apps/web/src/lib/hooks.ts`
3. **API client:** `apps/web/src/lib/api-client.ts`
4. **Components:** `apps/web/src/components/`

### Adding New Features

1. Add types to `lib/types.ts`
2. Add hooks to `lib/hooks.ts`
3. Create component in `components/`
4. Import and use in `app/page.tsx`

### Styling

- Uses **Tailwind CSS**
- Custom colors in `tailwind.config.js`
- Global styles in `app/globals.css`

## 🐛 Debug Mode

Enable detailed logging:

```bash
# In terminal
export DEBUG=*
npm run dev
```

## 📞 Need Help?

Check these files:

- **Setup issues:** `docs/ENV_SETUP.md`
- **Architecture:** `docs/ARCHITECTURE.md`
- **API details:** `apps/api/README.md`
- **Implementation:** `DASHBOARD_IMPLEMENTATION.md`

## ✨ Next Steps

1. **Backend Integration**
   - Connect to real hospital database
   - Implement search API
   - Set up authentication

2. **Features to Add**
   - User accounts and login
   - Real payment processing
   - Video consultations
   - AI recommendations

3. **Mobile**
   - React Native app
   - Offline capabilities
   - Push notifications

---

**Quick Links:**

- 🌐 Dashboard: http://localhost:3000
- 🔌 API: http://localhost:8000/api
- 📖 Docs: `/docs` folder
- 🛠️ Setup: `/SECURITY_IMPLEMENTATION.md`

Happy exploring! 🎉
