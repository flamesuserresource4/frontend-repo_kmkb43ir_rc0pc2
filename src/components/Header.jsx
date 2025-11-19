import React from 'react'

export default function Header() {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center mb-6">
        <img
          src="/flame-icon.svg"
          alt="Flames"
          className="w-16 h-16 drop-shadow-[0_0_20px_rgba(59,130,246,0.45)]"
        />
      </div>
      <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
        Daily Protein Calculator
      </h1>
      <p className="text-blue-200/90 max-w-2xl mx-auto">
        Enter a few details and get a science-based protein range tailored to your activity and goal.
      </p>
    </div>
  )
}
