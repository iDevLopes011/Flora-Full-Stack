import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import styles from "./AuthGate.module.css";
import { LucideIcon } from "lucide-react";

interface AuthGateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  loginLabel?: string;
}

export function AuthGate({
  icon: Icon,
  title,
  description,
  loginLabel = "Fazer Login",
}: AuthGateProps) {
  return (
    <div className={styles.wrapper}>
      <Icon size={48} className={styles.icon} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <Link href="/signin">
        <Button>{loginLabel}</Button>
      </Link>
    </div>
  );
}
