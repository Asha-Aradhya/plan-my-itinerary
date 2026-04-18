import styles from './StepIndicator.module.scss';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className={styles.wrapper}>
      {steps.map((label, index) => {
        const state =
          index < currentStep ? 'completed' : index === currentStep ? 'active' : 'pending';
        return (
          <div key={label} className={styles.stepItem}>
            <div className={`${styles.dot} ${styles[state]}`}>
              {state === 'completed' ? '✓' : index + 1}
            </div>
            <span className={`${styles.label} ${styles[state]}`}>{label}</span>
            {index < steps.length - 1 && (
              <div className={`${styles.line} ${index < currentStep ? styles.lineFilled : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
