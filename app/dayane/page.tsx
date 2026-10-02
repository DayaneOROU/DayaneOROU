// app/dayane/page.tsx
"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser"; // ← ici

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabase(); // ← instancié ici, pas en dehors

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    window.location.href = "/dayane/dashboard";
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Entrez votre email d'abord");
      return;
    }

    const supabase = createBrowserSupabase();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://dayaneorou.vercel.app/dayane/reset-password",
    });

    if (error) {
      setError("Erreur lors de l'envoi");
      return;
    }

    setError(null);
    alert("Email de reset envoyé — vérifiez votre boîte mail");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-800 bg-zinc-900">
        <h1 className="text-2xl font-bold text-white mb-1">Administration</h1>
        <p className="text-zinc-500 text-sm mb-8">Accès réservé</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-400 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              placeholder="votre@email.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-zinc-400 text-sm">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-white text-black font-semibold rounded-lg py-2.5 hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          {/* <button
            type="button"
            onClick={handleForgotPassword}
            className="text-zinc-500 text-xs text-right hover:text-zinc-300 transition"
          >
            Mot de passe oublié ?
          </button> */}
        </form>
      </div>
    </div>
  );
}
