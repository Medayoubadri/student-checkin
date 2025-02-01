CheckinMate
├── app/
│ ├── (dashboard)/
│ │ ├── layout.tsx
│ │ ├── Home/
│ │ │ └── page.tsx
│ │ ├── students/
│ │ │ └── page.tsx
│ │ └── Import/Export/
│ │ └── page.tsx
│ ├── api/
│ │ ├── attendance/
│ │ │ └── route.ts
│ │ ├── auth/
│ │ │ └── [...nextauth]/
│ │ │ └── route.ts
│ │ ├── export/
│ │ │ └── route.ts
│ │ └── students/
│ │ └── route.ts
│ ├── auth/
│ │ └── signin/
│ │ └── page.tsx
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
│
├── components/
│ ├── ui/ (contains all the shadcn ui components..)
│ ├── header.tsx
│ ├── main-nav.tsx
│ ├── theme-toggle.tsx
│ └── user-nav.tsx
├── hooks/
│ ├── use-mobile.tsx
│ └── use-toast.ts
├── lib/
│ └── utils.ts
├── node_modules/ (contains all the app's modules..)  
├── prisma/
│ ├── dev.db
│ └── schema.prisma
├── providers/
│ ├── session-provider.tsx
│ └── theme-provider.tsx
├──── .env
├──── .eslintrc.json
├──── .gitignore
├──── components.json
├──── next-env.d.ts
├──── next.config.mjs
├──── package-lock.json
├──── package.json
├──── postcss.config.mjs
├──── tailwind.config.ts
└──── tsconfig.json
