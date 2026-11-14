import React from 'react'
import { FolderOpen } from 'lucide-react'

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There is no data available to display right now.',
  actionLabel,
  onAction,
  actionLink,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center fintech-card ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
        <Icon className="h-7 w-7 text-slate-500" />
      </div>
      <h3 className="text-base font-semibold text-navy-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      {actionLabel && (
        <div className="mt-5">
          {actionLink ? (
            <a href={actionLink} className="btn-primary">
              {actionLabel}
            </a>
          ) : (
            <button type="button" onClick={onAction} className="btn-primary">
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
