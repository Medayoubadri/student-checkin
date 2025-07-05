# Students Attendance System

<p align="center">
  <img src="/public/Checkin-Mate-preview.png" alt="Checkin-Mate Preview" width="600"/>
</p>

## 🔥 Introduction

The Students Attendance System is a modern web application designed to streamline the process of tracking student attendance in educational institutions. It provides an intuitive interface for managing student records and attendance data.

## 🔗 Live Preview

Check out the live demo of student checkin here: [Live Preview](https://check-in-mate.vercel.app/)

## 🌟 Features

- 📝 Easy attendance tracking and management
- 👥 Student profile management
- 📊 Real-time attendance statistics
- 🔍 Advanced search and filtering capabilities
- 📱 Responsive design for all devices
- 🔐 Secure authentication system
- 📈 Attendance analytics and reporting

## 💻 Tech Stack

- **Next.js 14** – React framework for production
- **TailwindCSS** – Utility-first CSS framework
- **Shadcn UI** – Reusable components
- **React Hook Form** – Form validations
- **Next-Auth** – Authentication
- **TypeScript** – Type-safe code
- **Zod** – Type-safe schema validation for forms
- **React Query** – Data fetching and synchronization

## ⚡ Getting Started

### 🧰 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL or SQLite

### 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/Medayoubadri/student-checkin.git
cd student-checkin
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Rename `.env.example` to `.env` file in the root directory and update the following environment variables:

```
NEXT_PUBLIC_APP_NAME=CheckIn Mate

NEXTAUTH_URL=<your_nextauth_url_here>
NEXTAUTH_SECRET=<your_nextauth_secret_here>

GOOGLE_CLIENT_ID=<your_google_client_id_here>
GOOGLE_CLIENT_SECRET=<your_google_client_secret_here>

GITHUB_ID=<your_github_id_here>
GITHUB_SECRET=<your_github_secret_here>

DATABASE_POSTGRES_PRISMA_URL=<your_postgres_prisma_url_here>
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
