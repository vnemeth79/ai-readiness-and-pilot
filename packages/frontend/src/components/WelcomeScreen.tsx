import { Sparkles, Clock, Target, BarChart3 } from 'lucide-react';
import { MinervaLogo, PoweredBy } from './PoweredBy';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
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
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-minerva-red/10 border border-minerva-red/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-minerva-red" />
              <span className="text-minerva-red text-sm font-medium">AI-Powered Assessment</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Discover Your Perfect
              <span className="block text-minerva-red">
                AI Pilot Project
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Complete our quick assessment to receive personalized AI implementation 
              recommendations tailored to your business needs and readiness level.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="7-9 Minutes"
              description="Quick, focused assessment with 14 strategic questions"
            />
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="Personalized"
              description="Get recommendations tailored to your industry and goals"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Actionable"
              description="Receive prioritized pilot projects with clear next steps"
            />
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={onStart}
              className="group relative inline-flex items-center gap-3 btn-minerva px-8 py-4 rounded-xl text-lg"
            >
              Start Your Free Assessment
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
            
            <p className="text-gray-500 text-sm mt-4">
              No credit card required • Get your report instantly
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Minerva Consultores. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-600 text-sm">Your data is secure and confidential</span>
            <PoweredBy />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-minerva-gray/30 backdrop-blur-sm border border-gray-800 hover:border-minerva-red/30 rounded-2xl p-6 transition-all hover:bg-minerva-gray/50">
      <div className="w-12 h-12 bg-minerva-red/10 rounded-xl flex items-center justify-center text-minerva-red mb-4">
        {icon}
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
