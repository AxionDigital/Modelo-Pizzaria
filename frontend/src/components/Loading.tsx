"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
}

export default function LoadingOverlay({ show, message = "Carregando..." }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed inset-0 z-100
            flex items-center justify-center
            bg-black/40 backdrop-blur-sm
          "
        >
          <motion.div
            className="flex flex-col items-center justify-center bg-white/95 rounded-2xl p-8 shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-700">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
