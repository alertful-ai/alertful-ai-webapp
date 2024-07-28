import { useUser } from "@clerk/nextjs";

import { MonitoredPages } from "@/src/components/MonitoredPages";
import { AddNewPage } from "@/src/components/AddNewPage";
import Home from "@/src/pages/Home";
import { Heading } from "../components/Tailwind/heading";

export default function App() {
  const { isSignedIn, isLoaded, user } = useUser();

  return (
    <Home>
      {!isLoaded ? (
        <></>
      ) : (
        <main>
          <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
            <Heading>Home</Heading>
          </div>
          <div>
            {isSignedIn ? (
              <>
                <div>Welcome {user.firstName}!</div>

                <MonitoredPages />
                <AddNewPage />
              </>
            ) : (
              <div>
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
