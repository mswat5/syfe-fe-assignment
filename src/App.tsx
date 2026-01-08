import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { AddGoalModal } from './components/AddGoalForm';
import { GoalCard } from './components/GoalCard';
import { Button } from './components/ui';
import { useGoalsStore } from './store/goals';
import { useExchangeRate } from './hooks/useExchangeRate';

const queryClient = new QueryClient();

function AppContent() {
  const {goals} = useGoalsStore();
  const { data, isLoading, isError, error, refetch, isFetching } = useExchangeRate();
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);

  const exchangeRate = data?.conversion_rates?.INR || 83;
  const lastUpdated = data?.time_last_update_unix
    ? new Date(data.time_last_update_unix * 1000).toLocaleString()
    : 'Never';

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-6"></div>
          <p className="text-white text-lg font-black uppercase tracking-wider">Loading exchange rates...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="bg-gray-900 p-10 border-4 border-red-500 shadow-[12px_12px_0_rgba(239,68,68,0.5)] max-w-md w-full">
          <div className="text-red-500 text-center mb-6">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-black uppercase tracking-tight">Error Loading Rates</h2>
          </div>
          <p className="text-gray-400 text-center mb-6 font-mono text-sm">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <button
            onClick={handleRefresh}
            className="w-full px-6 py-4 bg-yellow-400 text-black font-black uppercase border-4 border-black hover:bg-yellow-300 transition-all shadow-[6px_6px_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Dashboard lastUpdated={lastUpdated} onRefresh={handleRefresh} isRefreshing={isFetching} exchangeRate={exchangeRate} />

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Your Goals</h2>
          <Button onClick={() => setIsAddGoalModalOpen(true)} className="px-6 py-3 text-sm" variant="primary">
            + Add Goal
          </Button>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 border-4 border-gray-700 shadow-[8px_8px_0_rgba(0,0,0,1)]">
            <svg
              className="w-20 h-20 mx-auto text-gray-700 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">No goals yet</h3>
            <p className="text-gray-400 font-mono text-sm">Click "Add Goal" above to create your first savings goal</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} exchangeRate={exchangeRate} />
            ))}
          </div>
        )}

        {isAddGoalModalOpen && <AddGoalModal onClose={() => setIsAddGoalModalOpen(false)} />}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
