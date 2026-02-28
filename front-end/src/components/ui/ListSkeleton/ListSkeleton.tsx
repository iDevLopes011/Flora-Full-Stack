import React from "react";
import styles from "./ListSkeleton.module.css";

interface ListSkeletonProps {
  rows?: number;
}

export function ListSkeleton({ rows = 5 }: ListSkeletonProps) {
  return (
    <div className={styles.list}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.circle} />
          <div className={styles.body}>
            <div
              className={styles.line}
              style={{ width: `${50 + (i % 4) * 12}%` }}
            />
            <div className={`${styles.line} ${styles.lineShort}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
