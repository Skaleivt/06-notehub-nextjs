import NotesClient from "./Notes.client";
import { fetchNotes } from "../../lib/api";
import { QueryClient } from "@tanstack/react-query";
import type { NoteSearchResponse } from "../../lib/api";

export default async function NotesPage() {
  const queryClient = new QueryClient();
  const searchQuery = "";
  const page = 1;

  const initialData: NoteSearchResponse = await fetchNotes(searchQuery, page);

  await queryClient.prefetchQuery({
    queryKey: ["notes", searchQuery, page],
    queryFn: () => Promise.resolve(initialData),
  });

  return (
    <NotesClient
      initialData={initialData}
      searchQuery={searchQuery}
      currentPage={page}
    />
  );
}
