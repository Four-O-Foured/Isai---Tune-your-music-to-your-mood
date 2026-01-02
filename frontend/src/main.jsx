import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { FaceDetectionProvider } from './contexts/FaceDetectionContext.jsx'
import { SongProvider } from './contexts/SongContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(

  <FaceDetectionProvider>
    <SongProvider>
      <App />
    </SongProvider>
  </FaceDetectionProvider>
)
