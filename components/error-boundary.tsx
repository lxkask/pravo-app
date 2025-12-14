'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Něco se pokazilo
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Aplikace narazila na neočekávanou chybu. Tvůj progress je uložen a můžeš pokračovat po obnovení stránky.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <summary className="cursor-pointer text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">
                  Technické detaily
                </summary>
                <code className="text-xs text-red-600 dark:text-red-400 block whitespace-pre-wrap break-words">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </code>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              Obnovit stránku
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
