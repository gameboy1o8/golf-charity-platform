'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<any[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchCharities = async () => {
    const { data } = await supabase.from('charities').select('*').order('created_at', { ascending: false })
    if (data) setCharities(data)
  }

  useEffect(() => { fetchCharities() }, [])

  const handleAdd = async () => {
    if (!name.trim()) return
    setLoading(true)
    await supabase.from('charities').insert({ name, description, website, is_active: true })
    setName(''); setDescription(''); setWebsite('')
    fetchCharities()
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('charities').delete().eq('id', id)
    fetchCharities()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">Charities</h1>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-white">Add Charity</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="text-slate-300">Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)}
              placeholder="Charity name" className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Short description" className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Website URL</Label>
            <Input value={website} onChange={e => setWebsite(e.target.value)}
              placeholder="https://..." className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <Button onClick={handleAdd} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 w-full">
            {loading ? 'Adding...' : 'Add Charity'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-white">All Charities</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {charities.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3">
                <div>
                  <p className="text-white font-medium">{c.name}</p>
                  <p className="text-slate-400 text-sm">{c.description}</p>
                </div>
                <button onClick={() => handleDelete(c.id)} className="text-slate-600 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}