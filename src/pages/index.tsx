import { useUser } from "@clerk/nextjs";

import { MonitoredPages } from "@/src/components/monitoredPages";
import { Heading } from "../components/tailwind/heading";

export default function App() {
  const { isSignedIn, isLoaded, user } = useUser();

  return (
    <>
      {!isLoaded ? (
        <></>
      ) : (
        <main>
          <div>
            {isSignedIn ? (
              <>
                <div>
                  <Heading>Hello, Pranay!</Heading>
                </div>

                <MonitoredPages />
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
    </>
  );
}
