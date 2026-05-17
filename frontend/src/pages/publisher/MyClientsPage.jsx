import { useState, useEffect } from "react";
import { MapPinHouse, CheckCircle, Clock, MapPin, Search, Users } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import StatCard from "../../components/layout/StatsCard";
import TabBar from "../../components/layout/TabBar";
import Loader from "../../components/ui/loader";
import "../../styles/profile/profile.css";
import "../../styles/publisher/myClients.css";

// ── Constants ─────────────────────────────────────────────────
const API = "http://localhost:5000/api";

const TABS = [
    { label: "Mes Annonces", path: "/my-apartments" },
    { label: "Les Demandes", path: "/demandes" },
    { label: "Mes Clients",  path: "/my-clients" },
    { label: "Mon Profile",  path: "/publisher-profile" },
];

const ITEMS_PER_PAGE = 7;

const getAuthHeaders = async (extra = {}) => {
    const raw = localStorage.getItem("immodiva_token");
    let token = null;

    if (raw) {
        try {
            // Étape 1 : On tente de le parser au cas où c'est un objet JSON complet stocké
            const parsed = JSON.parse(raw);
            token = parsed?.access_token || raw; 
        } catch (e) {
            // Étape 2 : Si JSON.parse plante (erreur 'e'), c'est que c'est déjà le JWT string brut !
            token = raw;
        }
    }

    return { Authorization: `Bearer ${token}`, ...extra };
};

// ── Placeholder Tab ───────────────────────────────────────────
function PlaceholderTab({ name }) {
    return (
        <div className="placeholder">
            <p>Contenu de « {name} » à venir.</p>
        </div>
    );
}

// ── Clients Table ─────────────────────────────────────────────
function ClientsTab({ onClientsCount }) {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    const fetchClients = async (currentPage = 1) => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `${API}/appartements/clients/my?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
                { headers: await getAuthHeaders() }
            );
            const data = await res.json();
            if (res.ok) {
                const clientList = data.clients || [];
                setClients(clientList);
                setTotalPages(data.totalPages || 1);
                onClientsCount?.(data.total || clientList.length);
            }
        } catch (err) {
            console.error("Erreur chargement clients", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClients(page);
    }, [page]);

    // Client-side filtering
    const filtered = clients.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.apartment?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="apartments-tab"> {/* Re-using class for consistent padding */}
            {isLoading && <Loader />}

            {/* ── Search Bar ── */}
            <div className="table-controls">
                <div className="search-box">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher un client ou un appartement..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-wrapper">
                <table className="apartments-table"> {/* Re-using table styles */}
                    <thead>
                        <tr>
                            <th>CLIENT</th>
                            <th>APPARTEMENT CONCERNÉ</th>
                            <th>PROFIL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((client) => (
                            <tr key={client.id} className="table-row">
                                {/* Client Column with Avatar-style Initials */}
                                <td className="col-title">
                                    <div className="apt-thumb-wrap">
                                        <div className="avatar-initials" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                                            {client.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="apt-title">{client.name}</p>
                                            <p className="apt-address">{client.phone_number || "Client vérifié"}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Apartment Details */}
                                <td className="col-details">
                                    <div>
                                        <p className="apt-title" style={{ fontSize: '0.9rem' }}>{client.apartment}</p>
                                        <p className="apt-address"><MapPin size={12} /> {client.address}</p>
                                    </div>
                                </td>

                                {/* Profile/Role */}
                                <td className="col-status">
                                    <span className="detail-chip">
                                        <Users size={14} />
                                        {client.profil || "Locataire"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!isLoading && filtered.length === 0 && (
                    <p className="empty-text">Aucun client trouvé.</p>
                )}
            </div>

            {/* ── Pagination ── */}
            <div className="pagination">
                <button className="btnPage" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    Précédent
                </button>
                <button className="btnPage btnPage--current" disabled>Page {page}</button>
                <button className="btnPage" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                    Suivant
                </button>
            </div>
        </div>
    );
}

// ── Page Shell ────────────────────────────────────────────────
export default function MyClientsPage() {
    const [activeTab, setActiveTab] = useState("Mes Clients");
    const [user, setUser] = useState({ prenom: "", nom: "" });
    const [clientCount, setClientCount] = useState(0);
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API}/auth/me`, { headers: await getAuthHeaders() });
                const data = await res.json();
                // console.log(data);
                if (res.ok) {
                    setUser({ prenom: data.user.first_name, nom: data.user.last_name });
                }
            } catch (err) {
                console.error("Erreur chargement utilisateur", err);
            }
        };
        fetchUser();
    }, []);

    const STATS = [
        { label: "Mes Annonces", value: stats.total,    color: "#0F2744", subtitle: "Total des annonces",     icon: MapPinHouse },
        { label: "Approuvée",    value: stats.approved, color: "#1E9E6B", subtitle: "Annonces en ligne",      icon: CheckCircle },
        { label: "En Attente",   value: stats.pending,  color: "#E87722", subtitle: "En cours de validation", icon: Clock       },
    ];

    const renderTab = () => {
        switch (activeTab) {
            case "Mes Clients":
                return <ClientsTab onClientsCount={setClientCount} />;
            default:
                return <PlaceholderTab name={activeTab} />;
        }
    };

    const initials = `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase();

    return (
        <div className="page">
            <Navbar />
            <main className="main">
                <div className="pageHeader">
                    <div className="pageHeader__user">
                        <div className="avatar-initials">{initials}</div>
                        <div>
                            <h1 className="pageTitle">Mon Espace</h1>
                            <p className="pageSubtitle">
                                Bienvenue, {user.prenom} {user.nom}
                            </p>
                        </div>
                    </div>
{/* 
                    <div className="statsRow">
                        {STATS.map((s) => (
                            <StatCard key={s.label} {...s} />
                        ))}
                    </div> */}
                </div>

                <TabBar 
                    tabs={TABS} 
                    active={activeTab} 
                    onChange={setActiveTab} 
                />

                <div className="tabContent">{renderTab()}</div>
            </main>
        </div>
    );
}