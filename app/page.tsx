// npm run dev
"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [cookies, setCookies] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const[isDataLoaded , setIsDataLoaded] = useState(false); 
  const cookiesRef = useRef(cookies);

  useEffect(() => {
    
    cookiesRef.current = cookies;
    
  }, [cookies]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // 1. On cherche l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();

      // 2. On vérifie TOUT DE SUITE s'il est là
      if (!user) {
        console.log("Pas d'utilisateur, redirection...");
        window.location.href = "/login";
        return; 
      }

      // 3. Si on arrive ici, il est bien connecté
      console.log("Utilisateur connecté :", user.email, "pseudonyme:", user.user_metadata?.username , "id:", user.id);

      
      const { data, error } = await supabase
      .from("profiles")
      .select("cookies, is_admin")
      .eq("id", user.id)
      .maybeSingle();

      if (error) {
        console.error("Erreur de chargement :", error.message);
      } else if (data) {
      setCookies(data.cookies || 0);
      setIsAdmin(data.is_admin || false);
    }
      
      setIsDataLoaded(true);
      setLoading(false);
    };


    loadData();
  }, []);
  useEffect(() => {
      // sauvgarde avant de quitter la page 
    return () => {
      saveToCloud(cookiesRef.current); 
    };
  }, []);

    const saveToCloud = async (newScore: number) => {
      // SI LES DONNÉES NE SONT PAS CHARGÉES, ON ARRÊTE TOUT
      if (!isDataLoaded) return; 
    
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ cookies: newScore })
          .eq("id", user.id);
      }
    };

  const clickCookie = () => {
    const newCount = cookies + 1;
    setCookies(newCount);
    
    // Sauvegarde à chaque 10 clics
    if (newCount % 10 === 0) {
      saveToCloud(newCount);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-white">
        <p className="animate-pulse text-orange-500 font-bold text-xl">CHARGEMENT DU FOUR...</p>
      </div>
    );
  }

  // go to shop and save before leaving 
  const goToshop = async () =>{
     console.log("Redirection vers la boutique...");
     setLoading(true);
   
    await saveToCloud(cookies);
    window.location.href="/shop";
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4 font-sans">
      
      <div className="text-center mb-12">
        <h1 className="text-7xl font-black text-orange-500 drop-shadow-2xl">
          {cookies}
        </h1>
        <p className="text-xl text-neutral-400 uppercase tracking-[0.3em] font-bold">Cookies</p>
      </div>

      <button 
        onClick={clickCookie}
        className="relative group transition-transform active:scale-90 hover:scale-105 outline-none"
      >
        <div className="absolute inset-0 bg-orange-600/30 blur-[60px] rounded-full group-hover:bg-orange-500/50 transition-all"></div>
        <span className="text-[160px] cursor-pointer select-none block drop-shadow-2xl">
          🍪
        </span>
      </button>

      <button onDoubleClick={goToshop} className="mt-16 w-full max-w-md hover:scale-105 transition-transform">
        <div className="bg-neutral-800 p-6 rounded-3xl border-2 border-neutral-700 hover:border-orange-500 transition-all text-center">
          <h2 className="text-2xl font-black italic">AMZON 🛒</h2>
        </div>
      </button>
      
      <button 
        onClick={() => {
          if (confirm("Êtes-vous sûr de vouloir quitter la session ?")) {
            supabase.auth.signOut().then(() => window.location.href = "/login");
          }
        }}
        className="mt-10 text-xs text-neutral-600 hover:text-orange-500 transition-colors uppercase tracking-widest font-bold"
      >
        Quitter la session
      </button>
    </main>
  );
};