import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { loginSchema } from '../utils/validators'
import { useAuth } from '../hooks/useAuth'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function Login() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
      <div className="w-full max-w-[380px] px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl text-white font-bebas text-xl"
            style={{ background: 'linear-gradient(135deg, #FF6B1A, #E63946)' }}>L</div>
          <span className="font-bebas text-2xl tracking-wide text-gradient">LeadFlow</span>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-[#F2F2F2] mb-1">Welcome back</h2>
          <p className="text-xs text-[#505050] mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              {...register('email')}
              label="Email"
              type="email"
              placeholder="you@company.com"
              error={errors.email?.message}
            />
            <Input
              {...register('password')}
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
            />

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-[11px] text-[#FF6B1A] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full justify-center">
              Sign in
            </Button>
          </form>

          <p className="text-center text-xs text-[#505050] mt-5">
            No account?{' '}
            <Link to="/register" className="text-[#FF6B1A] hover:underline font-semibold">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
