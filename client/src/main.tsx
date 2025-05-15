import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Service Worker temporariamente desativado
// O código abaixo está comentado para evitar erros enquanto resolvemos problemas de compatibilidade
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado com sucesso:', registration.scope);
        })
        .catch(error => {
          console.log('Falha ao registrar o Service Worker:', error);
        });
    }, 1000);
  });
}
*/

createRoot(document.getElementById("root")!).render(<App />);
