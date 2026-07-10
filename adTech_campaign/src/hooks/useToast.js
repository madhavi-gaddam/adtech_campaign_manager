// src/hooks/useToast.js
import { toast } from "react-toastify";

export function useToast() {
  const showToast = (message) => {
    toast(message)
  }

  return {
    showToast,
  }
}
