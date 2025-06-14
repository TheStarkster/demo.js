import { DemoStep } from './types';

interface StepProps extends Omit<DemoStep, 'id'> {
  id?: string;
}

export const createStep = (props: StepProps): DemoStep => {
  const { id, ...rest } = props;
  return {
    id: id || `step-${Math.random().toString(36).substring(2, 9)}`,
    ...rest
  };
}; 