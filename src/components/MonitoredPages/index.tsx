"use client";

import { useState, useEffect } from "react";
import { useSession } from "@clerk/nextjs";
import { supabaseClient } from "@/src/utils";

import { Tables } from "@/database.types";

interface PageType {
  pageId: string;
  pageUrl: string;
}

export const MonitoredPages = () => {
  const { session } = useSession();
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Tables<"Page">[]>([]);

  useEffect(() => {
    const loadPages = async () => {
      try {
        setLoading(true);
        const supabaseAccessToken = await session?.getToken({
          template: "supabase",
        });
        const supabase = await supabaseClient(supabaseAccessToken ?? "");
        const { data } = await supabase
          .from("Page")
          .select("*")
          .returns<Tables<"Page">[]>();
        setPages(data ?? []);
      } catch (e) {
        alert(e);
      } finally {
        setLoading(false);
      }
    };

    loadPages();
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {pages?.length > 0 ? (
        <div>
          <ol>
            {pages.map((page) => (
              <li key={page.pageId}>
                <a href={`/changes/${page.pageId}`}>{page.pageUrl}</a>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div>You haven&apos;t started monitoring any pages!</div>
      )}
    </>
  );
};
