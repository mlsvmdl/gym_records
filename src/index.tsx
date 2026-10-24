import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SoundProvider } from "./utils/sound";
import "@fontsource/metal-mania";
import "@fontsource/new-rocker";
import "@fontsource/special-elite";
import "@fontsource/big-shoulders/700.css";
import "@fontsource/big-shoulders/800.css";
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
