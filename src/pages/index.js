import styles from "./Home.module.css";

import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/Header";

import { MonitoredPages } from "@/components/MonitoredPages";
import { AddNewPage } from "@/components/AddNewPage";

export default function Home() {
  const { isSignedIn, isLoading, user } = useUser();

  return (
    <>
      <Header />
      {isLoading ? (
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
    </>
  );
}
