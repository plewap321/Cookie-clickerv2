"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation"; // Pour rediriger après connexion

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Switch entre Login et Inscription
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      // --- CAS INSCRIPTION ---
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) alert(error.message);
      else alert("Vous pouvez maintenant aller confirmé votre email et vous connecter ! ");
    } else {
      // --- CAS CONNEXION ---
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
      else router.push("/"); // On envoie le joueur vers le jeu !
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <form onSubmit={handleAuth} className="bg-gray-900 p-8 rounded-2xl shadow-2xl flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-3xl font-black text-center text-orange-500">
          {isSignUp ? "REJOINDRE L'AVENTURE" : "RETOUR AU JEU"}
        </h1>

        {isSignUp && (
          <input 
            type="text" 
            placeholder="Ton pseudo" 
            className="p-3 rounded bg-gray-800 border border-gray-700 outline-none focus:border-orange-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <input 
          type="email" 
          placeholder="Email" 
          className="p-3 rounded bg-gray-800 border border-gray-700 outline-none focus:border-orange-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input 
          type="password" 
          placeholder="Mot de passe" 
          className="p-3 rounded bg-gray-800 border border-gray-700 outline-none focus:border-orange-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="bg-orange-600 hover:bg-orange-500 font-bold py-3 rounded-lg transition-all active:scale-95">
          {isSignUp ? "CRÉER MON COMPTE" : "SE CONNECTER"}
        </button>

        <p 
          className="text-center text-sm text-gray-400 cursor-pointer hover:text-white underline mt-2"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Déjà un compte ? Connecte-toi" : "Pas de compte ? Inscris-toi"}
        </p>
      </form>
    </main>
  );
}