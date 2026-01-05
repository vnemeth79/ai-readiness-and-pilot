import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ClientInfoForm } from './components/ClientInfoForm';
import { ChatInterface } from './components/ChatInterface';
import { GeneratingScreen } from './components/GeneratingScreen';
import { ReportView } from './components/ReportView';
import { useChat } from './hooks/useChat';
import type { AppPhase, ClientInfo } from './types';

function App() {
  const [phase, setPhase] = useState<AppPhase>('welcome');
  const {
    messages,
    isLoading,
    error,
    currentQuestion,
    reportMarkdown,
    scores,
    reportTier,
    startAssessment,
    sendMessage,
    generateReport,
    upgradeToProMock,
    reset,
  } = useChat();

  const handleStart = () => {
    setPhase('client_info');
  };

  const handleClientInfoSubmit = async (clientInfo: ClientInfo) => {
    try {
      await startAssessment(clientInfo);
      setPhase('assessment');
    } catch (err) {
      console.error('Failed to start assessment:', err);
    }
  };

  const handleGenerateReport = async () => {
    setPhase('generating');
    try {
      await generateReport();
      setPhase('report');
    } catch (err) {
      console.error('Failed to generate report:', err);
      setPhase('assessment');
    }
  };

  const handleUpgrade = async () => {
    await upgradeToProMock();
  };

  const handleStartNew = () => {
    reset();
    setPhase('welcome');
  };

  const handleDownloadPdf = () => {
    // TODO: Implement PDF download
    alert('PDF download will be available soon!');
  };

  const handleScheduleConsultation = () => {
    // Open Calendly or similar
    window.open('https://calendly.com/minerva-consultores', '_blank');
  };

  // Check if report is in the chat messages
  const hasReportInChat = messages.some(m => 
    m.role === 'assistant' && m.content.includes('AI Pilot Project Readiness Report')
  );

  // Auto-switch to report view if report is generated during chat
  if (hasReportInChat && phase === 'assessment') {
    const reportMessage = messages.find(m => 
      m.role === 'assistant' && m.content.includes('AI Pilot Project Readiness Report')
    );
    if (reportMessage) {
      return (
        <ReportView
          report={reportMessage.content}
          scores={scores}
          tier={reportTier}
          onUpgrade={handleUpgrade}
          onDownloadPdf={handleDownloadPdf}
          onScheduleConsultation={handleScheduleConsultation}
          onStartNew={handleStartNew}
        />
      );
    }
  }

  // Error display
  if (error) {
    return (
      <div className="min-h-screen bg-minerva-black flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleStartNew}
            className="btn-minerva px-6 py-3 rounded-xl"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  switch (phase) {
    case 'welcome':
      return <WelcomeScreen onStart={handleStart} />;
    
    case 'client_info':
      return <ClientInfoForm onSubmit={handleClientInfoSubmit} isLoading={isLoading} />;
    
    case 'assessment':
      return (
        <ChatInterface
          messages={messages}
          currentQuestion={currentQuestion}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onGenerateReport={handleGenerateReport}
        />
      );
    
    case 'generating':
      return <GeneratingScreen />;
    
    case 'report':
      return (
        <ReportView
          report={reportMarkdown || ''}
          scores={scores}
          tier={reportTier}
          onUpgrade={handleUpgrade}
          onDownloadPdf={handleDownloadPdf}
          onScheduleConsultation={handleScheduleConsultation}
          onStartNew={handleStartNew}
        />
      );
    
    default:
      return <WelcomeScreen onStart={handleStart} />;
  }
}

export default App;
