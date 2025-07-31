import NotesClient from "./Notes.client";
import { fetchNotes } from "../../lib/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", "", 1],
    queryFn: () => fetchNotes("", 1),
  });

  const dehydratedState = dehydrate(queryClient);

  return <NotesClient dehydratedState={dehydratedState} />;
}
