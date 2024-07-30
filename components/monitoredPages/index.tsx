"use client";

import { useState, useEffect } from "react";
import { useAuth, useSession } from "@clerk/nextjs";
import { supabaseClient, formatTimestamp } from "@/src/utils";
import { useToast } from "@/components/ui/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";

import { Tables } from "@/database.types";
import { Button } from "@/components/button";
import { Subheading } from "@/components/heading";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/dialog";
import { Field, Label } from "@/components/fieldset";
import { Input } from "@/components/input";

interface PageType {
  pageId: string;
  pageUrl: string;
}

export const MonitoredPages = () => {
  const { session } = useSession();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Tables<"Page">[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newURL, setNewURL] = useState<string>("");
  const { toast } = useToast();

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

  const handleAddUrl = async (e: any) => {
    e.preventDefault();

    if (newURL === "") {
      // TODO: Add Input Validation
      return;
    }

    try {
      const response = await fetch(
        "https://alertful-ai-fastapi-app-j19t.onrender.com/api/addPages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            {
              userId: userId,
              pageUrl: newURL,
              query: "liseten to all changes",
              properties: [],
            },
          ]),
        }
      );

      await response.json();
      setIsOpen(false);

      toast({
        title: "Added URL!",
        description: `Successfully added the URL ${newURL} to be monitored.`,
      });

      setNewURL("");
      // TODO: Add Toast Success
    } catch (error) {
      // TODO: Add Toast Failure
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
      setNewURL("");
      setIsOpen(false);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex flex-end w-full justify-between items-center">
        <Subheading>Monitored URLs</Subheading>
        <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
          Add New URL
        </Button>
      </div>

      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Add New URL to Monitor</DialogTitle>
        <DialogDescription>
          Give us a URL that you want monitored and optionally add in what type
          of things you want to be notified about.
        </DialogDescription>

        <DialogBody>
          <Field>
            <Label>URL</Label>
            <Input
              name="URL"
              type="url"
              placeholder="www.google.com"
              onChange={(e) => setNewURL(e.target.value)}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => setIsOpen(false)}
            className="cursor-pointer"
          >
            Close
          </Button>
          <Button onClick={handleAddUrl} className="cursor-pointer">
            Add URL
          </Button>
        </DialogActions>
      </Dialog>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>URL</TableHeader>
            <TableHeader>Last Update</TableHeader>
            <TableHeader>Created At</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {pages?.length > 0 ? (
            <>
              {pages.map((page) => (
                <TableRow key={page.pageId} href={`/changes/${page.pageId}`}>
                  <TableCell>{page.pageUrl}</TableCell>
                  <TableCell>
                    {formatTimestamp(page.updated_at ?? "")}
                  </TableCell>
                  <TableCell>
                    {formatTimestamp(page.created_at ?? "")}
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
