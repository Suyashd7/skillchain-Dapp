/// <reference types="vite/client" />

declare global {
  interface Window {
    ethereum?: any
  }
}

declare module 'vanta/dist/vanta.net.min';
