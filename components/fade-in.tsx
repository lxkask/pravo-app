'use client'

import { useEffect, useRef, useState } from 'react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  direction = 'up'
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay * 1000)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [delay])

  const getTranslateClass = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return 'translate-y-8'
        case 'down':
          return '-translate-y-8'
        case 'left':
          return 'translate-x-8'
        case 'right':
          return '-translate-x-8'
        default:
          return ''
      }
    }
    return 'translate-y-0 translate-x-0'
  }

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}s`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        className={`transition-transform ${getTranslateClass()}`}
        style={{
          transitionDuration: `${duration}s`,
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
