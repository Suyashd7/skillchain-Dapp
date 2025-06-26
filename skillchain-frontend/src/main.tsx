import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import { WalletProvider } from './components/WalletContext'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <WalletProvider>
        <App />
      </WalletProvider>
    </ChakraProvider>
  </React.StrictMode>
) 