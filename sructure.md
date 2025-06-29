CheckinMate
├── app/
│   ├── (dashboard)/
│   │   ├── Home/
│   │   │   └── page.tsx
│   │   ├── students/
│   │   │   ├── components/
│   │   │   │   ├── ActionsButton.tsx
│   │   │   │   ├── CalendarButton.tsx
│   │   │   │   ├── ExportOptionsModal.tsx
│   │   │   │   ├── ImportStudentsModal.tsx
│   │   │   │   ├── SelectedDateDisplay.tsx
│   │   │   │   └── StudentsTable.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── attendance/
│   │   │   └── route.ts
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── export/
│   │   │   └── route.ts
│   │   ├── import/
│   │   │   └── route.ts
│   │   ├── metrics/
│   │   │   └── route.ts
│   │   └── students/
│   │       └── route.ts
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/ (contains all the shadcn ui components..)
│   ├── header.tsx
│   ├── main-nav.tsx
│   ├── theme-toggle.tsx
│   └── user-nav.tsx
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   ├── exportStudents.ts
│   └── utils.ts
├── node_modules/ (contains all the app's modules..)  
├── prisma/
│   ├── dev.db
│   └── schema.prisma
├── providers/
│   ├── session-provider.tsx
│   └── theme-provider.tsx
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
