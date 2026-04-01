import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "./components/ui/provider"
import {BrowserRouter} from "react-router-dom"
import './index.css'
import axios from 'axios'
import App from './App.jsx'

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5000";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
