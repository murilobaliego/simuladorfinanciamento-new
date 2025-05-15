import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Registrar o Service Worker para melhorar o desempenho e SEO
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrado com sucesso:', registration.scope);
      })
      .catch(error => {
        console.log('Falha ao registrar o Service Worker:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
