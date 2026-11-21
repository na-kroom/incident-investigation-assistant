'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'

export default function NewMonitorPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [monitorType, setMonitorType] = useState('website')
  const [interval, setInterval] = useState('5')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const supabase = createClient()

      const { data: { user }, error: userError } =
        await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('monitors')
        .insert({
          user_id: user.id,
          name,
          url,
          monitor_type: monitorType,
          interval_minutes: Number(interval),
        })

      if (error) {
        setMessage(`登録に失敗しました：${error.message}`)
        return
      }

      router.push('/dashboard')
    } catch {
      setMessage('予期しないエラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>監視対象の登録</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">監視対象名</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：自分のWebサイト"
            required
          />
        </div>

        <div>
          <label htmlFor="url">URL</label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="type">監視タイプ</label>
          <select
            id="type"
            value={monitorType}
            onChange={(e) => setMonitorType(e.target.value)}
          >
            <option value="website">Webサイト</option>
            <option value="api">API</option>
          </select>
        </div>

        <div>
          <label htmlFor="interval">監視間隔</label>
          <select
            id="interval"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            <option value="5">5分</option>
            <option value="10">10分</option>
            <option value="15">15分</option>
            <option value="30">30分</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '登録中...' : '監視対象を登録'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  )
}