import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Calendar, Unlock, CheckCircle, ArrowRight } from 'lucide-react';
import { MinervaLogo, PoweredBy } from './PoweredBy';
import type { AssessmentScores } from '../types';

interface ReportViewProps {
  report: string;
  scores?: AssessmentScores | null;
  tier: 'free' | 'pro';
  onUpgrade: () => void;
  onDownloadPdf?: () => void;
  onScheduleConsultation?: () => void;
  onStartNew: () => void;
}

export function ReportView({ 
  report, 
  scores, 
  tier, 
  onUpgrade,
  onDownloadPdf,
  onScheduleConsultation,
  onStartNew
}: ReportViewProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await onUpgrade();
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-minerva-black via-minerva-charcoal to-minerva-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-minerva-black/90 backdrop-blur-sm border-b border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <MinervaLogo />
          <div className="flex items-center gap-3">
            {tier === 'pro' && onDownloadPdf && (
              <button
                onClick={onDownloadPdf}
                className="flex items-center gap-2 bg-minerva-gray/50 hover:bg-minerva-gray border border-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download PDF</span>
              </button>
            )}
            {tier === 'pro' && onScheduleConsultation && (
              <button
                onClick={onScheduleConsultation}
                className="flex items-center gap-2 btn-minerva px-4 py-2 rounded-lg"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Schedule Consultation</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Scores Summary */}
        {scores && (
          <div className="mb-8 p-6 bg-minerva-gray/30 border border-gray-800 rounded-2xl">
            <h3 className="text-white font-semibold mb-4">Readiness Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ScoreCard label="Pain Points" score={scores.painPoints} />
              <ScoreCard label="Data Readiness" score={scores.dataReadiness} />
              <ScoreCard label="Org Readiness" score={scores.orgReadiness} />
              <ScoreCard label="Process Maturity" score={scores.processMaturity} />
              <ScoreCard label="Strategic Priorities" score={scores.strategicPriorities} />
              <ScoreCard label="Overall" score={scores.overall} highlight />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Strategic Intent:</span>
                <span className="px-3 py-1 bg-minerva-red/20 text-minerva-red rounded-full text-sm font-medium">
                  {scores.strategicIntent}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Report Content */}
        <div className="bg-minerva-gray/20 border border-gray-800 rounded-2xl p-6 md:p-8">
          <div className="markdown-content prose prose-invert max-w-none">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>

        {/* Upgrade CTA for Free Tier */}
        {tier === 'free' && (
          <div className="mt-8 p-8 bg-gradient-to-br from-minerva-red/20 to-minerva-black border border-minerva-red/30 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-minerva-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Unlock className="w-6 h-6 text-minerva-red" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  Unlock Your Complete Implementation Plan
                </h3>
                <p className="text-gray-400 mb-4">
                  Upgrade to the Pro Report to get full details for all priority projects, 
                  including implementation steps and budget estimates.
                </p>
                
                <ul className="space-y-2 mb-6">
                  <ProFeature>Full details for all 3 priority projects</ProFeature>
                  <ProFeature>Detailed business impact analysis</ProFeature>
                  <ProFeature>Step-by-step implementation approach</ProFeature>
                  <ProFeature>Budget estimates for each project</ProFeature>
                  <ProFeature>PDF export for sharing with stakeholders</ProFeature>
                  <ProFeature>Priority consultation scheduling</ProFeature>
                </ul>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    onClick={handleUpgrade}
                    disabled={isUpgrading}
                    className="btn-minerva px-6 py-3 rounded-xl flex items-center gap-2"
                  >
                    {isUpgrading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Upgrade to Pro Report
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <span className="text-2xl font-bold text-white">$199</span>
                  <span className="text-gray-500 text-sm">One-time payment</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pro Badge */}
        {tier === 'pro' && (
          <div className="mt-8 p-4 bg-minerva-red/10 border border-minerva-red/30 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-minerva-red" />
            <div>
              <p className="text-white font-medium">Pro Report Unlocked</p>
              <p className="text-gray-400 text-sm">You have access to the complete implementation plan</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-800">
          <button
            onClick={onStartNew}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Start a New Assessment
          </button>
          <PoweredBy />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Minerva Consultores. All rights reserved.
          </p>
          <PoweredBy />
        </div>
      </footer>
    </div>
  );
}

function ScoreCard({ label, score, highlight }: { 
  label: string; 
  score: number;
  highlight?: boolean;
}) {
  const getScoreColor = (s: number) => {
    if (s >= 4) return 'text-green-400';
    if (s >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`p-4 rounded-xl ${
      highlight 
        ? 'bg-minerva-red/20 border border-minerva-red/30' 
        : 'bg-minerva-black/50 border border-gray-800'
    }`}>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-minerva-red' : getScoreColor(score)}`}>
        {score.toFixed(1)}
        <span className="text-gray-600 text-sm font-normal">/5</span>
      </p>
    </div>
  );
}

function ProFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-gray-300">
      <CheckCircle className="w-4 h-4 text-minerva-red flex-shrink-0" />
      {children}
    </li>
  );
}

