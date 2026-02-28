import React from "react";
import { Star, StarOff } from "lucide-react";
import styles from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
  isFavorite: boolean;
  loading?: boolean;
  onToggle: () => void;
}

export function FavoriteButton({
  isFavorite,
  loading,
  onToggle,
}: FavoriteButtonProps) {
  return (
    <button
      className={isFavorite ? styles.btnActive : styles.btn}
      onClick={onToggle}
      disabled={loading}
      aria-label={
        isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
      }
      title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      {isFavorite ? (
        <Star size={24} fill="currentColor" />
      ) : (
        <StarOff size={24} />
      )}
    </button>
  );
}
