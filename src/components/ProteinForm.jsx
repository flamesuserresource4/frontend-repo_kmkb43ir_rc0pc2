import React, { useMemo, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ProteinForm() {
  const [form, setForm] = useState({
    weight: '',
    unit: 'kg',
    activity: 'moderate',
    goal: 'maintenance',
    archetype: 'auto',
    age: '',
    sex: 'other',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => {
    const w = parseFloat(form.weight)
    return !isNaN(w) && w > 0 && w < 1000
  }, [form.weight])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch(`${baseUrl}/api/protein`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: parseFloat(form.weight),
          unit: form.unit,
          activity: form.activity,
          goal: form.goal,
          age: form.age ? Number(form.age) : undefined,
          sex: form.sex,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Failed to calculate')
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const MacroPill = ({ label, grams, percent, color }) => (
    <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-2 border border-blue-500/20">
      <span className="text-sm text-blue-200/80">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className={`text-white font-semibold`}>{grams} g</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${color} text-slate-900 font-semibold`}>{percent}%</span>
      </div>
    </div>
  )

  const goalCopy = {
    fat_loss: {
      title: 'Cut & Reveal',
      subtitle: 'Lean out while keeping strength',
    },
    maintenance: {
      title: 'Stay Sharp',
      subtitle: 'Perform, recover, and maintain',
    },
    muscle_gain: {
      title: 'Build & Charge',
      subtitle: 'Progressive overload meets recovery',
    },
  }

  const archetypeOptions = [
    { value: 'auto', label: 'Auto match', tagline: 'We’ll show all plans tuned to your goal' },
    { value: 'Lifting Beast', label: 'Lifting Beast', tagline: 'Strength-focused with steady carbs' },
    { value: 'Mat Dominator', label: 'Mat Dominator', tagline: 'Mat-ready power with leanness' },
    { value: 'Track Rocket', label: 'Track Rocket', tagline: 'Explosive speed and fast fuel' },
    { value: 'Grand Tour Engine', label: 'Grand Tour Engine', tagline: 'Endurance engine for long rides' },
  ]

  const getDisplayedSuggestions = () => {
    if (!result || !Array.isArray(result.suggestions)) return []
    const list = [...result.suggestions]
    if (form.archetype && form.archetype !== 'auto') {
      list.sort((a, b) => (a.name === form.archetype ? -1 : b.name === form.archetype ? 1 : 0))
    }
    return list
  }

  const displayed = getDisplayedSuggestions()

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <form onSubmit={onSubmit} className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm text-blue-200/80 mb-1">Weight</label>
            <div className="flex gap-3">
              <input
                type="number"
                name="weight"
                step="0.1"
                min="1"
                max="999"
                value={form.weight}
                onChange={onChange}
                className="flex-1 bg-slate-900/60 text-white rounded-lg px-3 py-2 border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="e.g., 70"
                required
              />
              <select
                name="unit"
                value={form.unit}
                onChange={onChange}
                className="w-28 bg-slate-900/60 text-white rounded-lg px-3 py-2 border border-blue-500/30 focus:outline-none"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-blue-200/80 mb-1">Activity</label>
            <select
              name="activity"
              value={form.activity}
              onChange={onChange}
              className="w-full bg-slate-900/60 text-white rounded-lg px-3 py-2 border border-blue-500/30 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-blue-200/80 mb-1">Goal</label>
            <select
              name="goal"
              value={form.goal}
              onChange={onChange}
              className="w-full bg-slate-900/60 text-white rounded-lg px-3 py-2 border border-blue-500/30 focus:outline-none"
            >
              <option value="fat_loss">Cut & Reveal (Fat Loss)</option>
              <option value="maintenance">Stay Sharp (Maintenance)</option>
              <option value="muscle_gain">Build & Charge (Muscle Gain)</option>
            </select>
            <div className="mt-1 text-xs text-blue-200/70">
              {goalCopy[form.goal].title}: {goalCopy[form.goal].subtitle}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-blue-200/80 mb-1">Archetype vibe</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {archetypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, archetype: opt.value }))}
                  className={`text-left bg-slate-900/60 border rounded-lg px-3 py-2 transition ${
                    form.archetype === opt.value ? 'border-blue-500/60 ring-2 ring-blue-500/30' : 'border-blue-500/20'
                  }`}
                >
                  <div className="text-white text-sm font-semibold">{opt.label}</div>
                  <div className="text-blue-200/70 text-xs">{opt.tagline}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-blue-200/80 mb-1">Age</label>
            <input
              type="number"
              name="age"
              min="10"
              max="100"
              value={form.age}
              onChange={onChange}
              className="w-full bg-slate-900/60 text-white rounded-lg px-3 py-2 border border-blue-500/30 focus:outline-none"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm text-blue-200/80 mb-1">Sex</label>
            <select
              name="sex"
              value={form.sex}
              onChange={onChange}
              className="w-full bg-slate-900/60 text-white rounded-lg px-3 py-2 border border-blue-500/30 focus:outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer not to say</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? 'Calculating...' : 'Calculate' }
        </button>

        {error && (
          <p className="mt-3 text-red-300 text-sm">{error}</p>
        )}
      </form>

      <div className="bg-slate-800/30 border border-blue-500/10 rounded-2xl p-6">
        {!result ? (
          <div className="text-blue-200/80">
            Enter your details and tap Calculate to see your personalized daily protein range.
          </div>
        ) : (
          <div>
            <div className="text-2xl font-bold text-white">{result.daily_grams_target} g/day</div>
            <div className="text-blue-200/80 mb-4">Target within your range</div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-900/60 rounded-lg p-3 border border-blue-500/20">
                <div className="text-sm text-blue-200/80">Min</div>
                <div className="text-xl font-semibold text-white">{result.daily_grams_min} g</div>
              </div>
              <div className="bg-slate-900/60 rounded-lg p-3 border border-blue-500/20">
                <div className="text-sm text-blue-200/80">Target</div>
                <div className="text-xl font-semibold text-white">{result.daily_grams_target} g</div>
              </div>
              <div className="bg-slate-900/60 rounded-lg p-3 border border-blue-500/20">
                <div className="text-sm text-blue-200/80">Max</div>
                <div className="text-xl font-semibold text-white">{result.daily_grams_max} g</div>
              </div>
            </div>

            <div className="text-sm text-blue-200/80 mb-2">
              Weight used: {result.weight_kg} kg
            </div>
            <div className="text-sm text-blue-200/80">
              Range basis: {result.grams_per_kg_range[0]}–{result.grams_per_kg_range[1]} g/kg
            </div>

            <p className="mt-4 text-blue-200/90 text-sm leading-relaxed">
              {result.rationale}
            </p>

            {Array.isArray(displayed) && displayed.length > 0 && (
              <div className="mt-8">
                <h3 className="text-white font-semibold text-lg mb-3">Archetypal meal plans</h3>
                <div className="space-y-4">
                  {displayed.map((s, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-xl p-4 border border-blue-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <div className="text-white font-semibold flex items-center gap-2">
                            {s.name}
                            {form.archetype !== 'auto' && s.name === form.archetype && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-400 text-slate-900 font-semibold">Your pick</span>
                            )}
                          </div>
                          <div className="text-blue-200/70 text-sm">{s.tagline}</div>
                        </div>
                        <div className="text-blue-200/80 text-sm">~{s.macros.calories} kcal</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <MacroPill label="Protein" grams={s.macros.protein_g} percent={s.macros.split_percent.protein} color="bg-blue-400" />
                        <MacroPill label="Carbs" grams={s.macros.carbs_g} percent={s.macros.split_percent.carbs} color="bg-emerald-400" />
                        <MacroPill label="Fats" grams={s.macros.fats_g} percent={s.macros.split_percent.fats} color="bg-amber-400" />
                      </div>

                      <ul className="mt-3 list-disc list-inside text-blue-200/80 text-sm space-y-1">
                        {s.sample_meals.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
