// app/dayane/dashboard/projects/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '@/lib/actions/projects'

export default function NewProjectPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [status, setStatus] = useState<'published' | 'draft'>('draft')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await createProject(
        {
          title,
          description,
          project_url: projectUrl,
          image_url: null,
          status,
          category_id: null,
        },
        [] // pas de stacks pour l'instant
      )
      router.push('/dayane/dashboard/projects')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Nouveau projet</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        <div className="flex flex-col gap-1">
          <label className="text-black text-sm">Titre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30"
            placeholder="Mon super projet"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/70 text-sm">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30 resize-none"
            placeholder="Description du projet..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/70 text-sm">URL du projet</label>
          <input
            type="url"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30"
            placeholder="https://monprojet.vercel.app"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/70 text-sm">Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-white/20 text-white rounded-lg py-2.5 hover:bg-white/5 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-white text-black font-semibold rounded-lg py-2.5 hover:bg-white/90 transition disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer le projet'}
          </button>
        </div>

      </form>
    </div>
  )
}