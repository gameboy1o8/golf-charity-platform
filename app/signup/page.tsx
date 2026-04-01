'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async () => {
    setLoading(true)
    setError('')

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create profile row
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        email: email,
        role: 'user',
        subscription_status: 'inactive',
        charity_percentage: 10
      })

      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Create Account</CardTitle>
          <CardDescription className="text-slate-400">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

  <div>
    <Label>Full Name</Label>
    <Input
      value={fullName}
      onChange={e => setFullName(e.target.value)}
    />
  </div>

  <div>
    <Label>Email</Label>
    <Input
      type="email"
      value={email}
      onChange={e => setEmail(e.target.value)}
    />
  </div>

  <div>
    <Label>Password</Label>
    <Input
      type="password"
      value={password}
      onChange={e => setPassword(e.target.value)}
    />
  </div>

  {error && (
    <p className="text-red-500 text-sm">{error}</p>
  )}

  <Button
    onClick={handleSignup}
    disabled={loading}
    className="w-full"
  >
    {loading ? 'Creating...' : 'Sign Up'}
  </Button>

  <p className="text-sm text-slate-400 text-center">
    Already have an account?{' '}
    <Link href="/login" className="text-emerald-400 hover:underline">
      Login
    </Link>
  </p>

</CardContent>

      </Card>
    </div>
  )
}