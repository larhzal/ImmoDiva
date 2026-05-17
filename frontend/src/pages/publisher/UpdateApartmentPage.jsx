import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { validateAppartementForm } from "../../utils/validators";
import Navbar from "../../components/layout/Navbar";
import "../../styles/publisher/addAppartement.css";

function UpdateAppartement() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [titre, setTitre] = useState("");
    const [ville, setVille] = useState("");
    const [description, setDescription] = useState("");
    const [adresse, setAdresse] = useState("");
    const [surface, setSurface] = useState("");
    const [nbChambres, setNbChambres] = useState("");
    const [etage, setEtage] = useState("");
    const [nbSallesBain, setNbSallesBain] = useState("");
    const [ascenseur, setAscenseur] = useState("");
    const [parking, setParking] = useState("");
    const [meuble, setMeuble] = useState("");
    const [piscine, setPiscine] = useState("");
    const [balcon, setBalcon] = useState("");
    const [gardien, setGardien] = useState("");
    const [prixMensuel, setPrixMensuel] = useState("");
    const [caution, setCaution] = useState("");
    const [chargesIncluses, setChargesIncluses] = useState("");
    const [dureeMini, setDureeMini] = useState("");
    const [dureeUnit, setDureeUnit] = useState("");
    const [animaux, setAnimaux] = useState("");
    const [fumeurs, setFumeurs] = useState("");
    const [colocataires, setColocataires] = useState("");
    const [profilLocataire, setProfilLocataire] = useState([]);

    // Photos state: existing photos come from the server (url only, no file),
    // new photos added by the user have both file + url.
    const [existingPhotos, setExistingPhotos] = useState([]); // { url: string }[]
    const [newPhotos, setNewPhotos] = useState([]);            // { file, url }[]
    // IDs of existing photos the user wants to delete
    const [deletedPhotoIds, setDeletedPhotoIds] = useState([]);

    const fileInputRef = useRef(null);

    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [touched, setTouched] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // ── Fetch existing apartment data ──────────────────────────────────────
    useEffect(() => {
        const fetchAppartement = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/appartements/${id}`);
                if (!response.ok) throw new Error("Appartement introuvable");
                const data = await response.json();

                // Populate all fields with existing values
                setTitre(data.data.title ?? "");
                setVille(data.data.city ?? "");
                setDescription(data.data.description ?? "");
                setAdresse(data.data.address ?? "");
                setSurface(data.data.surface?.toString() ?? "");
                setNbChambres(data.data.number_rooms?.toString() ?? "");
                setEtage(data.data.floor?.toString() ?? "");
                setNbSallesBain(data.data.number_bathrooms?.toString() ?? "");
                setAscenseur(data.data.elevator?.toString() ?? "");
                setParking(data.data.parking?.toString() ?? "");
                setMeuble(data.data.furnitured?.toString() ?? "");
                setPiscine(data.data.pool?.toString() ?? "");
                setBalcon(data.data.balcony?.toString() ?? "");
                setGardien(data.data.concierge?.toString() ?? "");
                setPrixMensuel(data.data.monthly_price?.toString() ?? "");
                setCaution(data.data.deposit_required?.toString() ?? "");
                setChargesIncluses(data.data.charges_included?.toString() ?? "");
                setDureeMini(data.data.rental_min_duration?.toString() ?? "");
                setDureeUnit(data.data.rental_duration_unit ?? "");
                setAnimaux(data.data.animals_accepted?.toString() ?? "");
                setFumeurs(data.data.smokers_accepted?.toString() ?? "");
                setColocataires(data.data.rommates_accepted?.toString() ?? "");
                setProfilLocataire(data.data.roomer_profil_desired ?? []);

                // Existing photos: adapt to your API's photo structure
                const formattedPhotos = (data.data.photos ?? []).map(p => {
                    // Extract JUST the filename from the path (e.g., "apt1-1.jpg")
                    const fileName = p.file_path.split('/').pop().split('?')[0];
                    
                    // Manually point to the Public URL structure
                    // Double-check if your file is in a subfolder like 'Apt1' or just in 'appartements'
                    return {
                        ...p,
                        url: `https://fipyteeltzqzeifwdpca.supabase.co/storage/v1/object/public/appartements/${fileName}`
                    };
                });

                setExistingPhotos(formattedPhotos);
            } catch (error) {
                console.error(error);
                setFormError("Impossible de charger les données de l'appartement.");
            } finally {
                setFetchLoading(false);
            }
        };

        fetchAppartement();
    }, [id]);

    // ── Helpers ───────────────────────────────────────────────────────────
    const handleProfil = (profil) => {
        setProfilLocataire((prev) =>
            prev.includes(profil) ? prev.filter((p) => p !== profil) : [...prev, profil]
        );
    };

    const handlePhotos = (e) => {
        const files = Array.from(e.target.files);
        const added = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        const totalAfterAdd = existingPhotos.length + newPhotos.length + added.length;
        const allowed = Math.max(0, 15 - existingPhotos.length - newPhotos.length);
        setNewPhotos((prev) => [...prev, ...added.slice(0, allowed)]);
        if (totalAfterAdd > 15) {
            alert("Vous ne pouvez pas dépasser 15 photos au total.");
        }
    };

    // Remove an existing (server-side) photo
    const removeExistingPhoto = (photo) => {
        setExistingPhotos((prev) => prev.filter((p) => p.id !== photo.id));
        setDeletedPhotoIds((prev) => [...prev, photo.id]);
    };

    // Remove a newly added (local) photo
    const removeNewPhoto = (index) => {
        setNewPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    // ── Submit (PUT) ──────────────────────────────────────────────────────
    const handleSubmit = async () => {
        // Combine existing + new for validation count
        const photos = [
            ...existingPhotos.map((p) => ({ url: p.url })),
            ...newPhotos,
        ];

        const fields = {
            titre, ville, description, adresse, surface, nbChambres, etage,
            nbSallesBain, ascenseur, parking, meuble, piscine, balcon, gardien,
            prixMensuel, caution, chargesIncluses, dureeMini, dureeUnit,
            animaux, fumeurs, colocataires, profilLocataire, photos,
        };

        const { isValid, errors } = validateAppartementForm(fields);

        if (!isValid) {
            setErrors(errors);
            const touchedFields = {};
            Object.keys(fields).forEach((field) => { touchedFields[field] = true; });
            setTouched(touchedFields);
            setFormError("Tous les champs obligatoires doivent être remplis");
            return;
        }

        setFormError("");

        try {
            setLoading(true);
            const formData = new FormData();

            formData.append("titre", titre);
            formData.append("ville", ville);
            formData.append("description", description);
            formData.append("adresse", adresse);
            formData.append("surface", surface);
            formData.append("nbChambres", nbChambres);
            formData.append("etage", etage);
            formData.append("nbSallesBain", nbSallesBain);
            formData.append("ascenseur", ascenseur);
            formData.append("parking", parking);
            formData.append("meuble", meuble);
            formData.append("piscine", piscine);
            formData.append("balcon", balcon);
            formData.append("gardien", gardien);
            formData.append("prixMensuel", prixMensuel);
            formData.append("caution", caution);
            formData.append("chargesIncluses", chargesIncluses);
            formData.append("dureeMini", dureeMini);
            formData.append("dureeUnit", dureeUnit);
            formData.append("animaux", animaux);
            formData.append("fumeurs", fumeurs);
            formData.append("colocataires", colocataires);
            formData.append("profilLocataire", JSON.stringify(profilLocataire));

            // Tell the server which existing photos to delete
            formData.append("deletedPhotoIds", JSON.stringify(deletedPhotoIds));

            // Attach only newly added files
            newPhotos.forEach((photo) => {
                formData.append("photos", photo.file);
            });

            const response = await fetch(`http://localhost:5000/api/appartements/${id}`, {
                method: "PUT",
                body: formData,
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setSuccessMessage("Appartement mis à jour avec succès");
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => {
                    setSuccessMessage("");
                    navigate(`/apartment/${id}`); // redirect to detail page after update
                }, 2000);
            } else {
                setFormError(data.message || "Une erreur est survenue lors de la mise à jour.");
            }
        } catch (error) {
            console.error(error);
            setFormError("Une erreur réseau est survenue.");
        } finally {
            setLoading(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────
    if (fetchLoading) {
        return (
            <>
                <Navbar />
                <div style={{ textAlign: "center", marginTop: "80px" }}>
                    Chargement des données…
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            {formError && (
                <div style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "10px",
                    margin: "10px",
                    marginRight: "100px",
                    marginLeft: "100px",
                    borderRadius: "5px",
                    textAlign: "center",
                }}>
                    {formError}
                </div>
            )}

            {successMessage && (
                <div className="toast-success">
                    {successMessage}
                </div>
            )}

            <div className="add-appartement">
                {/* Title changed for update context */}
                <h1>Modifier l'Appartement</h1>

                {/* ── Informations sur le bien ── */}
                <section>
                    <h2>Informations sur le bien</h2>

                    <div className="two-cols">
                        <div className="field">
                            <label>Titre <span className="required"> *</span> : </label>
                            <input type="text" value={titre} onChange={(e) => {
                                setTitre(e.target.value);
                                if (errors.titre) setErrors(prev => ({ ...prev, titre: "" }));
                            }} />
                            {touched.titre && errors.titre && (
                                <div style={{ color: "red", fontSize: "12px" }}>{errors.titre}</div>
                            )}
                        </div>
                        <div className="field">
                            <label>Ville <span className="required"> *</span> :</label>
                            <input type="text" value={ville} onChange={(e) => {
                                setVille(e.target.value);
                                if (errors.ville) setErrors(prev => ({ ...prev, ville: "" }));
                            }} />
                            {touched.ville && errors.ville && (
                                <div style={{ color: "red", fontSize: "12px" }}>{errors.ville}</div>
                            )}
                        </div>
                        <div className="field">
                            <label>Description <span className="required"> *</span> :</label>
                            <textarea value={description} onChange={(e) => {
                                setDescription(e.target.value);
                                if (errors.description) setErrors(prev => ({ ...prev, description: "" }));
                            }} />
                            {touched.description && errors.description && (
                                <div style={{ color: "red", fontSize: "12px" }}>{errors.description}</div>
                            )}
                        </div>
                        <div className="field">
                            <label>Adresse <span className="required"> *</span> :</label>
                            <textarea value={adresse} onChange={(e) => {
                                setAdresse(e.target.value);
                                if (errors.adresse) setErrors(prev => ({ ...prev, adresse: "" }));
                            }} />
                            {touched.adresse && errors.adresse && (
                                <div style={{ color: "red", fontSize: "12px" }}>{errors.adresse}</div>
                            )}
                        </div>
                        <div className="field">
                            <label>Surface en m² <span className="required"> *</span> :</label>
                            <input type="number" value={surface} min="0" onChange={(e) => {
                                setSurface(e.target.value);
                                if (errors.surface) setErrors(prev => ({ ...prev, surface: "" }));
                            }} />
                            {touched.surface && errors.surface && (
                                <div style={{ color: "red", fontSize: "12px" }}>{errors.surface}</div>
                            )}
                        </div>
                        <div className="field">
                            <label>Nombre de chambres <span className="required"> *</span> :</label>
                            <input type="number" value={nbChambres} min="0" onChange={(e) => {
                                setNbChambres(e.target.value);
                                if (errors.nbChambres) setErrors(prev => ({ ...prev, nbChambres: "" }));
                            }} />
                            {touched.nbChambres && errors.nbChambres && (
                                <div style={{ color: "red", fontSize: "12px" }}>{errors.nbChambres}</div>
                            )}
                        </div>
                        <div className="field">
                            <label>Étage <span className="required"> *</span> :</label>
                            <input type="number" value={etage} min="-1" onChange={(e) => {
                                setEtage(e.target.value);
                                if (errors.etage) setErrors(prev => ({ ...prev, etage: "" }));
                            }} />
                            {touched.etage && errors.etage && (
                                <div style={{ color: "red", fontSize: "12px" }}>{errors.etage}</div>
                            )}
                        </div>
                        <div className="field">
                            <label>Nombre de salles de bain <span className="required"> *</span> :</label>
                            <input type="number" value={nbSallesBain} min="0" onChange={(e) => {
                                setNbSallesBain(e.target.value);
                                if (errors.nbSallesBain) setErrors(prev => ({ ...prev, nbSallesBain: "" }));
                            }} />
                            {touched.nbSallesBain && errors.nbSallesBain && (
                                <div style={{ color: "red", fontSize: "12px" }}>{errors.nbSallesBain}</div>
                            )}
                        </div>
                    </div>

                    {/* ── Boolean radio fields (amenities) ── */}
                    <div className="two-cols radios">
                        {[
                            { label: "Ascenseur", name: "ascenseur", value: ascenseur, setter: setAscenseur },
                            { label: "Parking", name: "parking", value: parking, setter: setParking },
                            { label: "Meublé", name: "meuble", value: meuble, setter: setMeuble },
                            { label: "Piscine", name: "piscine", value: piscine, setter: setPiscine },
                            { label: "Balcon / Terrasse", name: "balcon", value: balcon, setter: setBalcon },
                            { label: "Gardien / Concierge", name: "gardien", value: gardien, setter: setGardien },
                        ].map(({ label, name, value, setter }) => (
                            <div key={name} className="radio-field" style={{
                                borderBottom: touched[name] && errors[name] ? "1px solid red" : ""
                            }}>
                                <label>{label} <span className="required"> *</span> :</label>
                                <label>
                                    <input type="radio" name={name} value="true" checked={value === "true"}
                                        onChange={() => {
                                            setter("true");
                                            if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
                                        }} /> Oui
                                </label>
                                <label>
                                    <input type="radio" name={name} value="false" checked={value === "false"}
                                        onChange={() => {
                                            setter("false");
                                            if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
                                        }} /> Non
                                </label>
                                {touched[name] && errors[name] && (
                                    <div style={{ color: "red", fontSize: "12px" }}>{errors[name]}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Conditions de location ── */}
                <section>
                    <h2>Conditions de location</h2>

                    <div className="two-cols">
                        <div className="field">
                            <label>Prix mensuel en MAD <span className="required"> *</span> :</label>
                            <div className="input-wraper">
                                <input type="number" value={prixMensuel} min="0" onChange={(e) => {
                                    setPrixMensuel(e.target.value);
                                    if (errors.prixMensuel) setErrors(prev => ({ ...prev, prixMensuel: "" }));
                                }} />
                                {touched.prixMensuel && errors.prixMensuel && (
                                    <div style={{ color: "red", fontSize: "12px" }}>{errors.prixMensuel}</div>
                                )}
                            </div>
                        </div>

                        <div className="field">
                            <label>Durée minimum de location <span className="required"> *</span> :</label>
                            <div className="input-wraper">
                                <input type="number" value={dureeMini} min="1" onChange={(e) => {
                                    setDureeMini(e.target.value);
                                    if (errors.dureeMini) setErrors(prev => ({ ...prev, dureeMini: "" }));
                                }} />
                                <select value={dureeUnit} onChange={(e) => {
                                    setDureeUnit(e.target.value);
                                    if (errors.dureeUnit) setErrors(prev => ({ ...prev, dureeUnit: "" }));
                                }}>
                                    <option value="">Choisir</option>
                                    <option value="jours">Jours</option>
                                    <option value="mois">Mois</option>
                                </select>
                                {touched.dureeMini && errors.dureeMini && (
                                    <div style={{ color: "red", fontSize: "12px" }}>{errors.dureeMini}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="two-cols radios">
                        {[
                            { label: "Caution demandée", name: "caution", value: caution, setter: setCaution },
                            { label: "Charges incluses", name: "chargesIncluses", value: chargesIncluses, setter: setChargesIncluses },
                            { label: "Fumeurs acceptés", name: "fumeurs", value: fumeurs, setter: setFumeurs },
                            { label: "Animaux acceptés", name: "animaux", value: animaux, setter: setAnimaux },
                            { label: "Colocataires acceptés", name: "colocataires", value: colocataires, setter: setColocataires },
                        ].map(({ label, name, value, setter }) => (
                            <div key={name} className="radio-field" style={{
                                borderBottom: touched[name] && errors[name] ? "1px solid red" : ""
                            }}>
                                <label>{label} <span className="required"> *</span> :</label>
                                <label>
                                    <input type="radio" name={name} value="true" checked={value === "true"}
                                        onChange={() => {
                                            setter("true");
                                            if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
                                        }} /> Oui
                                </label>
                                <label>
                                    <input type="radio" name={name} value="false" checked={value === "false"}
                                        onChange={() => {
                                            setter("false");
                                            if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
                                        }} /> Non
                                </label>
                                {touched[name] && errors[name] && (
                                    <div style={{ color: "red", fontSize: "12px" }}>{errors[name]}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="radio-field" style={{
                        borderBottom: touched.profilLocataire && errors.profilLocataire ? "1px solid red" : ""
                    }}>
                        <label>Profil locataire souhaité <span className="required"> *</span> :</label>
                        {["Famille", "Couple", "Célibataire", "Étudiant"].map((p) => (
                            <label key={p}>
                                <input
                                    type="checkbox"
                                    checked={profilLocataire.includes(p)}
                                    onChange={() => {
                                        handleProfil(p);
                                        if (errors.profilLocataire) setErrors(prev => ({ ...prev, profilLocataire: "" }));
                                    }}
                                />
                                {" "}{p}
                            </label>
                        ))}
                        {touched.profilLocataire && errors.profilLocataire && (
                            <div style={{ color: "red", fontSize: "12px" }}>{errors.profilLocataire}</div>
                        )}
                    </div>
                </section>

                {/* ── Galerie du bien ── */}
                <section>
                    <h2>Galerie du bien</h2>
                    <p className="hint">
                        Ajoutez entre 3 et 15 photos au total (JPEG, PNG · max 5 Mo chacune)
                    </p>
                    <div className="field">
                        {/* <label>Photos de l'appartement <span className="required"> *</span></label> */}
                        <input
                            type="file"
                            accept="image/jpeg,image/png"
                            multiple
                            ref={fileInputRef}
                            onChange={handlePhotos}
                            style={{ display: "none" }}
                        />
                    </div>
                    
                    {touched.photos && errors.photos && (
                        <div style={{ color: "red", fontSize: "12px" }}>{errors.photos}</div>
                    )}

                    <button
                        type="button"
                        className="btn-choose-files"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Ajouter des photos
                    </button>
                    {/* Existing photos from the server */}
                    {(existingPhotos.length > 0 || newPhotos.length > 0) && (
                        <div className="photo-grid">
                            {existingPhotos.map((photo, idx) => (   
                                <div key={`existing-${idx}`} className="photo-thumb">
                                    {/* Use the already-formatted URL from your state */}
                                    <img 
                                        src={photo.url} 
                                        alt={`existing-photo-${idx}`} 
                                    />
                                    <button type="button" onClick={() => removeExistingPhoto(photo)}>×</button>
                                </div>
                            ))}
                            {newPhotos.map((photo, idx) => (
                                <div key={`new-${idx}`} className="photo-thumb">
                                    <img src={photo.url} alt={`new-photo-${idx}`} />
                                    <button type="button" onClick={() => removeNewPhoto(idx)}>×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── Submit ── */}
                <div className="submit-row">
                    <button type="button" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Mise à jour en cours..." : "Mettre à jour l'Appartement"}
                    </button>
                </div>
            </div>
        </>
    );
}

export default UpdateAppartement;