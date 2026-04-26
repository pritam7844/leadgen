import { forwardRef } from 'react'

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="label">{label}</label>}
    <input
      ref={ref}
      className={`input-field ${error ? 'border-[#E63946]' : ''} ${className}`}
      {...props}
    />
    {error && <span className="text-[11px] text-[#E63946]">{error}</span>}
  </div>
))

Input.displayName = 'Input'

export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="label">{label}</label>}
    <select
      ref={ref}
      className={`input-field appearance-none ${error ? 'border-[#E63946]' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <span className="text-[11px] text-[#E63946]">{error}</span>}
  </div>
))

Select.displayName = 'Select'

export const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="label">{label}</label>}
    <textarea
      ref={ref}
      className={`input-field resize-none ${error ? 'border-[#E63946]' : ''} ${className}`}
      rows={3}
      {...props}
    />
    {error && <span className="text-[11px] text-[#E63946]">{error}</span>}
  </div>
))

Textarea.displayName = 'Textarea'
