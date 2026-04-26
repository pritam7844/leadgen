export function Button({ children, variant = 'primary', size = 'md', loading, disabled, className = '', ...props }) {
  const base = 'inline-flex items-center gap-2 font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' }
  const variants = {
    primary: 'text-white',
    secondary: 'text-[#A8A8A8] hover:text-[#FF6B1A] hover:border-[rgba(255,107,26,0.4)]',
    ghost: 'text-[#A8A8A8] hover:text-[#F2F2F2]',
    danger: 'text-white',
  }
  const styles = {
    primary: { background: 'linear-gradient(135deg, #FF6B1A, #E63946)', boxShadow: '0 3px 12px rgba(255,107,26,0.3)' },
    secondary: { background: '#181818', border: '1px solid #2a2a2a' },
    ghost: {},
    danger: { background: '#E63946' },
  }

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={styles[variant]}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}
