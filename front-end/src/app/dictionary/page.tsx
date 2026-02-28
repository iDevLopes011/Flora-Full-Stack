"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./dictionary.module.css";
import { Input } from "@/components/ui/Input/Input";
import {
  fetchWords,
  WordListResponse,
  fetchWordDetails,
  WordDetailsResponse,
} from "@/services/api";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import { WordModal } from "@/components/features/dictionary/WordModal/WordModal";

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const [data, setData] = useState<WordListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 40;
  const totalPagesRef = useRef(1);

  const [wordDetails, setWordDetails] = useState<WordDetailsResponse | null>(
    null,
  );
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchWords({ page, limit, search: debouncedSearch })
      .then((response) => {
        if (!cancelled) {
          setData(response);
          totalPagesRef.current = response.totalPages;
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Erro ao carregar dicionário");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (!selectedWord) {
      setWordDetails(null);
      setDetailsError(null);
      return;
    }
    let cancelled = false;
    setLoadingDetails(true);
    setDetailsError(null);

    fetchWordDetails(selectedWord)
      .then((details) => {
        if (!cancelled) setWordDetails(details);
      })
      .catch((err) => {
        if (!cancelled)
          setDetailsError(err.message || "Erro ao carregar detalhes");
      })
      .finally(() => {
        if (!cancelled) setLoadingDetails(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedWord]);

  const words = data?.results || [];

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dicionário</h1>
        <p className={styles.subtitle}>
          Explore todas as palavras disponíveis em nossa base.
        </p>
        <div className={styles.searchWrapper}>
          <Input
            placeholder="Filtrar palavras..."
            icon="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className={styles.errorState}>{error}</div>}

      <div className={styles.grid}>
        {loading && words.length === 0
          ? Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={styles.wordCardSkeleton}>
              <div className={styles.wordCardContent}>&nbsp;</div>
            </div>
          ))
          : words.map((word, idx) => (
            <div
              key={idx}
              className={styles.wordCard}
              onClick={() => setSelectedWord(word)}
            >
              <div className={styles.wordCardContent}>{word}</div>
            </div>
          ))}
      </div>

      {!loading && !error && words.length === 0 && (
        <div className={styles.emptyState}>
          Nenhuma palavra encontrada {searchTerm && `para "${searchTerm}"`}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPagesRef.current}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPagesRef.current, p + 1))}
      />

      {selectedWord && (
        <WordModal
          word={selectedWord}
          details={wordDetails}
          loading={loadingDetails}
          error={detailsError}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </div>
  );
}
