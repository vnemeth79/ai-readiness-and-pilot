export function PoweredBy({ className = '' }: { className?: string }) {
  return (
    <a 
      href="https://agentize.eu" 
      target="_blank" 
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-400 transition-colors ${className}`}
    >
      <span>Powered by</span>
      <span className="font-medium text-minerva-red/70 hover:text-minerva-red">Agentize.eu</span>
    </a>
  );
}

export function MinervaLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Minerva Owl Icon */}
      <div className="w-10 h-10 bg-gradient-to-br from-minerva-red to-minerva-red-dark rounded-xl flex items-center justify-center shadow-lg shadow-minerva-red/20">
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 text-white"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9c.83 0 1.5-.67 1.5-1.5S10.83 8 10 8s-1.5.67-1.5 1.5S9.17 11 10 11zm4 0c.83 0 1.5-.67 1.5-1.5S14.83 8 14 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-2 5.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
        </svg>
      </div>
      <div>
        <h1 className="text-white font-display font-bold text-xl tracking-tight">
          Minerva
          <span className="text-minerva-red">Consultores</span>
        </h1>
      </div>
    </div>
  );
}

