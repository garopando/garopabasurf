'use client'
import { useEffect } from 'react'
export default function RegistraSW() {
  useEffect(function() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(function() {})
    }
  }, [])
  return null
}
