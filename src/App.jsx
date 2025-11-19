import Header from './components/Header'
import ProteinForm from './components/ProteinForm'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_55%)]" />

      <div className="relative max-w-5xl mx-auto px-6 py-16">
        <Header />
        <ProteinForm />

        <div className="mt-12 text-center text-blue-200/70 text-sm">
          This tool provides general recommendations and is not a substitute for medical advice.
        </div>
      </div>
    </div>
  )
}

export default App
