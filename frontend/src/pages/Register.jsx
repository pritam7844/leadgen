import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { registerSchema } from '../utils/validators'
import { useAuth } from '../hooks/useAuth'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function Register() {
  const { register: authRegister } = useAuth()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authRegister(data)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
      <div className="w-full max-w-[380px] px-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl text-white font-bebas text-xl"
            style={{ background: 'linear-gradient(135deg, #FF6B1A, #E63946)' }}>L</div>
          <span className="font-bebas text-2xl tracking-wide text-gradient">LeadFlow</span>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-[#F2F2F2] mb-1">Create your account</h2>
          <p className="text-xs text-[#505050] mb-6">Start with 500 free leads</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input {...register('firstName')} label="First name" placeholder="Arjun"
                error={errors.firstName?.message} />
              <Input {...register('lastName')} label="Last name" placeholder="Kumar"
                error={errors.lastName?.message} />
            </div>
            <Input {...register('email')} label="Email" type="email"
              placeholder="you@company.com" error={errors.email?.message} />
            <Input {...register('password')} label="Password" type="password"
              placeholder="Min 8 characters" error={errors.password?.message} />

            <Button type="submit" loading={loading} className="w-full justify-center mt-1">
              Create free account
            </Button>
          </form>

          <p className="text-center text-xs text-[#505050] mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF6B1A] hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
