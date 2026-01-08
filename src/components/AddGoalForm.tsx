import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGoalsStore } from '../store/goals';
import type { Currency } from '../types/goals';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const goalSchema = z.object({
  name: z
    .string()
    .min(1, 'Goal name is required')
    .trim(),
  targetAmount: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Please enter a valid amount greater than 0',
    })
    .refine((val) => val >= 0.01, {
      message: 'Amount must be at least 0.01',
    }),
  currency: z.enum(['INR', 'USD']),
});

type GoalFormInput = z.input<typeof goalSchema>;

type AddGoalModalProps = {
  onClose: () => void;
};

export const AddGoalModal = ({ onClose }: AddGoalModalProps) => {
  const { addGoal } = useGoalsStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
      } = useForm<GoalFormInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: '',
      currency: 'INR',
    },
  });

  const onSubmit = (data: GoalFormInput) => {
    addGoal({
      id: '', // Will be overwritten by store
      name: data.name,
      totalAmount: typeof data.targetAmount === 'string' ? parseFloat(data.targetAmount) : data.targetAmount,
      currency: data.currency as Currency,
      contributions: [], // Will be overwritten by store
    });

    onClose();
  };
  return (
    <div className="modal-backdrop">
      <Card className="max-w-2xl w-full">
        <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Add New Goal</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 mb-8">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
                Goal Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                placeholder="e.g., Emergency Fund"
                autoFocus
                className="form-input"
              />
              {errors.name && <p className="text-red-400 text-xs mt-2 font-bold">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="targetAmount" className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
                Target Amount
              </label>
              <input
                id="targetAmount"
                type="number"
                {...register('targetAmount')}
                placeholder="10000"
                step="0.01"
                min="0"
                className="form-input"
              />
              {errors.targetAmount && <p className="text-red-400 text-xs mt-2 font-bold">{errors.targetAmount.message}</p>}
            </div>

            <div>
              <label htmlFor="currency" className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
                Currency
              </label>
              <select id="currency" {...register('currency')} className="form-input">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Add Goal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );


};
