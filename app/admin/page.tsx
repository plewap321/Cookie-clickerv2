"use client";
import AuthGuard from "@/components/AuthGuard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Profile {
    id: string;
    username?: string;
    is_admin?: boolean;
    created_at?: string;
    [key: string]: any;
}

export default function AdminPage(){
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [tableOpen, setTableOpen] = useState(false);
    const [configOpen, setConfigOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*');

            if (error) {
                console.error('Erreur:', error);
            } else {
                setProfiles(data || []);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleDelete = async (userId: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            // Ici tu pourras ajouter la logique de suppression
            console.log('Supprimer utilisateur:', userId);
        }
    };

    const handleEdit = (userId: string) => {
        // Ici tu pourras ajouter la logique d'édition
        console.log('Modifier utilisateur:', userId);
    };

    if (loading) {
        return (
            <AuthGuard adminOnly={true}>
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                    <div className="text-orange-500 text-xl">Chargement...</div>
                </div>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard adminOnly={true}>
            <div className="min-h-screen bg-black text-white p-6">
                <h1 className="text-5xl font-bold text-orange-500 mb-8 text-center">PANEL ADMINISTRATEUR</h1>

                {/* Compteur d'utilisateurs */}
                <div className="bg-gray-900 rounded-xl p-6 mb-8 text-center">
                    <div className="text-6xl font-black text-orange-500 mb-2">{profiles.length}</div>
                    <div className="text-xl text-gray-300">Utilisateurs inscrits</div>
                </div>

                {/* Bouton pour ouvrir/fermer la table */}
                <div className="mb-6">
                    <button
                        onClick={() => setTableOpen(!tableOpen)}
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        <span>{tableOpen ? 'Masquer' : 'Afficher'} la liste des utilisateurs</span>
                        <span className={`transform transition-transform duration-540 ${tableOpen ? 'rotate-180' : ''}`}>
                            ▼
                        </span>
                    </button>
                </div>

                {/* Table avec animation */}
                <div className={`overflow-hidden transition-all duration-540 ease-in-out ${
                    tableOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="bg-gray-900 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-orange-500 mb-6">Liste des utilisateurs</h2>

                        {profiles.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Aucun utilisateur trouvé</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-3 px-4 text-orange-500 font-bold">Nom d'utilisateur</th>
                                            <th className="text-left py-3 px-4 text-orange-500 font-bold">Status</th>
                                            <th className="text-left py-3 px-4 text-orange-500 font-bold">Date d'inscription</th>
                                            <th className="text-center py-3 px-4 text-orange-500 font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {profiles.map((profile) => (
                                            <tr key={profile.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                                                            {(profile.email || 'E')[0].toUpperCase()}
                                                        </div>
                                                        <span className="font-medium">{profile.email || 'Sans nom'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {profile.is_admin ? (
                                                        <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full font-bold">
                                                            ADMIN
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                                                            JOUEUR
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-gray-300">
                                                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleEdit(profile.id)}
                                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition-colors"
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(profile.id)}
                                                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg font-medium transition-colors"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Section Configuration avec animation */}
                <div className="mb-6">
                    <button
                        onClick={() => setConfigOpen(!configOpen)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        <span>{configOpen ? 'Masquer' : 'Afficher'} la configuration</span>
                        <span className={`transform transition-transform duration-300 ${configOpen ? 'rotate-180' : ''}`}>
                            ▼
                        </span>
                    </button>
                </div>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    configOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="bg-gray-900 rounded-xl p-6 mb-8">
                        <h2 className="text-2xl font-bold text-blue-500 mb-6 flex items-center gap-3 justify-center">
                            ⚙️ Configuration du Serveur
                        </h2>
                        
                    
                    </div>
                </div>
                {/* Footer */}
                <div className="mt-12 text-center text-gray-500">
                    <p>🔒 Panel d'administration • Cookie Clicker</p>
                </div>
            </div>
        </AuthGuard>
    );
}