import { useGoalsStore } from '../store/goals';
import { formatCurrency, calculateSavedAmount } from '../utils/currency';
import { Button } from './ui';

type DashboardProps = {
  lastUpdated: string;
  onRefresh: () => void;
  isRefreshing: boolean;
};

export const Dashboard = ({ lastUpdated, onRefresh, isRefreshing }: DashboardProps) => {
  const {goals} = useGoalsStore();

  const totalTargetINR = goals
    .filter((g) => g.currency === 'INR')
    .reduce((sum, g) => sum + g.totalAmount, 0);

  const totalTargetUSD = goals
    .filter((g) => g.currency === 'USD')
    .reduce((sum, g) => sum + g.totalAmount, 0);

  const totalSavedINR = goals
    .filter((g) => g.currency === 'INR')
    .reduce((sum, g) => sum + calculateSavedAmount(g), 0);

  const totalSavedUSD = goals
    .filter((g) => g.currency === 'USD')
    .reduce((sum, g) => sum + calculateSavedAmount(g), 0);

  const totalTarget = totalTargetINR + totalTargetUSD;
  const totalSaved = totalSavedINR + totalSavedUSD;
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 border-4 border-black p-8 mb-8 shadow-[12px_12px_0_rgba(0,0,0,0.3)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">
            Syfe Savings Planner
          </h1>
          <p className="text-purple-100 text-sm font-medium">Track your financial goals and build your future</p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            variant="primary"
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Rates'}
          </Button>
          <p className="text-xs text-purple-100 font-mono">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black bg-opacity-40 backdrop-blur-sm border-3 border-black p-6">
          <p className="text-purple-200 text-xs mb-2 uppercase font-bold tracking-wider">Total Target</p>
          <div className="space-y-1">
            {totalTargetINR > 0 && (
              <p className="text-3xl font-black text-white">{formatCurrency(totalTargetINR, 'INR')}</p>
            )}
            {totalTargetUSD > 0 && (
              <p className="text-3xl font-black text-white">{formatCurrency(totalTargetUSD, 'USD')}</p>
            )}
            {totalTarget === 0 && <p className="text-3xl font-black text-white">-</p>}
          </div>
        </div>

        <div className="bg-black bg-opacity-40 backdrop-blur-sm border-3 border-black p-6">
          <p className="text-purple-200 text-xs mb-2 uppercase font-bold tracking-wider">Total Saved</p>
          <div className="space-y-1">
            {totalSavedINR > 0 && (
              <p className="text-3xl font-black text-white">{formatCurrency(totalSavedINR, 'INR')}</p>
            )}
            {totalSavedUSD > 0 && (
              <p className="text-3xl font-black text-white">{formatCurrency(totalSavedUSD, 'USD')}</p>
            )}
            {totalSaved === 0 && <p className="text-3xl font-black text-white">-</p>}
          </div>
        </div>

        <div className="bg-black bg-opacity-40 backdrop-blur-sm border-3 border-black p-6">
          <p className="text-purple-200 text-xs mb-2 uppercase font-bold tracking-wider">Overall Progress</p>
          <p className="text-3xl font-black text-white mb-3">{overallProgress.toFixed(1)}%</p>
          <div className="w-full bg-black bg-opacity-30 h-4 border-2 border-black">
            <div
              className="bg-yellow-400 h-full transition-all duration-300 border-r-2 border-black"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {goals.length === 0 && (
        <div className="mt-6 text-center text-white bg-black bg-opacity-30 p-6 border-2 border-black">
          <p className="font-bold text-lg uppercase">No goals yet. Add your first goal below!</p>
        </div>
      )}
    </div>
  );
};
