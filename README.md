# Nexus – Investor & Entrepreneur Collaboration Platform

> **Advanced Frontend Internship – Phase 2**
> DevelopersHub Corporation · Completed by **Isra Asif**

🔗 **Live Demo:** [https://nexus-eight-ashy.vercel.app/login](https://nexus-eight-ashy.vercel.app/login)

---

## Overview

Nexus is a full-featured collaboration platform connecting investors and entrepreneurs. This repository is the Phase 2 extension of the base Nexus project, built during a 3-week advanced frontend internship. Rather than starting from scratch, the task was to navigate an existing React codebase and integrate seven new feature milestones — calendar scheduling, video calling, document management, payments, security, and a guided onboarding tour.

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Entrepreneur | sarah@techwave.io | password123 |
| Investor | michael@vcinnovate.com | password123 |

> After entering credentials, click **Continue** → enter any 6-digit code (e.g. `123456`) for the 2FA step.

---

## Features Built (Phase 2)

### 📅 Week 1 — Meeting Scheduler
- Interactive calendar UI for managing availability
- Send, accept, and decline meeting requests
- Confirmed meetings dashboard with upcoming/completed separation
- **Calendar → Video Call integration:** "Join" button on confirmed Video Call meetings navigates directly into the live call screen

### 🎥 Week 2 — Video Calling & Document Chamber
- Mock video call UI with live / scheduled / ended call states
- Start/end call, mute audio, toggle camera controls
- Navigates from the Scheduler's Confirmed tab seamlessly
- **Document Chamber** for deals and contracts:
  - Upload & preview PDFs and documents via drag-and-drop
  - E-signature pad (draw your signature)
  - Status labels: Draft · In Review · Signed

### 💳 Week 3 — Payments, Security & Polish
- Mock payment flows: Deposit, Withdraw, Transfer, Fund a Deal (Investor → Entrepreneur)
- Transaction history table with amount, sender, receiver, and status
- Wallet balance displayed on both dashboards
- **Password strength meter** on login (Weak / Fair / Good / Strong)
- **Multi-step login with 2FA mockup** — 6-digit OTP input with auto-focus
- **Role-based dashboards** — separate UI and navigation for Investors vs Entrepreneurs
- **Forgot Password & Reset Password** pages fully wired with routing
- **Guided walkthrough** — tooltip-based tour (React Joyride style) for both roles
- Fully responsive across mobile, tablet, and desktop

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router DOM v6 |
| Icons | Lucide React |
| File Upload | React Dropzone |
| Notifications | React Hot Toast |
| Date Utilities | date-fns |

---

## Project Structure

```
src/
├── components/
│   ├── calendar/          # MeetingCalendar, AvailabilitySlots, MeetingRequests, ConfirmedMeetings
│   ├── documents/         # SignaturePad
│   ├── layout/            # Sidebar, Navbar, DashboardLayout
│   ├── tour/              # GuidedTour (tooltip walkthrough)
│   ├── videocall/         # VideoCallUI
│   └── ui/                # Button, Card, Badge, Input, Avatar
├── context/
│   └── AuthContext.tsx    # Auth state, login, 2FA, forgot/reset password
├── pages/
│   ├── auth/              # Login, Register, ForgotPassword, ResetPassword
│   ├── chamber/           # DocumentChamber
│   ├── dashboard/         # InvestorDashboard, EntrepreneurDashboard
│   ├── payments/          # PaymentsPage
│   ├── scheduler/         # SchedulerPage
│   └── videocall/         # VideoCallPage
└── App.tsx                # Route definitions
```

---
