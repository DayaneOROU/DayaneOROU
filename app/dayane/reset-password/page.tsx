'use client'

import { useState } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createBrowserSupabase()

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Erreur lors du reset')
      setLoading(false)
      return
    }

    setMessage('Mot de passe mis à jour — redirection...')
    setTimeout(() => {
      window.location.href = '/dayane/dashboard'
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-800 bg-zinc-900">

        <h1 className="text-2xl font-bold text-white mb-1">Nouveau mot de passe</h1>
        <p className="text-zinc-500 text-sm mb-8">Choisissez un mot de passe solide</p>

        <form onSubmit={handleReset} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-zinc-400 text-sm">Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-zinc-400 text-sm">Confirmer</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-white text-black font-semibold rounded-lg py-2.5 hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Confirmer'}
          </button>

        </form>
      </div>
    </div>
  )
}