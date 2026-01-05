import { Loader2, Brain, BarChart3, FileText } from 'lucide-react';
import { MinervaLogo, PoweredBy } from './PoweredBy';

export function GeneratingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-minerva-black via-minerva-charcoal to-minerva-black flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <MinervaLogo />
          <PoweredBy />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {/* Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-minerva-red/20 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-minerva-red/30 rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-minerva-red to-minerva-red-dark rounded-full flex items-center justify-center shadow-lg shadow-minerva-red/30">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-white mb-4">
            Analyzing Your Responses
          </h2>
          
          <p className="text-gray-400 mb-8">
            Our AI is evaluating your business readiness and creating personalized recommendations...
          </p>

          {/* Progress Steps */}
          <div className="space-y-4">
            <ProgressStep 
              icon={<BarChart3 className="w-5 h-5" />}
              label="Calculating readiness scores"
              active
            />
            <ProgressStep 
              icon={<Brain className="w-5 h-5" />}
              label="Identifying optimal AI solutions"
              active
            />
            <ProgressStep 
              icon={<FileText className="w-5 h-5" />}
              label="Generating your report"
              active
            />
          </div>

          {/* Spinner */}
          <div className="mt-8 flex justify-center">
            <Loader2 className="w-8 h-8 text-minerva-red animate-spin" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center">
        <PoweredBy />
      </footer>
    </div>
  );
}

function ProgressStep({ icon, label, active }: { 
  icon: React.ReactNode; 
  label: string;
  active?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
      active 
        ? 'bg-minerva-red/10 border border-minerva-red/30' 
        : 'bg-minerva-gray/20 border border-gray-800'
    }`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        active ? 'bg-minerva-red/20 text-minerva-red' : 'bg-gray-800 text-gray-500'
      }`}>
        {icon}
      </div>
      <span className={active ? 'text-white' : 'text-gray-500'}>{label}</span>
      {active && (
        <Loader2 className="w-4 h-4 text-minerva-red animate-spin ml-auto" />
      )}
    </div>
  );
}

