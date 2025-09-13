import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize MSW in development
async function enableMocking() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js'
        }
      });
      console.log('🔶 MSW enabled');
    } catch (error) {
      console.warn('🔶 MSW failed to start:', error);
    }
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
