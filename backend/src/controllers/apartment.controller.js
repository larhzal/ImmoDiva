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
            dureeUnit,
            animaux,
            fumeurs,
            colocataires,
            owner_id,
        } = req.body;

        const profilLocataire = JSON.parse(req.body.profilLocataire);
        const files = req.files;

        let photoUrls = [];

        // 👉 1. Upload images
        for (const file of files) {
            const fileName = `${Date.now()}-${file.originalname}`;

            const { error } = await supabase.storage
                .from("appartements")
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype
                });

            if (error) throw error;

            photoUrls.push({
                file_path: fileName,
                file_name: file.originalname,
                file_size: file.size,
                file_mime: file.mimetype
            });
        }

        // 👉 2. Insert apartment
        const { data: apartmentData, error: apartmentError } = await supabase
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
                elevator: ascenseur === "true",
                parking: parking === "true",
                pool: piscine === "true",
                furnitured: meuble === "true",
                balcony: balcon === "true",
                concierge: gardien === "true",
                monthly_price: prixMensuel,
                charges_included: chargesIncluses === "true",
                animals_accepted: animaux === "true",
                deposit_required: caution,
                rommates_accepted: colocataires === "true",
                rental_min_duration: dureeMini,
                rental_duration_unit: dureeUnit,
                smokers_accepted: fumeurs === "true",
                roomer_profil_desired: profilLocataire,
                owner_id: owner_id,
            }])
            .select()
            .single();

        if (apartmentError) throw apartmentError;

        const apartmentId = apartmentData.id;

        // 👉 3. Insert pictures
        const picturesToInsert = photoUrls.map((photo) => ({
            apartment_id: apartmentId,
            file_path: photo.file_path,
            file_name: photo.file_name,
            file_size: photo.file_size,
            file_mime: photo.file_mime
        }));

        const { error: picturesError } = await supabase
            .from("Pictures")
            .insert(picturesToInsert);

        if (picturesError) throw picturesError;

        
        return res.status(201).json({
            message: "Apartment created with photos ✅",
            data: apartmentData
        });

    } catch (err) {
        console.error("FULL ERROR:", err);
        res.status(500).json({
            error: err.message,
            details: err
        });
    }
};

module.exports = { createAppartement };