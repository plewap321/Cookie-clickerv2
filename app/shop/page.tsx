"use client";
import AuthGuard from "@/components/AuthGuard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ShopPage() {
  const [loading, setLoading] = useState(true);
  const [cookies, setCookies] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  
    useEffect(() => {
      const loadData = async () => {
        setLoading(true);
        
        // 1. On cherche l'utilisateur
        const { data: { user } } = await supabase.auth.getUser();
  
        // 3. Si on arrive ici, il est bien connecté
        if (user) {
         
    
          
          const { data, error } = await supabase
          .from("profiles")
          .select("cookies , is_admin")
          .eq("id", user.id)
          .maybeSingle();
    
          if (error) {
            console.error("Erreur de chargement :", error.message);
          } else if (data) {
          setCookies(data.cookies || 0);
          setIsAdmin(data.is_admin || false);
        }
        }
        
    
        setLoading(false);
      };
  
  
      loadData();
    }, []);

if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-white">
        <p className="animate-pulse text-orange-500 font-bold text-xl">CHARGEMENT DU FOUR...</p>
      </div>
    );
  }
  return (
    
    <main className="p-10 min-h-screen bg-neutral-900 text-white flex flex-col items-center">
      <AuthGuard />
      
    <div className="w-full flex flex-col items-center">
      <h1 className="text-5xl font-black text-orange-500 mb-4 italic uppercase tracking-tighter">
        Amazon 🛒
      </h1>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-[25px] text-neutral-400 text-left pl-3">
            {cookies} 🍪
        </h1>
      </div>
    </div>
      {/* Grille des articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        
        {/* Article 1 */}
        <div className="bg-neutral-800 border-2 border-neutral-700 p-6 rounded-3xl hover:border-orange-500 transition-all group relative overflow-hidden flex flex-col justify-between h-48">
          <div className="absolute -right-4 -top-4 text-6xl opacity-20 group-hover:scale-125 transition-transform">🤖</div>
          
          <div>
            <h3 className="text-2xl font-black uppercase italic">Esclave</h3>
            <p className="text-neutral-400 text-sm">Clique 1 fois par seconde </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-orange-500 font-bold text-xl">300 🍪</span>
            <button className="bg-white text-black px-6 py-2 rounded-full font-black hover:bg-orange-500 hover:text-white shadow-lg transition-all active:scale-95 text-sm">
              ACHETER
            </button>
          </div>
        </div>
         {/* Article 2 */}
        <div className="bg-neutral-800 border-2 border-neutral-700 p-6 rounded-3xl hover:border-orange-500 transition-all group relative overflow-hidden flex flex-col justify-between h-48">
          <div className="absolute -right-4 -top-4 text-6xl opacity-20 group-hover:scale-125 transition-transform">💂🏻‍♀️</div>
          
          <div>
            <h3 className="text-2xl font-black uppercase italic">Chef </h3>
            <p className="text-neutral-400 text-sm">Clique 1 fois par seconde </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-orange-500 font-bold text-xl">1000 🍪</span>
            <button className="bg-white text-black px-6 py-2 rounded-full font-black hover:bg-orange-500 hover:text-white shadow-lg transition-all active:scale-95 text-sm">
              ACHETER
            </button>
          </div>
        </div>
        {/* autre upgrade */}

      </div>

      {/*  */}
      <div className="mt-auto pt-20">
        <button 
          onClick={() => {
          if (confirm("Êtes-vous sûr de vouloir quitter la session ?")) {
            supabase.auth.signOut().then(() => window.location.href = "/login");
          }
        }}
          className="text-xs text-neutral-600 hover:text-orange-500 transition-colors uppercase tracking-widest font-bold"
        >
          Quitter la session
        </button>
      </div>
      
      <a href="/" className="mt-4 text-sm text-neutral-500 hover:underline">
        Retour au four
      </a>
    </main>
  );
}