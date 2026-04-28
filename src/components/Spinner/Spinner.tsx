import styles from './Spinner.module.scss';

interface Props {
  label?: string;
}

export default function Spinner({ label = 'Loading…' }: Props) {
  return (
    <span
      className={styles.spinner}
      role="status"
      aria-label={label}
    />
  );
}
