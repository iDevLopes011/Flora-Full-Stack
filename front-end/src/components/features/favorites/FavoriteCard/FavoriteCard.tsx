import React from "react";
import Link from "next/link";
import { StarOff } from "lucide-react";
import styles from "./FavoriteCard.module.css";

interface FavoriteCardProps {
  word: string;
  onUnfavorite: (e: React.MouseEvent, word: string) => void;
}

export function FavoriteCard({ word, onUnfavorite }: FavoriteCardProps) {
  return (
    <Link href={`/word/${word}`} className={styles.link}>
      <div className={styles.card}>
        <span className={styles.word}>{word}</span>
        <button
          className={styles.removeBtn}
          onClick={(e) => onUnfavorite(e, word)}
          aria-label={`Desfavoritar ${word}`}
          title="Remover dos favoritos"
        >
          <StarOff size={18} />
        </button>
      </div>
    </Link>
  );
}
