import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "./components/ui/provider"
import {ChakraProvider} from '@chakra-ui/react'
import {BrowserRouter} from "react-router-dom"
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
        <BrowserRouter>
        <ChakraProvider>
          <App />
        </ChakraProvider>
        </BrowserRouter>
    </Provider>
  </StrictMode>
)