import { useState, useRef } from "react";
import "../../styles/publisher/addAppartement.css";

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
    const [animaux, setAnimaux] = useState("");
    const [fumeurs, setFumeurs] = useState("");
    const [colocataires, setColocataires] = useState("");
    const [profilLocataire, setProfilLocataire] = useState([]);
    const [photos, setPhotos] = useState([]);

    const fileInputRef = useRef(null);

    const [errors, setErrors] = useState({}); // Tracks which fields are missing
    const [formError, setFormError] = useState(""); // Top-level message

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
        try {

            // ***********************************************************************************
            // ***********************************************************************************
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
            formData.append("animaux", animaux);
            formData.append("fumeurs", fumeurs);
            formData.append("colocataires", colocataires);
            formData.append("profilLocataire", JSON.stringify(profilLocataire));
            formData.append("owner_id", "1");

            // 👉 images (IMPORTANT)
            photos.forEach((photo) => {
                formData.append("photos", photo.file);
            });

            const response = await fetch("http://localhost:5000/api/appartements", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            console.log(data);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="add-appartement">
                <h1>Ajouter une Appartement</h1>

                {/* ── Informations sur le bien ── */}
                <section>
                    <h2>Informations sur le bien</h2>

                    <div className="two-cols">
                        <div className="field">
                            <label>Titre <span className="required"> *</span> : </label>
                            <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Ville <span className="required"> *</span> :</label>
                            <input type="text" value={ville} onChange={(e) => setVille(e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Description <span className="required"> *</span> :</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Adresse <span className="required"> *</span> :</label>
                            <textarea value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Surface en m² <span className="required"> *</span> :</label>
                            <input type="number" value={surface} onChange={(e) => setSurface(e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Nombre de chambres <span className="required"> *</span> :</label>
                            <input type="number" value={nbChambres} onChange={(e) => setNbChambres(e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Étage <span className="required"> *</span> :</label>
                            <input type="number" value={etage} onChange={(e) => setEtage(e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Nombre de salles de bain <span className="required"> *</span> :</label>
                            <input type="number" value={nbSallesBain} onChange={(e) => setNbSallesBain(e.target.value)} />
                        </div>
                    </div>

                    <div className="two-cols radios">
                        <div className="radio-field">
                            <label>Présence d'ascenseur <span className="required"> *</span> :</label>
                            <label><input type="radio" name="ascenseur" value="oui" checked={ascenseur === "oui"} onChange={() => setAscenseur("oui")} /> Oui</label>
                            <label><input type="radio" name="ascenseur" value="non" checked={ascenseur === "non"} onChange={() => setAscenseur("non")} /> Non</label>
                        </div>
                        <div className="radio-field">
                            <label>Parking <span className="required"> *</span> :</label>
                            <label><input type="radio" name="parking" value="oui" checked={parking === "oui"} onChange={() => setParking("oui")} /> Oui</label>
                            <label><input type="radio" name="parking" value="non" checked={parking === "non"} onChange={() => setParking("non")} /> Non</label>
                        </div>
                        <div className="radio-field">
                            <label>Meublé <span className="required"> *</span> :</label>
                            <label><input type="radio" name="meuble" value="oui" checked={meuble === "oui"} onChange={() => setMeuble("oui")} /> Oui</label>
                            <label><input type="radio" name="meuble" value="non" checked={meuble === "non"} onChange={() => setMeuble("non")} /> Non</label>
                        </div>
                        <div className="radio-field">
                            <label>Piscine <span className="required"> *</span> :</label>
                            <label><input type="radio" name="piscine" value="oui" checked={piscine === "oui"} onChange={() => setPiscine("oui")} /> Oui</label>
                            <label><input type="radio" name="piscine" value="non" checked={piscine === "non"} onChange={() => setPiscine("non")} /> Non</label>
                        </div>
                        <div className="radio-field">
                            <label>Balcon/ Terasse <span className="required"> *</span> :</label>
                            <label><input type="radio" name="balcon" value="oui" checked={balcon === "oui"} onChange={() => setBalcon("oui")} /> Oui</label>
                            <label><input type="radio" name="balcon" value="non" checked={balcon === "non"} onChange={() => setBalcon("non")} /> Non</label>
                        </div>
                        <div className="radio-field">
                            <label>Gardien/ Concierge <span className="required"> *</span> :</label>
                            <label><input type="radio" name="gardien" value="oui" checked={gardien === "oui"} onChange={() => setGardien("oui")} /> Oui</label>
                            <label><input type="radio" name="gardien" value="non" checked={gardien === "non"} onChange={() => setGardien("non")} /> Non</label>
                        </div>
                    </div>
                </section>

                {/* ── Conditions de location ── */}
                <section>
                    <h2>Conditions de location</h2>

                    <div className="two-cols">
                        <div className="field">
                            <label>Prix mensuel en MAD <span className="required"> *</span> :</label>
                            <input type="number" value={prixMensuel} onChange={(e) => setPrixMensuel(e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Caution demandée <span className="required"> *</span> :</label>
                            <input type="number" value={caution} onChange={(e) => setCaution(e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Durée minimum de location <span className="required"> *</span> :</label>
                            <input type="text" value={dureeMini} onChange={(e) => setDureeMini(e.target.value)} placeholder="ex: 6 mois" />
                        </div>
                    </div>

                    <div className="two-cols radios">
                        <div className="radio-field">
                            <label>Charges incluses <span className="required"> *</span> :</label>
                            <label><input type="radio" name="charges" value="oui" checked={chargesIncluses === "oui"} onChange={() => setChargesIncluses("oui")} /> Oui</label>
                            <label><input type="radio" name="charges" value="non" checked={chargesIncluses === "non"} onChange={() => setChargesIncluses("non")} /> Non</label>
                        </div>
                        <div className="radio-field">
                            <label>Fumeurs acceptés <span className="required"> *</span> :</label>
                            <label><input type="radio" name="fumeurs" value="oui" checked={fumeurs === "oui"} onChange={() => setFumeurs("oui")} /> Oui</label>
                            <label><input type="radio" name="fumeurs" value="non" checked={fumeurs === "non"} onChange={() => setFumeurs("non")} /> Non</label>
                        </div>
                        <div className="radio-field">
                            <label>Animaux acceptés <span className="required"> *</span> :</label>
                            <label><input type="radio" name="animaux" value="oui" checked={animaux === "oui"} onChange={() => setAnimaux("oui")} /> Oui</label>
                            <label><input type="radio" name="animaux" value="non" checked={animaux === "non"} onChange={() => setAnimaux("non")} /> Non</label>
                        </div>
                        <div className="radio-field">
                            <label>Colocataires acceptés <span className="required"> *</span> :</label>
                            <label><input type="radio" name="colocataires" value="oui" checked={colocataires === "oui"} onChange={() => setColocataires("oui")} /> Oui</label>
                            <label><input type="radio" name="colocataires" value="non" checked={colocataires === "non"} onChange={() => setColocataires("non")} /> Non</label>
                        </div>
                    </div>

                    <div className="radio-field">
                        <label>Profil locataire souhaité <span className="required"> *</span> :</label>
                        {["Famille", "Couple", "Célibataire", "Étudiant"].map((p) => (
                            <label key={p}>
                                <input
                                    type="checkbox"
                                    checked={profilLocataire.includes(p)}
                                    onChange={() => handleProfil(p)}
                                />
                                {" "}{p}
                            </label>
                        ))}
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
                        />
                    </div>
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
                <div className="submit-row" type="button" onClick={handleSubmit}>
                    <button type="button">Mettre mon Appartement en Location</button>
                </div>
            </div>
        </>
    );
}

export default AddAppartement;