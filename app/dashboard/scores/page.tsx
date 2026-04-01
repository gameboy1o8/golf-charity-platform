'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'
import { Score } from '@/types'

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([])
  const [newScore, setNewScore] = useState('')
  const [newDate, setNewDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClient()

  const fetchScores = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
    if (data) setScores(data)
  }

  useEffect(() => {
    fetchScores()
  }, [])

  const handleAddScore = async () => {
    setError('')
    setSuccess('')
    const scoreNum = parseInt(newScore)

    if (!newScore || isNaN(scoreNum)) {
      setError('Please enter a valid score')
      return
    }
    if (scoreNum < 1 || scoreNum > 45) {
      setError('Score must be between 1 and 45')
      return
    }
    if (!newDate) {
      setError('Please select a date')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // If already 5 scores, delete the oldest one first
    if (scores.length >= 5) {
      const oldest = scores[scores.length - 1]
      await supabase.from('scores').delete().eq('id', oldest.id)
    }

    const { error: insertError } = await supabase.from('scores').insert({
      user_id: user.id,
      score: scoreNum,
      played_at: newDate
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setSuccess('Score added successfully')
      setNewScore('')
      setNewDate('')
      fetchScores()
    }

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('scores').delete().eq('id', id)
    fetchScores()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">My Scores</h1>
        <p className="text-slate-400 mt-1">
          Your last 5 Stableford scores. Adding a new one replaces the oldest.
        </p>
      </div>

      {/* Add score */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Add New Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded text-sm">
              {success}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Stableford Score (1–45)</Label>
              <Input
                type="number"
                min={1}
                max={45}
                placeholder="e.g. 32"
                value={newScore}
                onChange={e => setNewScore(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Date Played</Label>
              <Input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          <Button
            onClick={handleAddScore}
            disabled={loading || scores.length >= 5 && !newScore}
            className="bg-emerald-600 hover:bg-emerald-500 w-full"
          >
            {loading ? 'Adding...' : 'Add Score'}
          </Button>
          <p className="text-slate-500 text-xs text-center">
            {scores.length}/5 scores stored — oldest is auto-replaced when full
          </p>
        </CardContent>
      </Card>

      {/* Scores list */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Score History</CardTitle>
        </CardHeader>
        <CardContent>
          {scores.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">
              No scores yet. Add your first score above.
            </p>
          ) : (
            <div className="space-y-2">
              {scores.map((score, index) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 text-sm w-6">#{index + 1}</span>
                    <div>
                      <p className="text-white font-semibold text-lg">{score.score} pts</p>
                      <p className="text-slate-400 text-sm">
                        {new Date(score.played_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">
                        Latest
                      </span>
                    )}
                    {index === scores.length - 1 && scores.length === 5 && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded">
                        Next to go
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(score.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}