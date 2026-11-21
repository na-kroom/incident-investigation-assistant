'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('パスワードが一致しません。')
      return
    }

    if (password.length < 8) {
      setMessage('パスワードは8文字以上にしてください。')
      return
    }

    setLoading(true)

    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      window.location.href = '/dashboard'
      return
    }

    setMessage('登録を受け付けました。確認メールが届いた場合は、メール内のリンクから認証してください。')
    setLoading(false)
  }

  return (
    <main>
      <h1>新規登録</h1>

      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">パスワード確認</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '登録中...' : 'アカウント作成'}
        </button>
      </form>

      {message && <p>{message}</p>}

      <p>
        すでにアカウントをお持ちの方は
        <Link href="/login">ログイン</Link>
      </p>
    </main>
  )
}