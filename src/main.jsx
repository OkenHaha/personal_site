import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react"


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
      
    <App />
    </BrowserRouter>
    <Analytics />
    <SpeedInsights/>
  </StrictMode>,
)
