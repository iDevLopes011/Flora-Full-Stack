"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./history.module.css";
import { Clock, BookOpen, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { useAuth } from "@/contexts/AuthContext";
import { fetchHistory } from "@/services/api";
import { AuthGate } from "@/components/ui/AuthGate/AuthGate";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import { ListSkeleton } from "@/components/ui/ListSkeleton/ListSkeleton";
import { HistoryItem } from "@/components/features/history/HistoryItem/HistoryItem";

const ITEMS_PER_PAGE = 15;

export default function HistoryPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [history, setHistory] = useState<{ word: string; added: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const loadHistory = useCallback(
    async (currentPage: number) => {
      if (!isAuthenticated) return;
      setLoading(true);
      setError(null);
      try {
        const fetchLimit = ITEMS_PER_PAGE * 4;
        const data = await fetchHistory({
          limit: fetchLimit,
          page: currentPage,
        });
        const seen = new Set<string>();
        const unique = (data.results || []).filter((item) => {
          const key = item.word.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setHistory(unique.slice(0, ITEMS_PER_PAGE));
        setTotalPages(data.totalPages || 1);
        setTotalDocs(data.totalDocs || 0);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar histórico.");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated],
  );

  useEffect(() => {
    if (!authLoading && isAuthenticated) loadHistory(page);
    else if (!authLoading && !isAuthenticated) setLoading(false);
  }, [isAuthenticated, authLoading, page, loadHistory]);

  if (authLoading) {
    return (
      <div className={`container ${styles.container}`}>
        <AuthGate
          icon={LogIn}
          title="Verificando sessão..."
          description="Aguarde um momento."
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`container ${styles.container}`}>
        <AuthGate
          icon={LogIn}
          title="Acesse sua conta"
          description="Você precisa estar logado para ver seu histórico de pesquisas."
        />
      </div>
    );
  }

  return (
    <div className={`container ${styles.container}`}>
      {}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageHeaderIcon}>
            <Clock size={22} />
          </div>
          <div>
            <h1 className={styles.pageTitle}>Histórico de Pesquisas</h1>
            {!loading && totalDocs > 0 && (
              <p className={styles.pageSubtitle}>
                {totalDocs} pesquisa{totalDocs !== 1 ? "s" : ""} encontrada
                {totalDocs !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      {}
      {error ? (
        <div className={styles.centerState}>
          <p className={styles.errorText}>{error}</p>
          <Button variant="outline" onClick={() => loadHistory(page)}>
            Tentar novamente
          </Button>
        </div>
      ) : loading ? (
        <div className={styles.historyList}>
          <ListSkeleton rows={8} />
        </div>
      ) : history.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Sem histórico ainda"
          description="Comece explorando palavras no dicionário."
          actionLabel="Explorar agora"
          actionHref="/"
        />
      ) : (
        <>
          <div className={styles.historyList}>
            {history.map((item, idx) => (
              <HistoryItem
                key={idx}
                word={item.word}
                added={item.added}
                index={(page - 1) * ITEMS_PER_PAGE + idx}
                showIndex
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
            disabled={loading}
          />
        </>
      )}
    </div>
  );
}
