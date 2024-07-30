import { useRouter } from "next/router";
import { useSession } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { formatTimestamp, supabaseClient } from "@/src/utils";
import { Tables } from "@/database.types";
import { Heading, Subheading } from "@/components/heading";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/table";
import Breadcrumbs from "@/components/breadcrumbs";

export default function Change() {
  const { session, isLoaded } = useSession();
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState<Tables<"Change">[]>([]);
  const [pageData, setPageData] = useState<string>();

  useEffect(() => {
    if (!isLoaded) return;

    const loadChanges = async () => {
      try {
        setLoading(true);
        const supabaseAccessToken = await session?.getToken({
          template: "supabase",
        });
        const supabase = await supabaseClient(supabaseAccessToken ?? "");
        const { data: page } = await supabase
          .from("Page")
          .select("pageUrl")
          .eq("pageId", slug ?? "")
          .limit(1)
          .single();

        const { data: changes } = await supabase
          .from("Change")
          .select("*")
          .eq("pageId", slug ?? "")
          .neq("summary", "")
          .order("created_at", { ascending: false });
        setChanges(changes ?? []);
        setPageData(page?.pageUrl ?? "");
      } catch (e) {
        alert(e);
      } finally {
        setLoading(false);
      }
    };

    loadChanges();
  }, [isLoaded, session, slug]);

  return (
    <div>
      <Breadcrumbs />

      <div className="mt-8">
        <Heading>Changes for {pageData}</Heading>
      </div>

      <div className="mt-12">
        <div className="flex flex-end w-full items-center">
          <Subheading>Change History</Subheading>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>URL</TableHeader>
              <TableHeader>Summary</TableHeader>
              <TableHeader>Updated at</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {changes.length > 0 ? (
              <>
                {changes.map((change) => {
                  return (
                    <TableRow key={change.changeId}>
                      <TableCell>
                        <a
                          href={change.imageUrl}
                          className="text-blue-600/100 hover:text-blue-300"
                        >
                          View Image
                        </a>
                      </TableCell>
                      <TableCell className="text-pretty">
                        <p>{change.summary}</p>
                      </TableCell>
                      <TableCell>
                        {formatTimestamp(change.created_at)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </TableBody>
        </Table>

        {loading ? <p>Loading...</p> : <></>}
      </div>
    </div>
  );
}
