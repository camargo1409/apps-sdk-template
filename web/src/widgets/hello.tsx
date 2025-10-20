// import React from "react";
import "react-dom/client";
import { createRoot } from "react-dom/client";
import "../index.css";
import { StrictMode } from "react";

const HelloWorld = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-teal-400">
      <div className="text-white text-4xl font-bold shadow-lg p-8 rounded-lg bg-black/30 backdrop-blur">
        Hello, World!
      </div>
    </div>
  );
};

export default HelloWorld;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelloWorld />
  </StrictMode>,
);
