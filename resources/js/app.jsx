import React from "react";
import { createRoot } from "react-dom/client";
import Home from "./pages/Home";

const el = document.getElementById("app");
if (el) {
  createRoot(el).render(
    <React.StrictMode>
      <Home />
    </React.StrictMode>
  );
}
