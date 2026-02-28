"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Star, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchFavorites, unfavoriteWord } from "@/services/api";
import { AuthGate } from "@/components/ui/AuthGate/AuthGate";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { FavoriteCard } from "@/components/features/favorites/FavoriteCard/FavoriteCard";
import { Button } from "@/components/ui/Button/Button";

export default function FavoritesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<{ word: string; added: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await fetchFavorites({ limit: 100, page: 1 });
      setFavorites(data.results || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar favoritos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadFavorites();
    else setLoading(false);
  }, [isAuthenticated]);

  const handleUnfavorite = async (
    e: React.MouseEvent,
    wordToRemove: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => prev.filter((w) => w.word !== wordToRemove));
    try {
      await unfavoriteWord(wordToRemove);
    } catch {
      loadFavorites();
    }
  };

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
          icon={Star}
          title="Acesse sua conta"
          description="Você precisa estar logado para ver seus favoritos."
        />
      </div>
    );
  }

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Minhas Palavras Favoritas</h1>
        <p className={styles.subtitle}>Sua coleção pessoal de vocabulário.</p>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>{error}</p>
          <Button variant="outline" onClick={loadFavorites}>
            Tentar Novamente
          </Button>
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Você ainda não tem palavras favoritas"
          description="Explore o dicionário e clique na estrela para salvar palavras aqui."
          actionLabel="Explorar Dicionário"
          actionHref="/dictionary"
        />
      ) : (
        <div className={styles.grid}>
          {favorites.map((item, idx) => (
            <FavoriteCard
              key={idx}
              word={item.word}
              onUnfavorite={handleUnfavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
