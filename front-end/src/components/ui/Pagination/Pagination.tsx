import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
}

export function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  disabled,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button
        className={styles.btn}
        onClick={onPrev}
        disabled={page === 1 || disabled}
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>

      <span className={styles.indicator}>
        <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>

      <button
        className={styles.btn}
        onClick={onNext}
        disabled={page === totalPages || disabled}
        aria-label="Próxima página"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
