import styles from "./MonitoredPages.module.css";

import { useState, useEffect } from "react";
import { useSession } from "@clerk/nextjs";
import { supabaseClient } from "@/utils";

export const MonitoredPages = () => {
  const { session } = useSession();
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(null);

  useEffect(() => {
    const loadPages = async () => {
      try {
        setLoading(true);
        const supabaseAccessToken = await session.getToken({
          template: "supabase",
        });
        const supabase = await supabaseClient(supabaseAccessToken);
        const { data: pages } = await supabase.from("Page").select("*");
        setPages(pages);
      } catch (e) {
        alert(e);
      } finally {
        setLoading(false);
      }
    };

    loadPages();
  }, []);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <>
      {pages?.length > 0 ? (
        <div className={styles.monitoredPages}>
          <ol>
            {pages.map((page) => (
              <li key={page.pageId}>
                <a href={`/changes/${page.pageId}`}>{page.pageUrl}</a>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className={styles.label}>
          You haven't started monitoring any pages!
        </div>
      )}
    </>
  );
};
