import { Link } from "react-router-dom";
import AdminNavbar from "../../components/layout/AdminNavbar";
import "../../styles/layout/AdminHome.css";
import Apr from "../../assets/images/apr.jpg";
import { FaUsers, FaBuilding } from "react-icons/fa";

function AdminHome() {
    return (
        <>
            <AdminNavbar />
            <div className="admin-home">
                <a href="/admin/users" className="admin-card active">
                    <div className="admin-icon">
                        <FaUsers />
                    </div>
                    <div className="admin-card-body">
                        <h2 className="admin-card-title">Utilisateurs</h2>
                        <p className="admin-card-description">
                            Consultez et gérez la liste des utilisateurs inscrits sur la plateforme.
                        </p>
                    </div>
                </a>
                

                <a href="/apartments/pending" className="admin-card">
                    <div className="admin-icon">
                        <FaBuilding />
                    </div>
                    <div className ="admin-card-body">
                        <h2 className="admin-card-title">Appartements en attente de validation</h2>
                        <p className="admin-card-description">
                            Examinez et validez les appartements soumis par les propriétaires.
                        </p>
                    </div>
                </a>
            </div>
        </>
    );
}

export default AdminHome;