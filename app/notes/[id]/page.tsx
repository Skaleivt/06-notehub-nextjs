import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";

type Props = { params: Promise<{ noteId: string }> };

export default async function NoteDetails({ params }: Props) {
  const queryClient = new QueryClient();
  const { noteId } = await params;
  await queryClient.prefetchQuery({
    queryKey: ["note", ""],
    queryFn: () => fetchNoteById(noteId),
  });

  const dehydratedState = dehydrate(queryClient);

  return <NoteDetailsClient dehydratedState={dehydratedState} />;
}
