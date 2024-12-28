export default function Home() {
  return (
    <main className="min-h-screen bg-black text-neon-blue">
      <div className="glitch-container relative">
        <nav className="border-b border-neon-pink/30 backdrop-blur-sm bg-black/30 fixed w-full z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-cyber glitch" data-text="BATUHAN AKCA">BATUHAN AKCA</h2>
            <div className="space-x-6">
              <button className="cyber-button">BLOG</button>
              <button className="cyber-button">PROJECTS</button>
              <button className="cyber-button">CONTACT</button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 pt-32">
          <div className="cyber-grid">
            <div className="cyber-card">
              <h1 className="text-6xl font-cyber mb-4 glitch-text" data-text="< DEVELOPER />">
                &lt; DEVELOPER /&gt;
              </h1>
              <p className="cyber-text">Coding from the depths of the digital world.</p>
              <div className="cyber-scanner"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 