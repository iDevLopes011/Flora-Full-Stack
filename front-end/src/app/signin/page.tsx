"use client";

import React, { useState, Suspense } from "react";
import { Input } from "@/components/ui/Input/Input";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/features/auth/AuthForm/AuthForm";

function SignInForm() {
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      await checkAuth();
      const redirect = searchParams.get("redirect") || "/";
      window.location.href = redirect;
    } catch {
      setError(
        "E-mail ou senha inválidos. Verifique suas credenciais e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Bem-vindo de volta"
      subtitle="Faça login para acessar suas palavras favoritas"
      submitLabel="Entrar"
      loadingLabel="Entrando..."
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      footerText="Ainda não tem conta?"
      footerLinkLabel="Cadastre-se"
      footerLinkHref="/signup"
    >
      <Input
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
      />
      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={loading}
      />
    </AuthForm>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
