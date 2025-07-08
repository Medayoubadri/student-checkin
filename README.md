# Students Attendance System

<p align="center">
  <img src="/public/Checkin-Mate-preview.png" alt="Checkin-Mate Preview" width="800"/>
</p>

## 🔥 Introduction

The Students Attendance System is a modern web application designed to streamline the process of tracking student attendance in educational institutions. Built with cutting-edge technologies, it provides an intuitive interface for managing student records and attendance data.

## 🔗 Live Preview

Check out the live demo of CheckIn Mate here: [Live Preview](https://check-in-mate.vercel.app/)

## 📝 Project Blog

Read the detailed blog post about this project, including my journey, challenges, and learnings:  
[Project Blog Post](https://your-blog-link.com)

## 👤 About the Author

I'm **Ayoub**, a passionate full-stack developer. This project is a part of my ALX portfolio, showcasing my ability to design, develop, and deploy complete web applications. Connect with me on [LinkedIn](https://www.linkedin.com/in/medayoubadri) or check out more of my work on [GitHub](https://github.com/Medayoubadri).

## 🌟 Features

- 📝 Easy attendance tracking and management
- 👥 Student profile management
- 📊 Real-time attendance statistics and analytics
- 🔍 Advanced search and filtering capabilities
- 📱 Responsive design for all devices
- 🔐 Secure authentication with NextAuth (Google & GitHub)
- 📈 CSV export and detailed reporting
- 🌐 Multi-language support

## 💻 Tech Stack

- **Next.js 14** – React framework for production
- **TailwindCSS** – Utility-first CSS framework
- **Shadcn UI** – Reusable components
- **React Hook Form** – Form validations
- **Next-Auth** – Authentication
- **TypeScript** – Type-safe code
- **Zod** – Schema validation for forms
- **React Query** – Data fetching and synchronization
- **Prisma** – ORM for database interactions
- **PostgreSQL** via **NeonDB** – Reliable data storage

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

### 🚀 Usage

Once the server is running, navigate to `http://localhost:3000` in your browser, and you should see the application running.
You can log in using your Google or GitHub account.

Search for students and quickly mark them present.
Add new students on the fly through an intuitive registration modal.
View real-time attendance statistics on a responsive dashboard.
Export attendance reports in CSV format for further analysis.

### 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

Fork the repository.

Create a new branch for your feature or bug fix.

Submit a pull request with clear descriptions of your changes.

Follow the coding standards and comment your code thoroughly.

### 🔗 Related Projects

If you're interested in similar projects or want to explore more of my work, check out these repositories:

- [Project 1](https://github.com/example/project1)
- [Project 2](https://github.com/example/project2)
- [Project 3](https://github.com/example/project3)

### 🛠️ Technical Details

This app harnesses the power of Next.js 14's server-side rendering capabilities to deliver exceptional performance and SEO benefits. We've designed the user interface with TailwindCSS, creating a responsive and modern experience that adapts seamlessly across all devices. For consistent component design, we've integrated Shadcn UI, which not only enhances visual appeal but also simplifies maintenance and extensibility of the codebase.

User interactions are handled smoothly through React Hook Form, complemented by Zod for robust form validation. Behind the scenes, React Query manages data fetching and synchronization, ensuring efficient data handling and real-time updates throughout the application. Security is paramount, which is why we've implemented NextAuth for authentication, allowing users to securely access the system using their Google or GitHub credentials.

On the database front, we utilize Prisma ORM to streamline interactions with our PostgreSQL database hosted on NeonDB. This architecture supports robust data management while enabling real-time updates where needed. The dashboard experience provides teachers with immediate access to attendance statistics, allowing for effective monitoring of student presence.

We've structured the project following industry best practices, with clear separation between components, pages, and API routes. All code is thoroughly documented to facilitate understanding and collaboration among developers, making it straightforward for new team members to contribute effectively.

For more technical insights, refer to the code comments and documentation within the repository.

## 📸 Screenshots

<p align="center">
  <img src="/public/screenshots/2.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/3.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/4.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/5.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/6.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/7.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/8.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/9.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/10.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/11.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/12.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/13.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/14.png" alt="Checkin-Mate Preview" width="600"/>
  <img src="/public/screenshots/15.png" alt="Checkin-Mate Preview" width="600"/>
</p>

## 📦 Deployment

This project is deployed on Vercel, ensuring fast load times and reliable performance. The deployment process is automated with GitHub Actions, allowing for seamless updates and continuous integration.

## 📧 Contact

For any inquiries or feedback, feel free to reach out:

- Twitter: [@med_ayoubadri](https://twitter.com/med_ayoubadri)
- GitHub: [medayoubadri](https://github.com/medayoubadri)
- LinkedIn: [medayoubadri](https://www.linkedin.com/in/medayoubadri)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to the open-source community for providing the tools and libraries that made this project possible.
- Special thanks to the ALX program for inspiring and guiding my development journey.
- Shoutout to the contributors of the libraries and frameworks used in this project.
