"use client";

import css from "./Notes.client.module.css";
import { useState, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ToastContainer } from "react-toastify";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
  HydrationBoundary,
  type DehydratedState,
} from "@tanstack/react-query";

import { fetchNotes } from "../../lib/api";
import { showErrorToast } from "../../components/ShowErrorToast/ShowErrorToast";

import NoteList from "../../components/NoteList/NoteList";
import Pagination from "../../components/Pagination/Pagination";
import SearchBox from "../../components/SearchBox/SearchBox";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";

type NoteClientProps = {
  dehydratedState: DehydratedState;
  searchQuery: string;
  currentPage: number;
};

export default function NotesClient({
  dehydratedState,
  searchQuery: initialSearch,
  currentPage: initialPage,
}: NoteClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [inputValue, setInputValue] = useState(initialSearch);
  const [isModalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateSearchQuery = useDebouncedCallback(
    (value: string) => setSearchQuery(value),
    300
  );

  const handleInputChange = (value: string) => {
    setInputValue(value);
    updateSearchQuery(value);
  };

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () => fetchNotes(searchQuery, currentPage),
    placeholderData: keepPreviousData,
    initialData: () =>
      queryClient.getQueryData(["notes", searchQuery, currentPage]),
  });

  const refreshNotes = () => {
    queryClient.invalidateQueries({
      queryKey: ["notes", searchQuery, currentPage],
    });
  };

  const totalPages = data?.totalPages || 0;

  const noNotesToastShown = useRef(false);

  useEffect(() => {
    if (!isLoading && data && data.notes.length === 0) {
      if (!noNotesToastShown.current) {
        showErrorToast("No notes found for your request.");
        noNotesToastShown.current = true;
      }
    } else {
      noNotesToastShown.current = false;
    }
  }, [data, isLoading]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onChange={handleInputChange} value={inputValue} />
          {totalPages > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
          <button onClick={() => setModalOpen(true)} className={css.button}>
            Create note +
          </button>
          {isModalOpen && (
            <Modal onClose={() => setModalOpen(false)}>
              <NoteForm
                onSuccess={refreshNotes}
                onCancel={() => setModalOpen(false)}
              />
            </Modal>
          )}
        </header>
        {isSuccess && (
          <NoteList onDeleteSuccess={refreshNotes} notes={data.notes} />
        )}
        <ToastContainer />
      </div>
    </HydrationBoundary>
  );
}
