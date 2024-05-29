import styles from '../../styles/Home.module.css';
import { useRouter } from "next/router";
import Button from '@mui/material/Button';


export default function Header() {
  const router = useRouter()

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerTitle}>
        <h1>Tese</h1>
      </div>
      <div className={styles.headerButtons}>
        <Button onClick={() => router.push("/entities")}>
          Entities
        </Button>
        <Button onClick={() => router.push("/groups")}>
          Groups
        </Button>
        <Button onClick={() => router.push("/campaigns")}>
          Campaigns
        </Button>
      </div>
    </div>
  );
}
