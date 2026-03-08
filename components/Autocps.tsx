"use client";   
import { supabase } from "@/lib/supabaseClient";

const ITEMS = [
  { id: "esclave",cps: 1},
  { id: "chef", cps: 5},
];

export async function getUserCPS(userId: string){
// recup debuit db 
const { data, error } = await supabase
    .from("profiles")
    .select("upgrades")
    .eq("id", userId)
    .maybeSingle();

    if(error||  !data) {
        console.error("Erreur lors de la récupération de la db :", error);
        return 0;
    }
    const upgrades = data.upgrades || {};
    let totalCPS = 0;

    ITEMS.forEach(item => {
        const owned = upgrades[item.id] || 0;
        totalCPS += owned * item.cps;
    })
    return totalCPS;
}
// si je veux recup nombre d'upgrades : 

// export async function getUserUpgrades(userId: string) {
//   const { data } = await supabase
//     .from("profiles")
//     .select("upgrades")
//     .eq("id", userId)
//     .maybeSingle();

//   return data?.upgrades || {};
// }