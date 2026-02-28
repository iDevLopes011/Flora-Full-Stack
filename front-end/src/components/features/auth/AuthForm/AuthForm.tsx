import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import styles from "./AuthForm.module.css";

interface AuthFormProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  loadingLabel: string;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
  children: React.ReactNode;
}

export function AuthForm({
  title,
  subtitle,
  submitLabel,
  loadingLabel,
  loading,
  error,
  onSubmit,
  footerText,
  footerLinkLabel,
  footerLinkHref,
  children,
}: AuthFormProps) {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent>
            {error && <div className={styles.errorAlert}>{error}</div>}
            {children}
          </CardContent>

          <CardFooter className={styles.footer}>
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? loadingLabel : submitLabel}
            </Button>
            <p className={styles.footerText}>
              {footerText}{" "}
              <Link href={footerLinkHref} className={styles.footerLink}>
                {footerLinkLabel}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
