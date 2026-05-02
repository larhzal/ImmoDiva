const supabase = require("../config/db");

const createAppartement = async (req, res) => {
    try {
        const {
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
            animaux,
            fumeurs,
            colocataires,
            owner_id,
        } = req.body;
        const profilLocataire = JSON.parse(req.body.profilLocataire);
        const files = req.files;

        let photoUrls = [];

        for (const file of files) {
            const fileName = `${Date.now()}-${file.originalname}`;

            const { error } = await supabase.storage
                .from("appartements")
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype
                });

            if (error) throw error;

            const { data } = supabase.storage
                .from("appartements")
                .getPublicUrl(fileName);

            photoUrls.push(data.publicUrl);
        }

        // 👉 1. Insert appartement
        const { data, error } = await supabase
            .from("Apartment")
            .insert([{
                title: titre,
                city: ville,
                description: description,
                surface: surface,
                address: adresse,
                number_rooms: nbChambres,
                number_bathrooms: nbSallesBain,
                floor: etage,
                elevator: ascenseur === "oui",
                parking: parking === "oui",
                pool: piscine === "oui",
                furnitured: meuble === "oui",
                balcony: balcon === "oui",
                concierge: gardien === "oui",
                monthly_price: prixMensuel,
                charges_included: chargesIncluses === "oui",
                animals_accepted: animaux === "oui",
                deposit_required: caution,
                rommates_accepted: colocataires === "oui",
                rental_min_duration: dureeMini,
                smokers_accepted: fumeurs === "oui",
                roomer_profil_desired: profilLocataire,
                photos: photoUrls,
                owner_id: owner_id,
            }])
            .select();

        if (error) throw error;

        return res.status(201).json({
            message: "Apartement created ✅",
            data
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { createAppartement };