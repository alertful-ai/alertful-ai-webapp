"use client";

import { useState, useEffect } from "react";
import { useSession } from "@clerk/nextjs";
import { supabaseClient, formatTimestamp } from "@/src/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/tailwind/table";

import { Tables } from "@/database.types";
import { Button } from "@/src/components/tailwind/button";
import { Subheading } from "../tailwind/heading";

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
    <div className="mt-12">
      <div className="flex flex-end w-full justify-between items-center">
        <Subheading>Monitored URLs</Subheading>
        <Button>Add New URL</Button>
      </div>
      {pages?.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>URL</TableHeader>
              <TableHeader>Last Update</TableHeader>
              <TableHeader>Created At</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.pageId} href={`/changes/${page.pageId}`}>
                <TableCell>{page.pageUrl}</TableCell>
                <TableCell>{formatTimestamp(page.updated_at)}</TableCell>
                <TableCell>{formatTimestamp(page.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div>You haven&apos;t started monitoring any pages!</div>
      )}
    </div>
  );
};
