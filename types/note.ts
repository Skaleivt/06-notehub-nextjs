import type { DehydratedState } from "@tanstack/react-query";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  createdAt: string;
  updatedAt: string;
}

export interface NewNote {
  title: string;
  content: string;
  tag: Note["tag"];
}
export type NoteClientProps = {
  dehydratedState: DehydratedState;
};
