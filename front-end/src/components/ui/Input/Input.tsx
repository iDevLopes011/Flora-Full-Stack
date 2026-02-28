import React, { InputHTMLAttributes, forwardRef } from "react";
import styles from "./Input.module.css";
import { clsx } from "clsx";
import { Search } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: "search" | "none";
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, icon = "none", fullWidth = true, ...props },
    ref,
  ) => {
    return (
      <div className={clsx(styles.wrapper, { [styles.fullWidth]: fullWidth })}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputContainer}>
          {icon === "search" && <Search className={styles.icon} size={20} />}
          <input
            ref={ref}
            className={clsx(
              styles.input,
              { [styles.hasIcon]: icon !== "none" },
              { [styles.hasError]: !!error },
              className,
            )}
            {...props}
          />
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
