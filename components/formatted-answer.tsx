import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface FormattedAnswerProps {
  text: string
  questionTitle?: string
}

export function FormattedAnswer({ text }: FormattedAnswerProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize heading styles
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3 border-b-2 border-indigo-200 dark:border-indigo-800 pb-2">
              {children}
            </h3>
          ),
          // Customize paragraph styles
          p: ({ children }) => (
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              {children}
            </p>
          ),
          // Customize list styles
          ul: ({ children }) => (
            <ul className="space-y-2 mb-4">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="flex gap-3 ml-4 text-slate-700 dark:text-slate-300">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0 mt-1">•</span>
              <span className="leading-relaxed">{children}</span>
            </li>
          ),
          // Customize blockquote (used for definitions with >)
          blockquote: ({ children }) => (
            <blockquote className="my-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg">
              <div className="text-slate-700 dark:text-slate-300">
                {children}
              </div>
            </blockquote>
          ),
          // Customize strong/bold
          strong: ({ children }) => (
            <strong className="font-bold text-indigo-900 dark:text-indigo-200">
              {children}
            </strong>
          ),
          // Customize code blocks (inline)
          code: ({ children }) => (
            <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
              {children}
            </code>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}
