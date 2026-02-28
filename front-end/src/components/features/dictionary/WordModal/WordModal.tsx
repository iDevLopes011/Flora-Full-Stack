import React from "react";
import { ExternalLink, X } from "lucide-react";
import { WordDetailsResponse } from "@/services/api";
import styles from "./WordModal.module.css";

interface WordModalProps {
  word: string;
  details: WordDetailsResponse | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export function WordModal({
  word,
  details,
  loading,
  error,
  onClose,
}: WordModalProps) {
  const firstMeaning = details?.meanings?.[0];
  const firstDef = firstMeaning?.definitions?.[0];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        {}
        <div className={styles.header}>
          <h2 className={styles.title}>{word}</h2>
          {details?.phonetic && (
            <span className={styles.phonetic}>{details.phonetic}</span>
          )}
        </div>

        <div className={styles.body}>
          {loading ? (
            <div className={styles.loadingRow}>
              <div className={styles.spinner} />
              <span>Carregando...</span>
            </div>
          ) : error ? (
            <p className={styles.errorText}>{error}</p>
          ) : firstDef ? (
            <>
              {}
              {firstMeaning?.partOfSpeech && (
                <span className={styles.partOfSpeech}>
                  {firstMeaning.partOfSpeech}
                </span>
              )}

              {}
              <p className={styles.definition}>{firstDef.definition}</p>

              {}
              {firstDef.example && (
                <p className={styles.example}>"{firstDef.example}"</p>
              )}
            </>
          ) : details ? (
            <p className={styles.noDetails}>
              Nenhuma definição disponível no momento.
            </p>
          ) : null}
        </div>

        <div className={styles.footer}>
          <a href={`/word/${word}`} className={styles.fullPageLink}>
            Ver todas as definições <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
