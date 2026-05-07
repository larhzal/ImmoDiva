import { useState, useEffect } from "react";
import { MapPinHouse, CheckCircle, Clock, Users } from "lucide-react";
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
    { label: "Les Demandes", path: "#" },
    { label: "Mes Clients",  path: "/my-clients" },
    { label: "Mon Profile",  path: "/publisher-profile" },
];

const ITEMS_PER_PAGE = 7;

const authHeaders = (extra = {}) => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    ...extra,
});

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

    // Fallback mock data if API is empty
    const MOCK = [
        { id: 1, name: "Ayoub Sadouqy",    apartment: "Location appartement meublé moderne",     address: "Californie, Casablanca" },
        { id: 2, name: "Abdessalam Wahid", apartment: "Duplex meublé Mahaj Riad",                address: "Hay Riad, Rabat" },
        { id: 3, name: "Fatimzahra Niya",  apartment: "Location appartement de luxe",            address: "Guéliz, Marrakech" },
        { id: 4, name: "Sara Alaoui",      apartment: "Location magnifique appartement moderne", address: "Californie, Casablanca" },
        { id: 5, name: "Bilal Alami",      apartment: "Appartement à Meknes à louer pour 8 personnes", address: "Hamria, Meknès" },
        { id: 6, name: "Tarik Saadani",    apartment: "Location appartement moderne",            address: "El Bassatine, Meknès" },
        { id: 7, name: "Mohamed Kaabi",    apartment: "Location magnifique appartement de luxe", address: "Maarif, Casablanca" },
    ];

    const fetchClients = async (currentPage = 1) => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `${API}/clients/my?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
                { headers: authHeaders() }
            );
            const data = await res.json();
            if (res.ok) {
                const clientList = data.clients || [];
                setClients(clientList);
                setTotalPages(data.totalPages || 1);
                // Update parent with total count for the Tab Badge
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

    const displayData = clients.length > 0 ? clients : MOCK;

    return (
        <div className="clients-tab">
            {isLoading && <Loader />}

            <div className="table-wrapper">
                <table className="clients-table">
                    <thead>
                        <tr>
                            <th>CLIENT</th>
                            <th>APPARTEMENT</th>
                            <th>ADRESSE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map((client) => (
                            <tr key={client.id} className="table-row">
                                <td className="col-client">
                                    <span className="client-name">{client.name}</span>
                                </td>
                                <td className="col-apartment">{client.apartment}</td>
                                <td className="col-address">{client.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ── */}
            <div className="pagination">
                <button
                    className="btnPage"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Précédent
                </button>
                <button className="btnPage btnPage--current" disabled>
                    Page {page}
                </button>
                <button
                    className="btnPage"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
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
    
    // In a real scenario, you might want to fetch these stats from a global dashboard API
    const STATS = [
        { label: "Mes Annonces", value: stats.total,    color: "#0F2744", subtitle: "Total des annonces",     icon: MapPinHouse },
        { label: "Approuvée",    value: stats.approved, color: "#1E9E6B", subtitle: "Annonces en ligne",      icon: CheckCircle   },
        { label: "En Attente",   value: stats.pending,  color: "#E87722", subtitle: "En cours de validation", icon: Clock         },
    ];

    const TAB_BADGES = {
        "Mes Clients": clientCount || undefined,
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API}/auth/me`, { headers: authHeaders() });
                const data = await res.json();
                if (res.ok) {
                    setUser({ prenom: data.user.first_name, nom: data.user.last_name });
                }
            } catch (err) {
                console.error("Erreur chargement utilisateur", err);
            }
        };
        fetchUser();
    }, []);

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

                    <div className="statsRow">
                        {STATS.map((s) => (
                            <StatCard key={s.label} {...s} />
                        ))}
                    </div>
                </div>

                <TabBar 
                    tabs={TABS} 
                    active={activeTab} 
                    onChange={setActiveTab} 
                    badges={TAB_BADGES} 
                />

                <div className="tabContent">{renderTab()}</div>
            </main>
        </div>
    );
}