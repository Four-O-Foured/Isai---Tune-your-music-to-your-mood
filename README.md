# 🎵 Isai - Tune your music to your mood

**Isai** (Tamil for "Music") is an AI-powered music player that detects your mood using facial recognition and recommends songs to match how you feel. Built with a modern tech stack, it features a stunning, animated UI and a seamless audio experience.

![Logo](https://ik.imagekit.io/4O4ed/Logo/Isai_Logo.png?updatedAt=1767372010806)

## ✨ Features

- **🙂 Emotion Detection:** Real-time face detection using `face-api.js` identifies your mood (Happy, Sad, Angry, Neutral, Surprised).
- **🤖 Smart Recommendations:** Automatically fetches and recommends songs tailored to your detected emotion.
- **🎨 Modern UI/UX:** A sleek, dark-themed interface built with **React** and **Tailwind CSS**.
- **🌊 Dynamic Visuals:** Custom **GSAP** wave animations (Ripple, Particles, Zigzag, etc.) that react to the active song.
- **🎧 Full-Featured Player:**
  - Play, Pause, Skip, Previous controls.
  - Interactive progress bar and volume slider.
  - Auto-play next song queue management.
  - Real-time duration and current time tracking.
- **📱 Responsive Design:** Verified layouts for various screen sizes.

## 🛠️ Tech Stack

### Frontend

- **Framework:** [React v19](https://react.dev/) (Vite)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [GSAP v3](https://greensock.com/gsap/)
- **AI/ML:** [face-api.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** Axios

### Backend

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Storage:** [ImageKit](https://imagekit.io/) (for audio & cover art hosting)
- **Utilities:** Multer (file handling), Dotenv, Cors

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB installed locally or a MongoDB Atlas connection string.
- ImageKit account for media storage.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/YourUsername/Isai.git
    cd Isai
    ```

2.  **Install Dependencies:**

    _For Backend:_

    ```bash
    cd backend
    npm install
    ```

    _For Frontend:_

    ```bash
    cd ../frontend
    npm install
    ```

3.  **Environment Setup:**

    Create a `.env` file in the `backend/` directory:

    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    IMAGEKIT_PUBLIC_KEY=your_public_key
    IMAGEKIT_PRIVATE_KEY=your_private_key
    IMAGEKIT_URL_ENDPOINT=your_url_endpoint
    ```

4.  **Run the Application:**

    _Start Backend:_

    ```bash
    cd backend
    npm start
    ```

    _Start Frontend:_

    ```bash
    cd frontend
    npm run dev
    ```

5.  **Open in Browser:**
    Navigate to `http://localhost:5173` to see the app in action!

## 📂 Project Structure

```
Isai/
├── backend/            # Express server & API
│   ├── src/
│   │   ├── models/     # Mongoose Schemas
│   │   ├── routes/     # API Endpoints
│   │   ├── services/   # Helper services (Storage)
│   │   └── server.js   # Entry point
│   └── ...
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   │   ├── ui/     # Atomic visual elements
│   │   │   └── ...
│   │   ├── contexts/   # React Context (State)
│   │   ├── pages/      # Main views (Dashboard)
│   │   └── ...
│   └── ...
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
