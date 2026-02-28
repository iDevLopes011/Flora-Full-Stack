import React from "react";
import styles from "./WordDetails.module.css";

interface Definition {
  definition: string;
  example?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface WordDetailsProps {
  word: string;
  phonetic?: string | null;
  meanings: Meaning[];
}

export function WordDetails({ word, phonetic, meanings }: WordDetailsProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.word}>{word}</h1>
        {phonetic && <span className={styles.phonetic}>{phonetic}</span>}
      </div>

      {meanings && meanings.length > 0 ? (
        <div className={styles.meaningsList}>
          {meanings.map((meaning, index) => (
            <div key={index} className={styles.meaningGroup}>
              <h3 className={styles.partOfSpeech}>{meaning.partOfSpeech}</h3>
              <ul className={styles.definitionsList}>
                {meaning.definitions?.map((def, idx) => (
                  <li key={idx} className={styles.definitionItem}>
                    <p className={styles.definitionText}>{def.definition}</p>
                    {def.example && (
                      <p className={styles.exampleText}>"{def.example}"</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noDetails}>
          Nenhum detalhe adicional encontrado para esta palavra no dicionário
          externo.
        </p>
      )}
    </div>
  );
}
