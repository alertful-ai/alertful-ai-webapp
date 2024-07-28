import styles from "./Home.module.css";

import { useUser } from "@clerk/nextjs";
import { Header } from "@/src/components/Header";

import { MonitoredPages } from "@/src/components/MonitoredPages";
import { AddNewPage } from "@/src/components/AddNewPage";
import Home from "@/src/pages/Home";

export default function App() {
  const { isSignedIn, isLoaded, user } = useUser();

  return (
    <Home>
      {!isLoaded ? (
        <></>
      ) : (
        <main className={styles.main}>
          <div className={styles.container}>
            {isSignedIn ? (
              <>
                <div className={styles.label}>Welcome {user.firstName}!</div>

                <MonitoredPages />
                <AddNewPage />
              </>
            ) : (
              <div className={styles.label}>
                Sign in to start monitoring and get automated alerts on your
                competitors!
              </div>
            )}
          </div>
        </main>
      )}
    </Home>
  );
}
