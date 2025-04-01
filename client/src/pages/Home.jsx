import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import logo from '../assets/gemini_icon.png'; // Update this path based on your actual logo file location

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <img src={logo} alt="Chatsphere Fusion Logo" className={styles.logo} />
        <h1>Welcome to Chatsphere Fusion</h1>
        <p>Join us today to experience amazing features</p>
        <div className={styles.buttons}>
          <Link to="/login" className={styles.btn}>Login</Link>
          <Link to="/signup" className={`${styles.btn} ${styles.btnOutline}`}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
