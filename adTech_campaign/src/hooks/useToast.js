// src/hooks/useToast.js

export function useToast() {
  const showToast = (message) => {
    window.alert(message)
  }

  return {
    showToast,
  }
}