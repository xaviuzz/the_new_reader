import { useEffect } from 'react'

export function useArticleRead(
  sentinelRef: React.RefObject<HTMLElement | null>,
  onMarkAsRead: () => void
): void {
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 1.0) {
            onMarkAsRead()
            observer.disconnect()
          }
        })
      },
      {
        threshold: 1.0,
        rootMargin: '0px'
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [sentinelRef, onMarkAsRead])
}
