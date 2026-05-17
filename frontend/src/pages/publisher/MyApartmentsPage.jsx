import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinHouse, CheckCircle, Clock, Eye, Pencil, Trash2, BedDouble, MapPin, Search, SlidersHorizontal } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import StatCard from "../../components/layout/StatsCard";
import TabBar from "../../components/layout/TabBar";
import Loader from "../../components/ui/loader";
import "../../styles/profile/profile.css";
import "../../styles/publisher/myApartments.css";

// ── Constants ─────────────────────────────────────────────────
const API = "http://localhost:5000/api";

const TABS = [
    { label: "Mes Annonces",  path: "/my-apartments" },
    { label: "Les Demandes",  path: "/demandes" },
    { label: "Mes Clients",   path: "/my-clients" },
    { label: "Mon Profile",   path: "/publisher-profile" },
];

const ITEMS_PER_PAGE = 7;

const STATUS_OPTIONS = ["Tous les statuts", "Acceptée", "En Attente", "Rejetée"];

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

// ── Status Badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        "acceptée": { label: "Acceptée",  cls: "status-badge--approved" },
        "rejetée":  { label: "Rejetée",   cls: "status-badge--rejected" },
    };
    const entry = map[status?.toLowerCase()];
    return (
        <span className={`status-badge ${entry ? entry.cls : "status-badge--pending"}`}>
            {entry ? entry.label : "En Attente"}
        </span>
    );
}

// ── Confirm Modal ─────────────────────────────────────────────
function ConfirmModal({ apartment, onConfirm, onCancel }) {
    if (!apartment) return null;
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3 className="modal-title">Confirmer la suppression</h3>
                <p className="modal-body">
                    Êtes-vous sûr de vouloir supprimer{" "}
                    <strong>« {apartment.title} »</strong> ? Cette action est irréversible.
                </p>
                <div className="modal-actions">
                    <button className="btnSecondary" onClick={onCancel}>Annuler</button>
                    <button className="btnDanger" onClick={() => onConfirm(apartment.id)}>Supprimer</button>
                </div>
            </div>
        </div>
    );
}

// ── Apartments Table ──────────────────────────────────────────
function ApartmentsTab({ onStatsChange }) {
    const navigate = useNavigate();

    const [apartments, setApartments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [toDelete, setToDelete] = useState(null);
    const [flash, setFlash] = useState({ type: "", text: "" });
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Tous les statuts");
    const [filterOpen, setFilterOpen] = useState(false);

    const showFlash = (type, text) => {
        setFlash({ type, text });
        setTimeout(() => setFlash({ type: "", text: "" }), 4000);
    };

    const fetchApartments = async (currentPage = 1) => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(
                `${API}/appartements/my?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
                { headers: await getAuthHeaders() }
            );
            const data = await res.json();
            if (res.ok) {
                setApartments(data.apartments || []);
                setTotalPages(data.totalPages || 1);
                onStatsChange?.({
                    total:    data.total    ?? 0,
                    approved: data.approved ?? 0,
                    pending:  data.pending  ?? 0,
                });
            } else {
                setError(data.message || "Erreur lors du chargement.");
            }
        } catch (err) {
            console.error("Erreur chargement annonces", err);
            setError("Impossible de contacter le serveur.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApartments(page);
    }, [page]);

    const handleDelete = async (id) => {
        setToDelete(null);
        setIsLoading(true);
        try {
            const res = await fetch(`${API}/appartements/${id}`, {
                method: "DELETE",
                headers: await getAuthHeaders(),
            });
            if (res.ok) {
                showFlash("success", "Annonce supprimée avec succès.");
                fetchApartments(page);
            } else {
                const data = await res.json();
                showFlash("error", data.message || "Erreur lors de la suppression.");
            }
        } catch {
            showFlash("error", "Impossible de contacter le serveur.");
        } finally {
            setIsLoading(false);
        }
    };

    // Client-side filtering
    const filtered = apartments.filter((apt) => {
        const matchesSearch = apt.title?.toLowerCase().includes(search.toLowerCase()) ||
                              apt.address?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "Tous les statuts" ||
                              apt.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="apartments-tab">
            {isLoading && <Loader />}

            {flash.text && (
                <div className={`status-banner status-banner--${flash.type}`}>
                    <span>{flash.text}</span>
                </div>
            )}

            <ConfirmModal
                apartment={toDelete}
                onConfirm={handleDelete}
                onCancel={() => setToDelete(null)}
            />

            {/* ── Search & Filter bar ── */}
            <div className="table-controls">
                <div className="search-box">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher une annonce..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="filter-wrapper">
                    <button
                        className="filter-btn"
                        onClick={() => setFilterOpen((o) => !o)}
                    >
                        {statusFilter}
                        <SlidersHorizontal size={15} />
                    </button>
                    {filterOpen && (
                        <div className="filter-dropdown">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    className={`filter-option ${statusFilter === opt ? "filter-option--active" : ""}`}
                                    onClick={() => { setStatusFilter(opt); setFilterOpen(false); }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {error ? (
                <p className="error-text">{error}</p>
            ) : !isLoading && filtered.length === 0 ? (
                <p className="empty-text">Aucune annonce trouvée.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="apartments-table">
                        <thead>
                            <tr>
                                <th>APPARTEMENT</th>
                                <th>DÉTAILS</th>
                                <th>PRIX</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((apt) => (
                                <tr key={apt.id} className="table-row">
                                    {/* Thumbnail + title + address */}
                                    <td className="col-apartment">
                                        <div className="apt-thumb-wrap">
                                            {apt.photos?.[0]?.url ? (
                                                <img
                                                    src={apt.photos[0].url}
                                                    alt={apt.title}
                                                    className="apt-thumb"
                                                />
                                            ) : (
                                                <div className="apt-thumb apt-thumb--placeholder" />
                                            )}
                                            <div>
                                                <p className="apt-title">{apt.title}</p>
                                                <p className="apt-address">
                                                    <MapPin size={12} />
                                                    {apt.address}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Rooms */}
                                    <td className="col-details">
                                        <span className="detail-chip">
                                            <BedDouble size={14} />
                                            {apt.number_rooms} ch.
                                        </span>
                                    </td>

                                    {/* Price */}
                                    <td className="col-price">
                                        <span className="price-value">{Number(apt.monthly_price).toLocaleString("fr-MA")}</span>
                                        <span className="price-unit"> MAD/mois</span>
                                    </td>

                                    {/* Status */}
                                    <td className="col-status">
                                        <StatusBadge status={apt.status} />
                                    </td>

                                    {/* Icon actions */}
                                    <td className="col-actions">
                                        <div className="action-icons">
                                            <button
                                                className="action-icon action-icon--view"
                                                title="Voir"
                                                onClick={() => navigate(`/apartment/${apt.id}`)}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="action-icon action-icon--edit"
                                                title="Modifier"
                                                onClick={() => navigate(`/apartments/edit/${apt.id}`)}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className="action-icon action-icon--delete"
                                                title="Supprimer"
                                                onClick={() => setToDelete(apt)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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

// ── Placeholder Tab ───────────────────────────────────────────
function PlaceholderTab({ name }) {
    return (
        <div className="placeholder">
            <p>Contenu de « {name} » à venir.</p>
        </div>
    );
}

// ── Page Shell ────────────────────────────────────────────────
export default function MyApartmentsPage() {
    const [activeTab, setActiveTab] = useState("Mes Annonces");
    const [user, setUser] = useState({ prenom: "", nom: "" });
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });

    const STATS = [
        { label: "Mes Annonces", value: stats.total,    color: "#0F2744", subtitle: "Total des annonces",     icon: MapPinHouse },
        { label: "Approuvée",    value: stats.approved, color: "#1E9E6B", subtitle: "Annonces en ligne",      icon: CheckCircle   },
        { label: "En Attente",   value: stats.pending,  color: "#E87722", subtitle: "En cours de validation", icon: Clock         },
    ];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API}/auth/me`, { headers: await getAuthHeaders() });
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
            case "Mes Annonces":
                return <ApartmentsTab onStatsChange={setStats} />;
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

                <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab}/>

                <div className="tabContent">{renderTab()}</div>
            </main>
        </div>
    );
}