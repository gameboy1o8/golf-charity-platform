'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Heart, ExternalLink, Check } from 'lucide-react'
import { Charity } from '@/types'

export default function CharityPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [currentCharityId, setCurrentCharityId] = useState<string | null>(null)
  const [percentage, setPercentage] = useState(10)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: charitiesData } = await supabase
        .from('charities')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })

      if (charitiesData) setCharities(charitiesData)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('charity_id, charity_percentage')
        .eq('id', user.id)
        .single()

      if (profile) {
        setCurrentCharityId(profile.charity_id)
        setSelectedId(profile.charity_id)
        setPercentage(profile.charity_percentage ?? 10)
      }
    }

    fetchData()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setSuccess('')

    if (percentage < 10 || percentage > 100) {
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        charity_id: selectedId,
        charity_percentage: percentage
      })
      .eq('id', user.id)

    if (!error) {
      setCurrentCharityId(selectedId)
      setSuccess('Charity preferences saved successfully')
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">My Charity</h1>
        <p className="text-slate-400 mt-1">
          Choose a charity and set how much of your subscription goes to them.
        </p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Contribution percentage */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Heart size={18} className="text-emerald-400" />
            Contribution Percentage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="text-slate-300">
              % of subscription to donate (minimum 10%)
            </Label>
            <Input
              type="number"
              min={10}
              max={100}
              value={percentage}
              onChange={e => setPercentage(parseInt(e.target.value))}
              className="bg-slate-800 border-slate-700 text-white w-32"
            />
          </div>
          <p className="text-slate-500 text-xs">
            Minimum is 10%. You can increase this any time.
          </p>
        </CardContent>
      </Card>

      {/* Charity list */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Select a Charity</h2>
        {charities.map(charity => (
          <div
            key={charity.id}
            onClick={() => setSelectedId(charity.id)}
            className={`cursor-pointer rounded-xl border p-4 transition-all ${
              selectedId === charity.id
                ? 'border-emerald-500 bg-emerald-500/5'
                : 'border-slate-800 bg-slate-900 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">{charity.name}</p>
                  {charity.is_featured && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                      Featured
                    </Badge>
                  )}
                  {currentCharityId === charity.id && (
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-slate-400 text-sm">{charity.description}</p>
                {charity.website && (
                  
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-emerald-400 text-xs flex items-center gap-1 hover:underline w-fit"
                  >
                    Visit website <ExternalLink size={10} />
                  </a>
                )}
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                selectedId === charity.id
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-slate-600'
              }`}>
                {selectedId === charity.id && <Check size={12} className="text-white" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleSave}
        disabled={loading || !selectedId}
        className="bg-emerald-600 hover:bg-emerald-500 w-full"
      >
        {loading ? 'Saving...' : 'Save Charity Preferences'}
      </Button>
    </div>
  )
}