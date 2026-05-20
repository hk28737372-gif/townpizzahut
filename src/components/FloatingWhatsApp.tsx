import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/923189659090"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform hover:shadow-xl focus:outline-none"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}