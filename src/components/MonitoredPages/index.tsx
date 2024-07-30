"use client";

import { useState, useEffect } from "react";
import { useAuth, useSession } from "@clerk/nextjs";
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
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/src/components/tailwind/dialog";
import { Field, Label } from "@/src/components/tailwind/fieldset";
import { Input } from "@/src/components/tailwind/input";
import { Dropdown, DropdownButton } from "../tailwind/dropdown";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Select } from "../tailwind/select";

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

      setNewURL("");
      setIsOpen(false);
      // TODO: Add Toast Success
    } catch (error) {
      // TODO: Add Toast Failure
      console.error("Error adding page:", error);
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
                  <TableCell>{formatTimestamp(page.updated_at)}</TableCell>
                  <TableCell>{formatTimestamp(page.created_at)}</TableCell>
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
