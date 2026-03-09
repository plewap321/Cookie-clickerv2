"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthGuard({ adminOnly = false, children }: { adminOnly?: boolean; children?: React.ReactNode } = {}) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    window.location.href = '/login';
                    return;
                }

                if (adminOnly) {
                    // Récupérer is_admin
                    const { data } = await supabase
                        .from("profiles")
                        .select("is_admin")
                        .eq("id", user.id)
                        .single();

                    if (data?.is_admin) {
                        setAuthorized(true);
                    } else {
                        window.location.href = '/'; // Redirige vers l'accueil
                        return;
                    }
                } else {
                    setAuthorized(true);
                }
            } catch (error) {
                console.error("Erreur lors de la vérification:", error);
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [adminOnly]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="text-orange-500 text-xl">Vérification en cours...</div>
            </div>
        );
    }

    if (!authorized) {
        return null; // Ne devrait pas arriver car on redirige, mais sécurité
    }

    return <>{children}</>;
}