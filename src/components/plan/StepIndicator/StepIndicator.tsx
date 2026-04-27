import styles from './StepIndicator.module.scss';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Form progress" className={styles.wrapper}>
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const state = isCompleted ? 'completed' : isActive ? 'active' : 'pending';

        return (
          <div
            key={label}
            className={styles.stepItem}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className={`${styles.dot} ${styles[state]}`} aria-hidden="true">
              {isCompleted ? '✓' : index + 1}
            </div>
            <span className={`${styles.label} ${styles[state]}`}>
              <span className="sr-only">
                {isCompleted ? 'Completed: ' : isActive ? 'Current: ' : 'Upcoming: '}
              </span>
              {label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`${styles.line} ${isCompleted ? styles.lineFilled : ''}`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
