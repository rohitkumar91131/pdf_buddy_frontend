# PDF Buddy - Frontend

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/rohitkumar91131/pdf_buddy_frontend)


This is the frontend for PDF Buddy, a web application built with React and Vite. It allows users to upload, manage, view, and annotate their PDF documents seamlessly.

## Key Features

*   **User Authentication**: Secure signup and login functionality to manage personal PDF collections.
*   **PDF Management Dashboard**: A centralized dashboard to view, rename, and delete all uploaded PDFs.
*   **Drag & Drop Upload**: Easily upload PDF files using a modern drag-and-drop interface or a traditional file picker.
*   **Interactive PDF Viewer**: A feature-rich PDF viewer built with `react-pdf`.
    *   **Efficient Rendering**: Utilizes `@tanstack/react-virtual` for smooth scrolling and rendering of large PDF documents.
    *   **Navigation**: Navigate through pages, jump to a specific page, and use previous/next page controls.
    *   **Zoom**: Zoom in and out for better readability.
    *   **Download**: Download the PDF file directly from the viewer.
*   **Text Highlighting & Annotation**:
    *   Select text within the PDF to create a highlight.
    *   Add, update, or delete comments associated with each highlight.
    *   Highlights and comments are saved and persisted for each user and document.
*   **Responsive Design**: A clean, responsive user interface built with Tailwind CSS.
*   **Real-time Feedback**: Provides user feedback through toasts for actions like uploads, logins, and errors.
*   **Loading States**: Skeleton loaders provide a better user experience while data is being fetched.

## Technology Stack

*   **Framework**: React 19 + Vite
*   **Language**: JavaScript (ES6+)
*   **Styling**: Tailwind CSS
*   **Routing**: React Router v7
*   **State Management**: React Context API
*   **HTTP Client**: Axios
*   **PDF Rendering**: `react-pdf` (powered by PDF.js)
*   **UI Components & Icons**: Mantine, Lucide React
*   **Notifications**: React Hot Toast
*   **Linting**: ESLint

## Project Structure

The source code is organized into logical directories to maintain clarity and scalability.

```
src/
├── components/      # Reusable UI components (Dashboard, PDF Viewer, Auth Forms)
├── context/         # Global state management (AuthContext, PdfContext)
├── lib/             # API utility functions (auth, PDF operations, highlights)
├── pages/           # Top-level page components for each route
├── App.jsx          # Main application component with routing setup
└── main.jsx         # Entry point of the application
```

## Local Development

To run this project locally, you will need to have the [PDF Buddy backend](https://github.com/rohitkumar91131/pdf_buddy_backend) server running.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or a compatible package manager

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rohitkumar91131/pdf_buddy_frontend.git
    cd pdf_buddy_frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a `.env` file in the root of the project and add the URL of your running backend server.

    ```env
    VITE_BACKEND_URL=http://localhost:8000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Available Scripts

*   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
*   `npm run build`: Compiles and bundles the application for production.
*   `npm run lint`: Lints the source code to check for errors and style issues.
*   `npm run preview`: Starts a local server to preview the production build.
