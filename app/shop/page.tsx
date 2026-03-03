"use client";
import AuthGuard from "@/components/AuthGuard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ShopPage() {
  const [loading, setLoading] = useState(true);
  const [cookies, setCookies] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [upgradesState, setUpgradesState] = useState<Record<string, number>>({});

  // ITEMS simple (tu voulais garder cost, cps, number)
  const ITEMS = [
    { id: "esclave", name: "Esclave", cost: 300, cps: 1, number: 0 },
    { id: "chef", name: "Chef", cost: 1000, cps: 5, number: 0 },
  ];

  // prix: base * 1.15^owned (arrondi)
  const getCost = (base: number, owned: number) =>
    Math.floor(base * Math.pow(1.15, owned));

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("cookies, upgrades")
          .eq("id", user.id)
          .maybeSingle();

        setCookies(Number(data?.cookies || 0));

        // normalise upgrades JSON -> { id: number }
        const ups = data?.upgrades || {};
        const normalized: Record<string, number> = {};
        Object.entries(ups).forEach(([k, v]) => {
          normalized[k] = typeof v === "number" ? v : Number((v as any).owned || 0);
        });
        setUpgradesState(normalized);
      }
 
      setLoading(false);
    };

    load();
  }, []);

  // achat simple : on écrit en DB puis on relit l'état
  const buyItem = async (item: { id: string; cost: number }) => {
    if (!user) {
      alert("Vous devez être connecté.");
      return;
    }

    const owned = upgradesState[item.id] || 0;
    const cost = getCost(item.cost, owned);
    if (cookies < cost) {
      alert("Pas assez de cookies.");
      return;
    }

    setLoading(true);

    const newCookies = cookies - cost;
    const newUpgrades = { ...upgradesState, [item.id]: owned + 1 };

    // on enregistre upgrades comme map id -> number (JSONB)
    const { error } = await supabase
      .from("profiles")
      .update({ cookies: newCookies, upgrades: newUpgrades })
      .eq("id", user.id);

    if (error) {
      console.error("Erreur serveur:", error.message);
      alert("Erreur serveur, réessaye.");
      setLoading(false);
      return;
    }

    // relire profil pour être sûr (simple et fiable)
    const { data } = await supabase
      .from("profiles")
      .select("cookies, upgrades")
      .eq("id", user.id)
      .maybeSingle();

    setCookies(Number(data?.cookies || 0));
    const ups = data?.upgrades || {};
    const normalized: Record<string, number> = {};
    Object.entries(ups).forEach(([k, v]) => {
      normalized[k] = typeof v === "number" ? v : Number((v as any).owned || 0);
    });
    setUpgradesState(normalized);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-white">
        <p className="animate-pulse text-orange-500 font-bold text-xl">CHARGEMENT...</p>
      </div>
    );
  }

  return (
    <main className="p-10 min-h-screen bg-neutral-900 text-white flex flex-col items-center">
      <AuthGuard />

      <div className="w-full flex flex-col items-center mb-6">
        <h1 className="text-5xl font-black text-orange-500 mb-4">AMZON 🛒</h1>
        <div className="text-2xl text-neutral-400">{cookies} 🍪</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {ITEMS.map((it) => {
          const owned = upgradesState[it.id] || 0;
          const cost = getCost(it.cost, owned);
          return (
            <div key={it.id} className="bg-neutral-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold">{it.name}</h3>
              <p className="text-sm text-neutral-400">+{it.cps} cps</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-orange-500 font-bold">{cost} 🍪</div>
                  <div className="text-sm text-neutral-400">Possédés: {owned}</div>
                </div>
                <button
                  onClick={() => buyItem(it)}
                  disabled={cookies < cost}
                  className="bg-white text-black px-4 py-2 rounded-full font-bold disabled:opacity-50"
                >
                  ACHETER
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}