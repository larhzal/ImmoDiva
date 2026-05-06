import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getDemandesRecues } from "../../services/rentalService"

export default function RentalRequestsPage() {
  const navigate = useNavigate()
  const [demandes, setDemandes]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [erreur, setErreur]       = useState(null)
  const [page, setPage]           = useState(1)
  const itemsParPage              = 7

  // Stats
  const [stats, setStats] = useState({
    total:      0,
    approuvees: 0,
    enAttente:  0
  })

  useEffect(() => {
    chargerDemandes()
  }, [])

  const chargerDemandes = async () => {
    try {
      setLoading(true)
      const data = await getDemandesRecues()
      setDemandes(data)

      // Calculer les stats
      setStats({
        total:      data.length,
        approuvees: data.filter(d => d.response === "acceptée").length,
        enAttente:  data.filter(d => d.response === "en_attente" || !d.response).length
      })
    } catch (err) {
      setErreur("Erreur lors du chargement des demandes")
    } finally {
      setLoading(false)
    }
  }

  // Pagination
  const totalPages        = Math.ceil(demandes.length / itemsParPage)
  const demandesPaginees  = demandes.slice(
    (page - 1) * itemsParPage,
    page * itemsParPage
  )

  if (loading) return <p style={{ textAlign: "center" }}>Chargement...</p>
  if (erreur)  return <p style={{ color: "red", textAlign: "center" }}>{erreur}</p>

  return (
    <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#F9F9F9", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <nav style={{
        backgroundColor: "#0F2744", padding: "16px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ color: "white", fontWeight: "bold", fontSize: 22 }}>
          <span style={{ color: "#E87722" }}>Immo.</span>
          <span style={{ fontSize: 14 }}>🏠</span>
          <span> DIVA</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Mon Espace", "Notifications", "Ajouter une Appartement à Louer", "Déconnexion"].map(item => (
            <span key={item} style={{ color: "white", cursor: "pointer", fontSize: 14 }}>
              {item}
            </span>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* ── En-tête ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, backgroundColor: "#1A1A1A",
            borderRadius: 8, display: "grid",
            gridTemplateColumns: "1fr 1fr", gap: 4, padding: 8
          }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                backgroundColor: i === 0 ? "#1A1A1A" : "#999",
                borderRadius: 2
              }}/>
            ))}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, color: "#1A1A1A" }}>Mon Espace</h2>
            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>Bienvenue, Lahlou Ali</p>
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 32 }}>
          <div style={{
            backgroundColor: "white", borderRadius: 12,
            padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
          }}>
            <p style={{ margin: 0, fontWeight: 700, color: "#1A1A1A", fontSize: 16 }}>
              Mes Annonces
            </p>
            <p style={{ margin: "12px 0 0", fontSize: 36, fontWeight: 700, color: "#1A1A1A" }}>
              15
            </p>
          </div>

          <div style={{
            backgroundColor: "white", borderRadius: 12,
            padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
          }}>
            <p style={{ margin: 0, fontWeight: 700, color: "#1E9E6B", fontSize: 16 }}>
              Approuvée
            </p>
            <p style={{ margin: "12px 0 0", fontSize: 36, fontWeight: 700, color: "#1A1A1A" }}>
              {stats.approuvees}
            </p>
          </div>

          <div style={{
            backgroundColor: "white", borderRadius: 12,
            padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
          }}>
            <p style={{ margin: 0, fontWeight: 700, color: "#E87722", fontSize: 16 }}>
              En Attente
            </p>
            <p style={{ margin: "12px 0 0", fontSize: 36, fontWeight: 700, color: "#1A1A1A" }}>
              {stats.enAttente}
            </p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Mes Annonces",  actif: false },
            { label: "Les Demandes",  actif: true  },
            { label: "Mes Clients",   actif: false },
            { label: "Mon Profile",   actif: false }
          ].map(tab => (
            <button
              key={tab.label}
              style={{
                padding: "10px 24px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: tab.actif ? 600 : 400,
                backgroundColor: tab.actif ? "#E87722" : "#EFEFEF",
                color: tab.actif ? "white" : "#1A1A1A"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tableau des demandes ── */}
        <div style={{
          backgroundColor: "white", borderRadius: 12,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden"
        }}>
          {/* En-tête tableau */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1fr 120px",
            padding: "16px 24px",
            borderBottom: "1px solid #F0F0F0"
          }}>
            {["Appartement", "Adresse", "Client", ""].map(col => (
              <span key={col} style={{ color: "#999", fontSize: 13, fontWeight: 500 }}>
                {col}
              </span>
            ))}
          </div>

          {/* Lignes */}
          {demandesPaginees.length === 0 ? (
            <p style={{ textAlign: "center", padding: 32, color: "#999" }}>
              Aucune demande reçue
            </p>
          ) : (
            demandesPaginees.map((demande, index) => (
              <div
                key={demande.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr 1fr 120px",
                  padding: "18px 24px",
                  alignItems: "center",
                  borderBottom: index < demandesPaginees.length - 1
                    ? "1px solid #F5F5F5" : "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                {/* Appartement */}
                <span style={{ fontSize: 14, color: "#1A1A1A" }}>
                  {demande.apartments?.title || "—"}
                </span>

                {/* Adresse */}
                <span style={{ fontSize: 14, color: "#666" }}>
                  {demande.apartments?.address
                    ? `${demande.apartments.address}, ${demande.apartments.city}`
                    : demande.apartments?.city || "—"
                  }
                </span>

                {/* Client */}
                <span style={{ fontSize: 14, color: "#666" }}>
                  {demande.client_name || `${demande.prenom || ""} ${demande.nom || ""}`.trim() || "—"}
                </span>

                {/* Action */}
                <span
                  onClick={() => navigate(`/publisher/demandes/${demande.id}`)}
                  style={{
                    color: "#1A1A1A", fontWeight: 700,
                    fontSize: 13, cursor: "pointer",
                    textDecoration: "none"
                  }}
                >
                  Voir la demande
                </span>
              </div>
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div style={{
            display: "flex", justifyContent: "center",
            gap: 12, marginTop: 32
          }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "10px 24px", borderRadius: 8,
                border: "none", cursor: page === 1 ? "not-allowed" : "pointer",
                backgroundColor: "#E87722", color: "white",
                opacity: page === 1 ? 0.5 : 1, fontWeight: 600
              }}
            >
              Précédent
            </button>

            <button style={{
              padding: "10px 24px", borderRadius: 8,
              border: "none", backgroundColor: "#E87722",
              color: "white", fontWeight: 600
            }}>
              Page {page}
            </button>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: "10px 24px", borderRadius: 8,
                border: "none", cursor: page === totalPages ? "not-allowed" : "pointer",
                backgroundColor: "#E87722", color: "white",
                opacity: page === totalPages ? 0.5 : 1, fontWeight: 600
              }}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  )
}