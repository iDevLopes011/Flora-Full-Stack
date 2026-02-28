"use client";

import React from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { LogOut, Book, Star, User, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.navbarContainer}`}>
        <Link href="/" className={styles.logoLink}>
          <img
            src="/Flora_Logo_Preferencial_Negativo_RGB.svg"
            alt="Flora Logo"
            className={styles.logo}
          />
        </Link>

        <nav className={styles.navLinks}>
          <Link href="/dictionary" className={styles.navLink}>
            <Book size={18} />
            <span>Dicionário</span>
          </Link>
          <Link href="/favorites" className={styles.navLink}>
            <Star size={18} />
            <span>Favoritos</span>
          </Link>
          {isAuthenticated && (
            <Link href="/history" className={styles.navLink}>
              <Clock size={18} />
              <span>Histórico</span>
            </Link>
          )}

          <div className={styles.authMenu}>
            {isAuthenticated ? (
              <>
                <div className={styles.userInfo}>
                  <User size={18} />
                  <span className={styles.userName}>
                    {user?.name || "User"}
                  </span>
                </div>
                <button
                  className={styles.logoutBtn}
                  onClick={logout}
                  aria-label="Logout"
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" size="sm" className={styles.authBtn}>
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="secondary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
