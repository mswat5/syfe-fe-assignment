import { useState } from 'react';
import { AddContributionModal } from './AddContributionModal';
import { Card, Button } from './ui';
import type { Goal } from '../types/goals';
import { calculateProgress, calculateSavedAmount, convertCurrency, formatCurrency } from '../utils/currency';



type GoalCardProps = {
  goal: Goal;
  exchangeRate: number;
};

export const GoalCard = ({ goal, exchangeRate }: GoalCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const savedAmount = calculateSavedAmount(goal);
  const progress = calculateProgress(goal);

  const otherCurrency = goal.currency === 'INR' ? 'USD' : 'INR';
  const convertedTarget = convertCurrency(goal.totalAmount, goal.currency, otherCurrency, exchangeRate);

  return (
    <>
      <Card className="hover:border-yellow-400 transition-all hover:shadow-[10px_10px_0_rgba(250,204,21,0.5)]">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-black uppercase tracking-tight">{goal.name}</h3>
          <Button onClick={() => setShowModal(true)} variant="primary" className="text-xs">
            + Add
          </Button>
        </div>

        <div className="space-y-4 mb-6 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Target:</span>
            <span className="font-black text-lg font-mono">{formatCurrency(goal.totalAmount, goal.currency)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Target ({otherCurrency}):</span>
            <span className="font-black text-gray-300 text-lg font-mono">{formatCurrency(convertedTarget, otherCurrency)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Saved:</span>
            <span className="font-black text-yellow-400 text-lg font-mono">{formatCurrency(savedAmount, goal.currency)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Progress</span>
            <span className="font-black text-lg">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-800 h-4 border-3 border-gray-600">
            <div
              className="bg-gradient-to-r from-purple-500 to-yellow-400 h-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {goal.contributions.length > 0 && (
          <div className="mt-6 pt-4 border-t-2 border-gray-800">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              {goal.contributions.length} Contribution{goal.contributions.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </Card>

      {showModal && (
        <AddContributionModal goalId={goal.id} goalName={goal.name} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
