"use client";

import React, { useState, useEffect } from "react";
import styles from "./word.module.css";
import { Card, CardContent } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  fetchWordDetails,
  WordDetailsResponse,
  favoriteWord,
  unfavoriteWord,
  fetchFavorites,
} from "@/services/api";
import { WordDetails } from "@/components/features/word/WordDetails/WordDetails";
import { FavoriteButton } from "@/components/features/word/FavoriteButton/FavoriteButton";

export default function WordDetailsPage({
  params,
}: {
  params: Promise<{ word: string }>;
}) {
  const paramData = React.use(params);
  const wordParam = decodeURIComponent(paramData.word);

  const [data, setData] = useState<WordDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadWord = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWordDetails(wordParam);
        setData(response);
        try {
          const favs = await fetchFavorites({ limit: 100 });
          if (
            favs.results?.some((f: any) => f.word === wordParam.toLowerCase())
          ) {
            setIsFavorite(true);
          }
        } catch {}
      } catch (err: any) {
        setError(err.message || "Erro ao carregar detalhes.");
      } finally {
        setLoading(false);
      }
    };
    loadWord();
  }, [wordParam]);

  const toggleFavorite = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      if (isFavorite) {
        await unfavoriteWord(wordParam);
        setIsFavorite(false);
      } else {
        await favoriteWord(wordParam);
        setIsFavorite(true);
      }
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`container ${styles.container}`}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Carregando {wordParam}...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`container ${styles.container}`}>
        <div className={styles.errorContainer}>
          <h2>Oops!</h2>
          <p>{error || "Não foi possível carregar esta palavra."}</p>
          <Link href="/dictionary">
            <Button className={styles.backButton}>Voltar ao Dicionário</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.container}`}>
      <Link href="/" className={styles.backLink}>
        <ArrowLeft size={20} />
        Voltar para a home
      </Link>

      <Card className={styles.mainCard}>
        <CardContent className={styles.cardContent}>
          <div className={styles.cardTop}>
            <FavoriteButton
              isFavorite={isFavorite}
              loading={actionLoading}
              onToggle={toggleFavorite}
            />
          </div>

          <WordDetails
            word={data.word}
            phonetic={data.phonetic}
            meanings={data.meanings}
          />
        </CardContent>
      </Card>

      <div className={styles.navigationFooter}>
        <Link href="/dictionary">
          <Button variant="outline">
            Explorar mais palavras no dicionário
          </Button>
        </Link>
      </div>
    </div>
  );
}
