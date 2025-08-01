"use client";

import type { NoteClientProps } from "@/types/note";
import { HydrationBoundary, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import css from "./NoteDetails.module.css";
import { fetchNoteById } from "@/lib/api";

export default function NoteDetailsClient({
  dehydratedState,
}: NoteClientProps) {
  const params = useParams();
  const noteId = params?.id as string;
  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsPage id={noteId}></NoteDetailsPage>
    </HydrationBoundary>
  );
}

function NoteDetailsPage({ id }: { id: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !data) return <p>Something went wrong.</p>;
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
        </div>
        <p className={css.content}>{data.content}</p>
        <p className={css.date}>{data.createdAt}</p>
      </div>
    </div>
  );
}
