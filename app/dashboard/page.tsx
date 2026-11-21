'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

export default function DashboardPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        router.replace('/login')
        return
      }

      setEmail(data.user.email ?? '')
      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (loading) {
    return <main>読み込み中...</main>
  }

  return (
    <main>
      <h1>障害調査アシスタント</h1>
      <p>ログイン中：{email}</p>
      <p>ダッシュボードは現在開発中です。</p>
      <button onClick={handleLogout}>ログアウト</button>
    </main>
  )
}