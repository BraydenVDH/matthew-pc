import React from "react";
import { createRoot } from "react-dom/client";
import Parts from "./pages/Parts";

const el = document.getElementById("app");
if (el) {
  createRoot(el).render(
    <React.StrictMode>
      <Parts />
    </React.StrictMode>
  );
}
