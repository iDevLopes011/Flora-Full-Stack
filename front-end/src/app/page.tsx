"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import { Clock, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchHistory } from "@/services/api";
import { SearchBar } from "@/components/ui/SearchBar/SearchBar";
import { HistoryItem } from "@/components/features/history/HistoryItem/HistoryItem";
import { ListSkeleton } from "@/components/ui/ListSkeleton/ListSkeleton";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState<{ word: string; added: string }[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingHistory(true);
    try {
      const data = await fetchHistory({ limit: 50, page: 1 });
      const seen = new Set<string>();
      const unique = (data.results || []).filter((item) => {
        const key = item.word.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setHistory(unique.slice(0, 8));
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    } finally {
      setLoadingHistory(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className={`container ${styles.container}`}>
      <main className={styles.main}>
        {}
        <div className={styles.heroSection}>
          <h1 className={styles.title}>O que você quer aprender hoje?</h1>
          <p className={styles.subtitle}>
            Digite uma palavra em inglês para explorar seu significado,
            pronúncia e contexto.
          </p>
          <SearchBar />
        </div>

        {}
        {isAuthenticated && (
          <section className={styles.historySection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Clock size={18} className={styles.sectionIcon} />
                Histórico de Pesquisas
              </h2>
              <Link href="/history" className={styles.viewAllLink}>
                Ver tudo <ChevronRight size={14} />
              </Link>
            </div>

            <div className={styles.historyList}>
              {loadingHistory ? (
                <ListSkeleton rows={5} />
              ) : history.length === 0 ? (
                <div className={styles.historyEmpty}>
                  <BookOpen size={36} className={styles.historyEmptyIcon} />
                  <span>Nenhuma palavra pesquisada ainda.</span>
                  <span>Experimente buscar uma palavra acima!</span>
                </div>
              ) : (
                history.map((item, index) => (
                  <HistoryItem
                    key={index}
                    word={item.word}
                    added={item.added}
                  />
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
