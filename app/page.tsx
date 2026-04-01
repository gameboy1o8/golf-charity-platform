import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <span className="text-xl font-bold text-emerald-400">GolfGives</span>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-emerald-600 hover:bg-emerald-500">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-24 gap-6">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-sm px-4 py-1">
          Play Golf · Win Prizes · Change Lives
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl">
          Your game.<br />
          <span className="text-emerald-400">Their future.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl">
          Enter your golf scores each month, compete in draws, and automatically
          support a charity you believe in — all in one place.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8">
              Start Playing for Good
            </Button>
          </Link>
          <Link href="/charities">
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:text-white px-8">
              Browse Charities
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Subscribe',
              desc: 'Choose a monthly or yearly plan. A portion of every subscription goes straight to your chosen charity.'
            },
            {
              step: '02',
              title: 'Enter Your Scores',
              desc: 'Log your latest Stableford golf scores. Your 5 most recent scores are always kept on file.'
            },
            {
              step: '03',
              title: 'Win & Give',
              desc: 'Each month a draw runs. Match numbers to win prizes — while your charity receives your contribution.'
            }
          ].map(item => (
            <div key={item.step} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <span className="text-emerald-400 text-4xl font-bold">{item.step}</span>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prize pool */}
      <section className="px-6 py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">Monthly Prize Pool</h2>
          <p className="text-slate-400">Match numbers from your scores to win your share</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { match: '5 Numbers', share: '40%', note: 'Jackpot — rolls over if unclaimed', color: 'emerald' },
              { match: '4 Numbers', share: '35%', note: 'Split among all winners', color: 'blue' },
              { match: '3 Numbers', share: '25%', note: 'Split among all winners', color: 'purple' }
            ].map(item => (
              <div key={item.match} className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-2">
                <p className="text-slate-400 text-sm">{item.match} Match</p>
                <p className={`text-4xl font-bold text-${item.color}-400`}>{item.share}</p>
                <p className="text-slate-500 text-sm">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charity CTA */}
      <section className="px-6 py-24 text-center space-y-6">
        <h2 className="text-3xl font-bold">Every subscription gives back</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          At least 10% of your subscription goes directly to your chosen charity.
          You can increase that any time.
        </p>
        <Link href="/signup">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 px-10">
            Join Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8 text-center text-slate-500 text-sm">
        © 2026 GolfGives · Built with purpose
      </footer>

    </main>
  )
}