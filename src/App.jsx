import React, { useState } from 'react';
import { GraphProvider } from './context/GraphContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomeView from './components/views/HomeView';
import GuidedSimulationView from './components/views/GuidedSimulationView';
import InteractiveLabView from './components/views/InteractiveLabView';
import MathFoundationsView from './components/views/MathFoundationsView';
import PresentationModeView from './components/views/PresentationModeView';
import NodeInspectorModal from './components/panels/NodeInspectorModal';
import ScenarioManagerModal from './components/panels/ScenarioManagerModal';
import Toast from './components/ui/Toast';

function AppContent() {
  const [activeView, setActiveView] = useState('home');
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenScenarios={() => setIsScenarioModalOpen(true)}
      />

      <main className="main-content">
        {activeView === 'home' && <HomeView setActiveView={setActiveView} />}
        {activeView === 'guided' && <GuidedSimulationView setActiveView={setActiveView} />}
        {activeView === 'lab' && <InteractiveLabView />}
        {activeView === 'theory' && <MathFoundationsView setActiveView={setActiveView} />}
        {activeView === 'presentation' && <PresentationModeView setActiveView={setActiveView} />}
      </main>

      <Footer />

      {/* Global Modals and Overlay Tools */}
      <NodeInspectorModal />
      <ScenarioManagerModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
      />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <GraphProvider>
      <AppContent />
    </GraphProvider>
  );
}
