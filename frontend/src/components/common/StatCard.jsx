import React from 'react'

export default function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  accent = 'primary',
  className = '',
}) {
  const accentStyles = {
    primary: {
      iconBg: 'bg-primary-50 text-primary-600',
      border: 'hover:border-primary-200',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600',
      border: 'hover:border-emerald-200',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600',
      border: 'hover:border-amber-200',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600',
      border: 'hover:border-rose-200',
    },
    sky: {
      iconBg: 'bg-sky-50 text-sky-600',
      border: 'hover:border-sky-200',
    },
    navy: {
      iconBg: 'bg-navy-50 text-navy-800',
      border: 'hover:border-navy-200',
    },
  }

  const currentAccent = accentStyles[accent] || accentStyles.primary

  return (
    <div
      className={`fintech-card p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${currentAccent.border} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl select-none ${currentAccent.iconBg}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {subtitle && (
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5 select-none">
          {subtitle}
        </p>
      )}
    </div>
  )
}
