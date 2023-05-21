import PortfolioComponent from "../components/PortfolioComponent";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <PortfolioComponent />
      </main>
    </div>
  );
}
