import { useState, useRef } from "react";
import "../../styles/publisher/addAppartement.css";
import { validateAppartementForm } from "../../utils/validators";
import Navbar from "../../components/layout/Navbar";

function AddAppartement() {
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
    const [photos, setPhotos] = useState([]);

    const fileInputRef = useRef(null);

    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [touched, setTouched] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleProfil = (profil) => {
        setProfilLocataire((prev) =>
            prev.includes(profil) ? prev.filter((p) => p !== profil) : [...prev, profil]
        );
    };

    const handlePhotos = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setPhotos((prev) => [...prev, ...newPhotos].slice(0, 15));
    };

    const removePhoto = (index) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const fields = {
            titre,
            ville,
            description,
            adresse,
            surface,
            nbChambres,
            etage,
            nbSallesBain,
            ascenseur,
            parking,
            meuble,
            piscine,
            balcon,
            gardien,
            prixMensuel,
            caution,
            chargesIncluses,
            dureeMini,
            dureeUnit,
            animaux,
            fumeurs,
            colocataires,
            profilLocataire,
            photos
        };

        const { isValid, errors } = validateAppartementForm(fields);

        if (!isValid) {
            setErrors(errors);

            const touchedFields = {};
            Object.keys(fields).forEach(field => {
                touchedFields[field] = true;
            });
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


            photos.forEach((photo) => {
                formData.append("photos", photo.file);
            });

            const raw = localStorage.getItem("immodiva_token");

            let token = null;

            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    token = parsed?.access_token || raw;
                } catch {
                    token = raw;
                }
            }

            const response = await fetch("http://localhost:5000/api/appartements", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setSuccessMessage("Appartement créé avec succès");


                setTitre("");
                setVille("");
                setDescription("");
                setAdresse("");
                setSurface("");
                setNbChambres("");
                setEtage("");
                setNbSallesBain("");
                setAscenseur("");
                setParking("");
                setMeuble("");
                setPiscine("");
                setBalcon("");
                setGardien("");
                setPrixMensuel("");
                setCaution("");
                setChargesIncluses("");
                setDureeMini("");
                setAnimaux("");
                setFumeurs("");
                setColocataires("");
                setProfilLocataire([]);
                setPhotos([]);

                window.scrollTo({ top: 0, behavior: "smooth" });

                setTimeout(() => {
                    setSuccessMessage("");
                }, 5000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


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
                <h1>Ajouter une Appartement</h1>

                {/* ── Informations sur le bien ── */}
                <section>
                    <h2>Informations sur le bien</h2>

                    <div className="two-cols">
                        <div className="field">
                            <label>Titre <span className="required"> *</span> : </label>
                            <input type="text" value={titre} onChange={(e) => {
                                setTitre(e.target.value);
                                if (errors.titre) {
                                    setErrors(prev => ({ ...prev, titre: "" }));
                                }
                            }} />
                            {touched.titre && errors.titre && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.titre}
                                </div>
                            )}
                        </div>
                        <div className="field">
                            <label>Ville <span className="required"> *</span> :</label>
                            <input type="text" value={ville} onChange={(e) => {
                                setVille(e.target.value);
                                if (errors.ville) {
                                    setErrors(prev => ({ ...prev, ville: "" }));
                                }
                            }} />
                            {touched.ville && errors.ville && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.ville}
                                </div>
                            )}
                        </div>
                        <div className="field">
                            <label>Description <span className="required"> *</span> :</label>
                            <textarea value={description} onChange={(e) => {
                                setDescription(e.target.value);
                                if (errors.description) {
                                    setErrors(prev => ({ ...prev, description: "" }));
                                }
                            }} />
                            {touched.description && errors.description && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.description}
                                </div>
                            )}
                        </div>
                        <div className="field">
                            <label>Adresse <span className="required"> *</span> :</label>
                            <textarea value={adresse} onChange={(e) => {
                                setAdresse(e.target.value);
                                if (errors.adresse) {
                                    setErrors(prev => ({ ...prev, adresse: "" }));
                                }
                            }} />
                            {touched.adresse && errors.adresse && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.adresse}
                                </div>
                            )}
                        </div>
                        <div className="field">
                            <label>Surface en m² <span className="required"> *</span> :</label>
                            <input type="number" value={surface} min="0" onChange={(e) => {
                                setSurface(e.target.value);
                                if (errors.surface) {
                                    setErrors(prev => ({ ...prev, surface: "" }));
                                }
                            }} />
                            {touched.surface && errors.surface && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.surface}
                                </div>
                            )}
                        </div>
                        <div className="field">
                            <label>Nombre de chambres <span className="required"> *</span> :</label>
                            <input type="number" value={nbChambres} min="0" onChange={(e) => {
                                setNbChambres(e.target.value);
                                if (errors.nbChambres) {
                                    setErrors(prev => ({ ...prev, nbChambres: "" }));
                                }
                            }} />
                            {touched.nbChambres && errors.nbChambres && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.nbChambres}
                                </div>
                            )}
                        </div>
                        <div className="field">
                            <label>Étage <span className="required"> *</span> :</label>
                            <input type="number" value={etage} min="-1" onChange={(e) => {
                                setEtage(e.target.value);
                                if (errors.etage) {
                                    setErrors(prev => ({ ...prev, etage: "" }));
                                }
                            }} />
                            {touched.etage && errors.etage && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.etage}
                                </div>
                            )}
                        </div>
                        <div className="field">
                            <label>Nombre de salles de bain <span className="required"> *</span> :</label>
                            <input type="number" value={nbSallesBain} min="0" onChange={(e) => {
                                setNbSallesBain(e.target.value);
                                if (errors.nbSallesBain) {
                                    setErrors(prev => ({ ...prev, nbSallesBain: "" }));
                                }
                            }}
                                style={{
                                    borderColor: touched.nbSallesBain && errors.nbSallesBain ? "red" : ""
                                }} />
                            {touched.nbSallesBain && errors.nbSallesBain && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.nbSallesBain}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="two-cols radios">
                        <div className="radio-field" style={{
                            borderBottom: touched.parking && errors.parking ? "1px solid red" : ""
                        }}>
                            <label>Présence d'ascenseur <span className="required"> *</span> :</label>
                            <label><input type="radio" name="ascenseur" value="true" checked={ascenseur === "true"} onChange={() => {
                                setAscenseur("true");

                                if (errors.ascenseur) {
                                    setErrors(prev => ({ ...prev, ascenseur: "" }));
                                }
                            }} /> Oui</label>
                            <label><input type="radio" name="ascenseur" value="false" checked={ascenseur === "false"} onChange={() => {
                                setAscenseur("false");

                                if (errors.ascenseur) {
                                    setErrors(prev => ({ ...prev, ascenseur: "" }));
                                }
                            }} /> Non</label>
                            {touched.ascenseur && errors.ascenseur && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.ascenseur}
                                </div>
                            )}
                        </div>
                        <div className="radio-field" style={{
                            borderBottom: touched.parking && errors.parking ? "1px solid red" : ""
                        }}>
                            <label>Parking <span className="required"> *</span> :</label>
                            <label><input type="radio" name="parking" value="true" checked={parking === "true"}
                                onChange={() => {
                                    setParking("true");

                                    if (errors.parking) {
                                        setErrors(prev => ({ ...prev, parking: "" }));
                                    }
                                }}
                            /> Oui</label>
                            <label><input type="radio" name="parking" value="false" checked={parking === "false"} onChange={() => {
                                setParking("false");

                                if (errors.parking) {
                                    setErrors(prev => ({ ...prev, parking: "" }));
                                }
                            }} /> Non</label>
                            {touched.parking && errors.parking && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.parking}
                                </div>
                            )}
                        </div>
                        <div className="radio-field" style={{
                            borderBottom: touched.parking && errors.parking ? "1px solid red" : ""
                        }} >
                            <label>Meublé <span className="required"> *</span> :</label>
                            <label><input type="radio" name="meuble" value="true" checked={meuble === "true"} onChange={() => {
                                setMeuble("true");

                                if (errors.meuble) {
                                    setErrors(prev => ({ ...prev, meuble: "" }));
                                }
                            }} /> Oui</label>
                            <label><input type="radio" name="meuble" value="false" checked={meuble === "false"} onChange={() => {
                                setMeuble("false");

                                if (errors.meuble) {
                                    setErrors(prev => ({ ...prev, meuble: "" }));
                                }
                            }} /> Non</label>
                            {touched.meuble && errors.meuble && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.meuble}
                                </div>
                            )}
                        </div>
                        <div className="radio-field" style={{
                            borderBottom: touched.parking && errors.parking ? "1px solid red" : ""
                        }} >
                            <label>Piscine <span className="required"> *</span> :</label>
                            <label><input type="radio" name="piscine" value="true" checked={piscine === "true"} onChange={() => {
                                setPiscine("true");

                                if (errors.piscine) {
                                    setErrors(prev => ({ ...prev, piscine: "" }));
                                }
                            }} /> Oui</label>
                            <label><input type="radio" name="piscine" value="false" checked={piscine === "false"} onChange={() => {
                                setPiscine("false");

                                if (errors.piscine) {
                                    setErrors(prev => ({ ...prev, piscine: "" }));
                                }
                            }} /> Non</label>
                            {touched.piscine && errors.piscine && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.piscine}
                                </div>
                            )}
                        </div>
                        <div className="radio-field" style={{
                            borderBottom: touched.parking && errors.parking ? "1px solid red" : ""
                        }} >
                            <label>Balcon/ Terasse <span className="required"> *</span> :</label>
                            <label><input type="radio" name="balcon" value="true" checked={balcon === "true"} onChange={() => {
                                setBalcon("true");

                                if (errors.balcon) {
                                    setErrors(prev => ({ ...prev, balcon: "" }));
                                }
                            }} /> Oui</label>
                            <label><input type="radio" name="balcon" value="false" checked={balcon === "false"} onChange={() => {
                                setBalcon("false");

                                if (errors.balcon) {
                                    setErrors(prev => ({ ...prev, balcon: "" }));
                                }
                            }} /> Non</label>
                            {touched.balcon && errors.balcon && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.balcon}
                                </div>
                            )}
                        </div>
                        <div className="radio-field" style={{
                            borderBottom: touched.parking && errors.parking ? "1px solid red" : ""
                        }} >
                            <label>Gardien/ Concierge <span className="required"> *</span> :</label>
                            <label><input type="radio" name="gardien" value="true" checked={gardien === "true"} onChange={() => {
                                setGardien("true");

                                if (errors.gardien) {
                                    setErrors(prev => ({ ...prev, gardien: "" }));
                                }
                            }} /> Oui</label>
                            <label><input type="radio" name="gardien" value="false" checked={gardien === "false"} onChange={() => {
                                setGardien("false");

                                if (errors.gardien) {
                                    setErrors(prev => ({ ...prev, gardien: "" }));
                                }
                            }} /> Non</label>
                            {touched.gardien && errors.gardien && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.gardien}
                                </div>
                            )}
                        </div>
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
                                    if (errors.prixMensuel) {
                                        setErrors(prev => ({ ...prev, prixMensuel: "" }));
                                    }
                                }} />
                                {touched.prixMensuel && errors.prixMensuel && (
                                    <div style={{ color: "red", fontSize: "12px" }}>
                                        {errors.prixMensuel}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="field">
                            <label>Durée minimum de location <span className="required"> *</span> :</label>
                            <div className="input-wraper">
                                <input
                                    type="number"
                                    value={dureeMini}
                                    onChange={(e) => {
                                        setDureeMini(e.target.value);
                                        if (errors.dureeMini) {
                                            setErrors(prev => ({ ...prev, dureeMini: "" }));
                                        }
                                    }}
                                    min="1"
                                />
                                <select
                                    required
                                    value={dureeUnit}
                                    onChange={(e) => {
                                        setDureeUnit(e.target.value);
                                        if (errors.dureeUnit) {
                                            setErrors(prev => ({ ...prev, dureeUnit: "" }));
                                        }
                                    }}
                                >
                                    <option value="">Choisir</option>
                                    <option value="jours">Jours</option>
                                    <option value="mois">Mois</option>
                                </select>
                                {touched.dureeMini && errors.dureeMini && (
                                    <div style={{ color: "red", fontSize: "12px" }}>
                                        {errors.dureeMini}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="two-cols radios">
                        <div className="radio-field" style={{
                            borderBottom: touched.parking && errors.parking ? "1px solid red" : ""
                        }} >
                            <label>Caution demandée <span className="required"> *</span> :</label>
                            <label><input type="radio" name="caution" value="true" checked={caution === "true"} onChange={() => {
                                setCaution("true");

                                if (errors.cautioin) {
                                    setErrors(prev => ({ ...prev, caution: "" }));
                                }
                            }} /> Oui</label>
                            <label><input type="radio" name="caution" value="false" checked={caution === "false"} onChange={() => {
                                setCaution("false");

                                if (errors.cautioin) {
                                    setErrors(prev => ({ ...prev, caution: "" }));
                                }
                            }} /> Non</label>
                            {touched.cautioin && errors.cautioin && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.cautioin}
                                </div>
                            )}
                        </div>
                        <div className="radio-field" style={{
                            borderBottom: touched.parking && errors.parking ? "1px solid red" : ""
                        }} >
                            <label>Charges incluses <span className="required"> *</span> :</label>
                            <label><input type="radio" name="charges" value="true" checked={chargesIncluses === "true"} onChange={() => {
                                setChargesIncluses("true");
                                if (errors.chargesIncluses) {
                                    setErrors(prev => ({ ...prev, chargesIncluses: "" }));
                                }
                            }} /> Oui</label>
                            <label><input type="radio" name="charges" value="false" checked={chargesIncluses === "false"} onChange={() => {
                                setChargesIncluses("false");

                                if (errors.chargesIncluses) {
                                    setErrors(prev => ({ ...prev, chargesIncluses: "" }));
                                }
                            }} /> Non</label>
                            {touched.chargesIncluses && errors.chargesIncluses && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.chargesIncluses}
                                </div>
                            )}
                        </div>
                        <div className="radio-field" style={{
                            borderBottom: touched.parking && errors.parking ? "1px solid red" : ""
                        }} >
                            <label>Fumeurs acceptés <span className="required"> *</span> :</label>
                            <label><input type="radio" name="fumeurs" value="true" checked={fumeurs === "true"} onChange={() => {
                                setFumeurs("true");

                                if (errors.fumeurs) {
                                    setErrors(prev => ({ ...prev, fumeurs: "" }));
                                }
                            }} /> Oui</label>
                            <label><input type="radio" name="fumeurs" value="false" checked={fumeurs === "false"} onChange={() => {
                                setFumeurs("false");

                                if (errors.fumeurs) {
                                    setErrors(prev => ({ ...prev, fumeurs: "" }));
                                }
                            }} /> Non</label>
                            {touched.fumeurs && errors.fumeurs && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.fumeurs}
                                </div>
                            )}
                        </div>
                        <div className="radio-field" style={{
                            borderBottom: touched.parking && errors.parking ? "1px solid red" : ""
                        }} >
                            <label>Animaux acceptés <span className="required"> *</span> :</label>
                            <label><input type="radio" name="animaux" value="true" checked={animaux === "true"} onChange={() => {
                                setAnimaux("true");

                                if (errors.animaux) {
                                    setErrors(prev => ({ ...prev, animaux: "" }));
                                }
                            }} /> Oui</label>
                            <label><input type="radio" name="animaux" value="false" checked={animaux === "false"} onChange={() => {
                                setAnimaux("false");

                                if (errors.animaux) {
                                    setErrors(prev => ({ ...prev, animaux: "" }));
                                }
                            }} /> Non</label>
                            {touched.animaux && errors.animaux && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.animaux}
                                </div>
                            )}
                        </div>
                        <div className="radio-field" style={{
                            borderBottom: touched.parking && errors.parking ? "1px solid red" : ""
                        }} >
                            <label>Colocataires acceptés <span className="required"> *</span> :</label>
                            <label><input type="radio" name="colocataires" value="true" checked={colocataires === "true"} onChange={() => {
                                setColocataires("true");

                                if (errors.colocataires) {
                                    setErrors(prev => ({ ...prev, colocataires: "" }));
                                }
                            }} /> Oui</label>
                            <label><input type="radio" name="colocataires" value="false" checked={colocataires === "false"} onChange={() => {
                                setColocataires("false");

                                if (errors.colocataires) {
                                    setErrors(prev => ({ ...prev, colocataires: "" }));
                                }
                            }} /> Non</label>
                            {touched.colocataires && errors.colocataires && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                    {errors.colocataires}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="radio-field" style={{
                        borderBottom: touched.profilLocataire && errors.profilLocataire ? "1px solid red" : ""
                    }} >
                        <label>Profil locataire souhaité <span className="required"> *</span> :</label>
                        {["Famille", "Couple", "Célibataire", "Étudiant"].map((p) => (
                            <label key={p}>
                                <input
                                    type="checkbox"
                                    checked={profilLocataire.includes(p)}
                                    onChange={() => {
                                        handleProfil(p);


                                        if (errors.profilLocataire) {
                                            setErrors(prev => ({ ...prev, profilLocataire: "" }));
                                        }
                                    }}
                                />
                                {" "}{p}
                            </label>
                        ))}
                        {touched.profilLocataire && errors.profilLocataire && (
                            <div style={{ color: "red", fontSize: "12px" }}>
                                {errors.profilLocataire}
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Galerie du bien ── */}
                <section>
                    <h2>Galerie du bien</h2>

                    <div className="field">
                        <label>Photos de l'appartement <span className="required"> *</span> :</label>
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
                        <div style={{ color: "red", fontSize: "12px" }}>
                            {errors.photos}
                        </div>
                    )}
                    <p className="hint">Ajoutez entre 3 et 15 photos (JPEG, PNG · max 5 Mo chacune)</p>

                    <button
                        type="button"
                        className="btn-choose-files"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Choisir des fichiers
                    </button>
                    {photos.length > 0 && (
                        <div className="photo-grid">
                            {photos.map((photo, idx) => (
                                <div key={idx} className="photo-thumb">
                                    <img src={photo.url} alt={`photo-${idx}`} />
                                    <button type="button" onClick={() => removePhoto(idx)}>×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── Submit ── */}
                <div className="submit-row">
                    <button type="button" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Création en cours..." : "Mettre mon Appartement en Location"}
                    </button>
                </div>
            </div>
        </>
    );
}

export default AddAppartement;