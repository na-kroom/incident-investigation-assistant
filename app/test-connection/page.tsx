'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'

export default function TestConnectionPage() {
  const [status, setStatus] = useState('接続確認中...')

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.getUser()

        if (error?.name === 'AuthSessionMissingError') {
          setStatus('Supabaseとの通信成功（未ログイン）')
        } else if (error) {
          setStatus(`確認結果：${error.message}`)
        } else {
          setStatus('Supabaseとの通信成功')
        }
      } catch {
        setStatus('接続に失敗しました。設定を確認してください。')
      }
    }

    checkConnection()
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="rounded-xl border p-8 shadow-sm">
        <h1 className="mb-4 text-xl font-bold">
          Supabase 接続テスト
        </h1>
        <p>{status}</p>
      </div>
    </main>
  )
}