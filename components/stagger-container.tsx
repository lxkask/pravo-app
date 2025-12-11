'use client'

import { Children, cloneElement, isValidElement, ReactElement } from 'react'
import { FadeIn } from './fade-in'

interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = ''
}: StaggerContainerProps) {
  const childrenArray = Children.toArray(children)

  return (
    <div className={className}>
      {childrenArray.map((child, index) => {
        if (isValidElement(child)) {
          return (
            <FadeIn key={index} delay={index * staggerDelay}>
              {child}
            </FadeIn>
          )
        }
        return child
      })}
    </div>
  )
}
