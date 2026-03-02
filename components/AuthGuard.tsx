"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
// a faire :" import {AuthGuard} from "@/components/AuthGuard.tsx"; "
export default  function AuthGuard() {
    
    useEffect(() => {
        const checkUser = async() => {
            const { data:{user}} = await supabase.auth.getUser();
            if(!user){
                window.location.href='/login';
                return;
            }
            console.log("Utilisateur connecté :", user.email, "pseudonyme:", user.user_metadata?.username , "id:", user.id);
        };
        checkUser();
    },[]);
    
    return null; // juste verif user , fait rien.
}