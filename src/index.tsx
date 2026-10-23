import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SoundProvider } from "./utils/sound";
import "@fontsource/metal-mania";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <SoundProvider>
      <App />
    </SoundProvider>
  </React.StrictMode>
);

reportWebVitals();
