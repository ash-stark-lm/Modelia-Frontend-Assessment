Modelia is an AI-powered asset generator that transforms user-uploaded images and text prompts into unique, stylized assets. Built with React and Tailwind CSS, the application features a clean, responsive UI with smooth animations powered by GSAP.

### Features

- **Image Upload**: Upload a base image in JPG or PNG format via drag-and-drop or file selection.
- **Prompt and Style Input**: Define the style of the generated asset with a text prompt and a predefined style (Editorial, Streetwear, Vintage).
- **Live Summary**: A real-time preview summarizes your input, including the uploaded image, prompt, and chosen style.
- **AI Generation (Mock)**: A mock API simulates the AI generation process, including loading states, success messages, and a model overload retry mechanism with exponential backoff.
- **Generation History**: The application stores a history of your recent generations locally, allowing you to quickly reload previous settings and results.
- **Interactive UI**: The user interface is designed for a professional feel, featuring custom components, a dark theme, and scroll-triggered GSAP animations that reveal content as you navigate the page.
- **Responsive Design**: The layout is optimized for both desktop and mobile devices.
- **Toasts**: Uses `react-toastify` to provide non-intrusive notifications for uploads, generation progress, and errors.

---

### Getting Started

To get a local copy up and running, follow these simple steps.

#### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

#### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/ash-stark-lm/Modelia-Frontend-Assessment.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd Modelia-Frontend-Assessment
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

#### Running the Application

To run the application in development mode:

```bash
npm run dev
# or
yarn dev
```

Open your browser and visit `http://localhost:5173` to see the application.

---

### Technologies Used

- **React**: The core JavaScript library for building the user interface.
- **TypeScript**: Ensures type safety and improves code quality.
- **Tailwind CSS**: A utility-first CSS framework for rapid and consistent styling.
- **GSAP (GreenSock Animation Platform)**: A robust animation library used for the hero section and scroll-triggered entry animations.
- **`react-toastify`**: A library for adding clean and customizable toast notifications.
- **`zustand`**: A small, fast, and scalable state-management solution used within some UI components.

---

### Project Structure

```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── History.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── LiveSummary.tsx
│   │   ├── PromptStyle.tsx
│   │   ├── StyleActions.tsx
│   │   ├── Uploader.tsx
│   │   └── GeneratedResult.tsx
│   ├── hooks/
│   │   └── useImageUpload.tsx
│   ├── lib/
│   ├── ui/
│   ├── App.tsx
│   ├── main.tsx
│   └── globals.css
├── package.json
├── tsconfig.json
└── README.md
```

### Mock API

The application uses a mock API function (`mockGenerateApi`) to simulate network requests and AI model behavior. This function includes:

- Random success/failure responses.
- Simulated network latency.
- An exponential backoff and retry mechanism for "model overloaded" errors, complete with toast notifications.
- An `AbortController` to handle request cancellations.

This mock setup demonstrates robust front-end handling of asynchronous operations without requiring a real backend.
