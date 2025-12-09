import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Yokai Dashboard</h1>
        <p className={styles.description}>
          Monitoring and capturing yokai spirits in Tokyo
        </p>
        <Link href="/monitoring">
          <Button variant="primary" size="large">
            Open Dashboard →
          </Button>
        </Link>
      </main>
    </div>
  );
}
