import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize MSW in development
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
    console.log('🔶 MSW enabled');
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
