import { useRouter } from "next/router";
import { useSession } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { supabaseClient } from "@/utils";
import Image from "next/image";

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
  }, [isLoaded, session, slug]);

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
                <Image
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
