import NotesClient from "./Notes.client";
import { fetchNotes } from "../../lib/api";
import { DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";
import {} from "@tanstack/react-query";

export default async function NotesPage() {
  const queryClient = new QueryClient();
  const searchQuery = "";
  const page = 1;

  await queryClient.prefetchQuery({
    queryKey: ["notes", searchQuery, page],
    queryFn: () => fetchNotes(searchQuery, page),
  });
  const dehydratedState: DehydratedState = dehydrate(queryClient);

  return (
    <NotesClient
      dehydratedState={dehydratedState}
      searchQuery={searchQuery}
      currentPage={page}
    />
  );
}
