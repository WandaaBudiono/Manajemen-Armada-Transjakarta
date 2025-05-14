# Manajemen Armada TransJakarta

A modern Vehicle Management System built for TransJakarta fleet management. This web application helps track, manage, and optimize the TransJakarta bus fleet with a user-friendly interface and robust features.

## 🚀 Tech Stack

- **Frontend Framework:** React.js with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with DaisyUI
- **Maps Integration:** Leaflet with React Leaflet
- **Data Fetching:** TanStack React Query
- **Routing:** React Router DOM
- **Form Controls:** React Select
- **HTTP Client:** Axios
- **UI Notifications:** SweetAlert2

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher recommended)
- npm or yarn package manager

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/Manajemen-Armada-Transjakarta.git
   cd Manajemen-Armada-Transjakarta
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## 🚦 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

This will start the development server at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
# or
yarn build
yarn preview
```

## 🏗️ Architecture

The application follows a modern React.js architecture with the following key features:

- **Component-Based Structure:** Modular components for better maintainability
- **TypeScript Integration:** Strong typing for enhanced development experience
- **React Query:** Efficient server state management and caching
- **Leaflet Maps:** Interactive map visualization for vehicle tracking
- **Tailwind & DaisyUI:** Utility-first CSS framework with pre-built components
- **React Router:** Client-side routing for seamless navigation

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=your_api_base_url
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
