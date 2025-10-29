"use client";

import Image from "next/image";
import React, { useState } from "react";
import { createPortal } from "react-dom";

interface ShareModalProps {
    open: boolean;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose }) => {
    const [copied, setCopied] = useState(false);
    const SHARE_LINK =
        typeof window !== "undefined" ? window.location.href : "";

    const handleCopy = () => {
        navigator.clipboard.writeText(SHARE_LINK);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    if (!open) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-6 w-[340px] shadow-lg relative"
              onClick={(e) => e.stopPropagation()}
          >
              {/* Logo */}
              <div className="flex flex-col items-center mb-4">
                  <div className="bg-blue-600 rounded-full w-30 h-30 flex items-center justify-center mb-2">
                      <Image
                          src="/assets/images/logo.png"
                          alt="Logo"
                          height={120}
                          width={120}
                      />
                  </div>
                  <div className="text-lg font-semibold text-black">Academix</div>
                  <div className="text-gray-500 text-sm mb-2">
                      Share the certificate with friends
                  </div>
              </div>

              {/* Input + Copy */}
              <div className="flex items-center h-13 bg-gray-100 rounded-full pl-4 py-1 mb-4">
                  <input
                      className="bg-transparent flex-1 outline-none text-gray-700 text-sm"
                      value={SHARE_LINK}
                      readOnly
                  />
                  <button
                      className="bg-blue-600 h-13 text-white px-4 py-1 rounded-full text-sm font-semibold ml-2"
                      onClick={handleCopy}
                  >
                      {copied ? "Copied!" : "Copy"}
                  </button>
              </div>

              {/* Social icons */}
              <div className="flex justify-between items-center mt-2">
                  <div className="flex flex-col items-center text-xs">
                      <Image
                          src="/assets/icons/whatsapp.svg"
                          alt="WhatsApp"
                          width={18}
                          height={18}
                          className="bg-[#F7F8FA] rounded-full"
                      />
                      <span className="text-black">WhatsApp</span>
                  </div>
                  <div className="flex flex-col items-center text-xs">
                      <Image
                          src="/assets/icons/messenger.svg"
                          alt="Messenger"
                          width={20}
                          height={20}
                      />
                      <span className="text-black">Messenger</span>
                  </div>
                  <div className="flex flex-col items-center text-xs">
                      <Image
                          src="/assets/icons/facebook.svg"
                          alt="Facebook"
                          width={10}
                          height={10}
                      />
                      <span className="text-black">Facebook</span>
                  </div>
                  <div className="flex flex-col items-center text-xs">
                      <Image
                          src="/assets/icons/instagram.svg"
                          alt="Instagram"
                          width={18}
                          height={18}
                      />
                      <span className="text-black">Instagram</span>
                  </div>
                  <div className="flex flex-col items-center text-xs">
                      <Image
                          src="/assets/icons/twitter.svg"
                          alt="Twitter"
                          width={20}
                          height={20}
                      />
                      <span className="text-black">Twitter</span>
                  </div>
              </div>
          </div>
      </div>
  );

    return typeof window !== "undefined"
        ? createPortal(modalContent, document.body)
        : null;
};

export default ShareModal;
