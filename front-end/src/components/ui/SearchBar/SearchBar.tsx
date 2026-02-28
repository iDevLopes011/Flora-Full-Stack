"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { BookOpen } from "lucide-react";
import { fetchWithAuth } from "@/services/fetchWithAuth";
import styles from "./SearchBar.module.css";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Busca sugestões com debounce de 250ms
  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const url = new URL(`${API_BASE_URL}/entries/en`);
        url.searchParams.append("search", trimmed);
        url.searchParams.append("limit", "8");
        url.searchParams.append("page", "1");

        const res = await fetchWithAuth(url.toString(), { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const raw: string[] = data.results || [];
          const q = trimmed.toLowerCase();

          const exact = raw.filter((w) => w.toLowerCase() === q);
          const starts = raw.filter(
            (w) => w.toLowerCase().startsWith(q) && w.toLowerCase() !== q,
          );
          const contains = raw.filter((w) => !w.toLowerCase().startsWith(q));

          const sorted = [...exact, ...starts, ...contains].slice(0, 8);
          setSuggestions(sorted);
          setShowSuggestions(sorted.length > 0);
          setActiveIndex(-1);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = (word: string) => {
    setShowSuggestions(false);
    setActiveIndex(-1);
    router.push(`/word/${encodeURIComponent(word.trim())}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = activeIndex >= 0 ? suggestions[activeIndex] : query.trim();
    if (word) navigate(word);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {}
      <div className={styles.inputWrapper} ref={wrapperRef}>
        <Input
          type="text"
          placeholder="Buscar palavra em inglês..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          icon="search"
          className={styles.input}
          autoComplete="off"
        />

        {showSuggestions && (
          <div className={styles.dropdown}>
            {loading ? (
              <div className={styles.loadingRow}>
                <div className={styles.spinner} />
                <span>Buscando...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <ul className={styles.list} role="listbox">
                {suggestions.map((word, idx) => {
                  const q = query.trim().toLowerCase();
                  const wl = word.toLowerCase();
                  const isExact = wl === q;
                  const isStart = !isExact && wl.startsWith(q);
                  const matchIdx = wl.indexOf(q);

                  return (
                    <li
                      key={word}
                      role="option"
                      aria-selected={idx === activeIndex}
                      className={`${styles.item} ${idx === activeIndex ? styles.itemActive : ""}`}
                      onMouseDown={() => navigate(word)}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <span className={styles.itemIcon}>
                        <BookOpen size={13} />
                      </span>
                      <span className={styles.itemWord}>
                        {matchIdx === -1 ? (
                          word
                        ) : (
                          <>
                            {word.slice(0, matchIdx)}
                            <mark className={styles.itemMark}>
                              {word.slice(matchIdx, matchIdx + q.length)}
                            </mark>
                            {word.slice(matchIdx + q.length)}
                          </>
                        )}
                      </span>
                      {isExact && (
                        <span
                          className={`${styles.badge} ${styles.badgeExact}`}
                        >
                          exato
                        </span>
                      )}
                      {isStart && (
                        <span
                          className={`${styles.badge} ${styles.badgeStart}`}
                        >
                          começa com
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className={styles.empty}>Nenhuma sugestão encontrada</div>
            )}
          </div>
        )}
      </div>

      <Button type="submit" size="lg" className={styles.button}>
        Buscar
      </Button>
    </form>
  );
}
