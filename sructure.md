CheckinMate
├── app/
│   ├── [locale]/
|   │   ├── (dashboard)/
|   │   │   ├── Home/
|   │   │   │   ├── components/
|   │   │   │   │   ├── AddStudentModal.tsx
|   │   │   │   │   ├── AttendanceChart.tsx
|   │   │   │   │   ├── AttendanceLog.tsx
|   │   │   │   │   ├── DowloadAttendance.tsx
|   │   │   │   │   ├── LoadingSkeleton.tsx
|   │   │   │   │   ├── MetricsCards.tsx
|   │   │   │   │   └── StudentCheckIn.tsx
|   │   │   │   └── page.tsx
|   │   │   ├── students/
|   │   │   │   ├── components/
|   │   │   │   │   ├── ActionsButton.tsx
|   │   │   │   │   ├── CalendarButton.tsx
|   │   │   │   │   ├── DeleteConfirmationDialog.tsx
|   │   │   │   │   ├── EditStudentModal.tsx
|   │   │   │   │   ├── ImportLogModal.tsx
|   │   │   │   │   ├── ExportOptionsModal.tsx
|   │   │   │   │   ├── ImportStudentsModal.tsx
|   │   │   │   │   ├── ProcessingScreen.tsx
|   │   │   │   │   ├── SelectedDateDisplay.tsx
|   │   │   │   │   └── StudentsTable.tsx
|   │   │   │   └── page.tsx
|   │   │   └── layout.tsx
|   │   ├── api/
|   │   │   ├── attendance/
|   │   │   │   └── route.ts
|   │   │   ├── auth/
|   │   │   │   └── [...nextauth]/
|   │   │   │       └── route.ts
|   │   │   ├── export/
|   │   │   │   └── route.ts
|   │   │   ├── import/
|   │   │   │   └── route.ts
|   │   │   ├── metrics/
|   │   │   │   └── route.ts
|   │   │   └── students/
|   │   │       └── route.ts
|   │   ├── auth/
|   │   │   └── signin/
|   │   │       └── page.tsx
|   │   ├── globals.css
|   │   ├── layout.tsx
|   │   └── page.tsx
│
├── components/
│   ├── ui/ (contains all the shadcn ui components..)
│   ├── header.tsx
│   ├── main-nav.tsx
│   ├── theme-toggle.tsx
│   └── user-nav.tsx
├── hooks/
│   ├── useOptimisticCRUD.ts
│   ├── use-media-query.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── i18n/
│   ├── request.ts
│   └── routing.ts
├── lib/
│   ├── authOptions.ts
│   ├── cache.ts
│   ├── exportStudents.ts
│   └── utils.ts
├── messages/
│   ├── en.json
│   └── fr.json
├── node_modules/ (contains all the app's modules..)  
├── prisma/
│   ├── dev.db
│   └── schema.prisma
├── providers/
│   ├── session-provider.tsx
│   ├── SWRProvider.tsx
│   └── theme-provider.tsx
├── providers/
│   ├── import.ts
│   └── next-auth.d.ts
├── .env
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
