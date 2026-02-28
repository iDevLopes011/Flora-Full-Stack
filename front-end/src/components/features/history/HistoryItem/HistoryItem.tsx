import React from "react";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { relativeTime } from "@/utils/relativeTime";
import styles from "./HistoryItem.module.css";

interface HistoryItemProps {
  word: string;
  added: string;
  index?: number;
  showIndex?: boolean;
}

export function HistoryItem({
  word,
  added,
  index,
  showIndex = false,
}: HistoryItemProps) {
  return (
    <Link href={`/word/${encodeURIComponent(word)}`} className={styles.item}>
      {showIndex && index !== undefined && (
        <span className={styles.index}>{index + 1}</span>
      )}

      <div className={styles.iconWrapper}>
        <Clock size={15} />
      </div>

      <div className={styles.body}>
        <span className={styles.word}>{word}</span>
        <span className={styles.date}>
          {new Date(added).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <span className={styles.relative}>{relativeTime(added)}</span>
      <ChevronRight size={16} className={styles.arrow} />
    </Link>
  );
}
