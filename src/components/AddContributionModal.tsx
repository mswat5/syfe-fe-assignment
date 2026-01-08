import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGoalsStore } from '../store/goals';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const contributionSchema = z.object({
  amount: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Please enter a valid amount greater than 0',
    })
    .refine((val) => val >= 0.01, {
      message: 'Amount must be at least 0.01',
    }),
  date: z
    .string()
    .min(1, 'Please select a date')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return selectedDate <= today;
    }, 'Date cannot be in the future'),
});

type ContributionInput = z.input<typeof contributionSchema>;

type AddContributionModalProps = {
  goalId: string;
  goalName: string;
  onClose: () => void;
};

export const AddContributionModal = ({ goalId, goalName, onClose }: AddContributionModalProps) => {
  const { addContribution } = useGoalsStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContributionInput>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: ContributionInput) => {
    addContribution(goalId, {
      amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount,
      date: data.date,
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <Card className="max-w-md w-full">
        <h2 className="text-3xl font-black mb-3 uppercase tracking-tight">Add Contribution</h2>
        <p className="text-gray-400 mb-6 font-mono text-sm">
          To: <span className="font-bold text-yellow-400">{goalName}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label htmlFor="amount" className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              {...register('amount')}
              placeholder="1000"
              step="0.01"
              min="0"
              autoFocus
              className="form-input"
            />
            {errors.amount && <p className="text-red-400 text-xs mt-2 font-bold">{errors.amount.message}</p>}
          </div>

          <div className="mb-8">
            <label htmlFor="date" className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
              Date
            </label>
            <input
              id="date"
              type="date"
              {...register('date')}
              max={new Date().toISOString().split('T')[0]}
              className="form-input"
            />
            {errors.date && <p className="text-red-400 text-xs mt-2 font-bold">{errors.date.message}</p>}
          </div>

          <div className="flex gap-4">
            <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Add
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
