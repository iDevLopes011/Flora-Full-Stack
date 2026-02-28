"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input/Input";
import { useRouter } from "next/navigation";
import { signUp } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/features/auth/AuthForm/AuthForm";

export default function SignUpPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signUp(name, email, password);
      await checkAuth();
      router.push("/");
    } catch {
      // Mensagem genérica — não revelamos se o e-mail já está cadastrado
      setError(
        "Não foi possível criar a conta. Verifique os dados e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Crie sua conta"
      subtitle="Junte-se à Flora e expanda seu vocabulário"
      submitLabel="Cadastrar-se"
      loadingLabel="Cadastrando..."
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      footerText="Já tem uma conta?"
      footerLinkLabel="Faça login"
      footerLinkHref="/signin"
    >
      <Input
        label="Nome"
        type="text"
        placeholder="Seu nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={loading}
      />
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
