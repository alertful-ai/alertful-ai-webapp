// import styles from "./Changes.module.css";

// import { useState, useEffect } from "react";
// import { useSession } from "@clerk/nextjs";
// import { supabaseClient } from "@/utils";

// export default function MonitoredPages() {
//   const { session, isLoaded } = useSession();
//   const [loading, setLoading] = useState(true);
//   const [changes, setChanges] = useState(null);

//   useEffect(() => {
//     if (!isLoaded) return;

//     const loadPages = async () => {
//       try {
//         setLoading(true);
//         const supabaseAccessToken = await session.getToken({
//           template: "supabase",
//         });
//         const supabase = await supabaseClient(supabaseAccessToken);
//         const { data: changes } = await supabase.from("Change").select("*").eq();
//         setChanges(changes);
//       } catch (e) {
//         alert(e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadPages();
//   }, [isLoaded]);

//   if (loading) {
//     return <div className={styles.container}>Loading...</div>;
//   }

//   return (
//     <>
//       {pages?.length > 0 ? (
//         <div className={styles.monitoredPages}>
//           <ol>
//             {pages.map((page) => (
//               <li key={page.pageId}>
//                 <a href={`/changes/${page.pageId}`}>{page.pageUrl}</a>
//               </li>
//             ))}
//           </ol>
//         </div>
//       ) : (
//         <div className={styles.label}>
//           You haven't started monitoring any pages!
//         </div>
//       )}
//     </>
//   );
// }

import { useRouter } from "next/router";
import { useSession } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { supabaseClient } from "@/utils";

export default function Change() {
  const { session, isLoaded } = useSession();
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    if (!isLoaded) return;

    const loadChanges = async () => {
      try {
        setLoading(true);
        const supabaseAccessToken = await session.getToken({
          template: "supabase",
        });
        const supabase = await supabaseClient(supabaseAccessToken);
        const { data: changes } = await supabase
          .from("Change")
          .select("*")
          .eq("pageId", slug);
        console.log("TESTING", changes);
        setChanges(changes);
      } catch (e) {
        alert(e);
      } finally {
        setLoading(false);
      }
    };

    loadChanges();
  }, [isLoaded]);

  console.log("CHANGES", changes);

  return (
    <>
      <Header />

      <p>{slug}</p>

      {loading ? <p>Loading...</p> : null}

      {changes.length > 0
        ? changes.map((change) => {
            return (
              <div
                key={change.changeId}
                style={{ display: "flex", marginBottom: 20 }}
              >
                <img
                  src={change.imageUrl}
                  alt="image"
                  width={600}
                  height={600}
                />
                <p>{change.summary}</p>
              </div>
            );
          })
        : null}
    </>
  );
}
