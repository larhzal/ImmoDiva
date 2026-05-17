const { supabaseAdmin: supabase } = require("../../config/db");
const {
    uploadPhotos,
    insertApartment,
    insertPictures,
    fetchApartmentById,
    fetchAllApartments,
    fetchApartmentsByOwner,
    fetchMyClients,
    updateApartmentRecord,
    deleteStorageFiles,
    deletePictureRecords,
    fetchPicturesByApartment,
    deleteApartmentRecord,
} = require("./apartments.service");

// ─────────────────────────────────────────────
// POST /api/appartements
// ─────────────────────────────────────────────
const createAppartement = async (req, res) => {
    try {
        const fields = req.body;
        const profilLocataire = JSON.parse(fields.profilLocataire);
        const files = req.files;

        // 👇 THIS is what you were missing
        const ownerId = req.user?.id;

        if (!ownerId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const photoUrls = await uploadPhotos(files);

        // ✅ pass ownerId correctly
        const apartmentData = await insertApartment(
            fields,
            profilLocataire,
            ownerId
        );

        await insertPictures(apartmentData.id, photoUrls);

        return res.status(201).json({
            message: "Apartment created with photos ✅",
            data: apartmentData,
        });

    } catch (err) {
        console.error("createAppartement ERROR:", err);
        res.status(500).json({ error: err.message, details: err });
    }
};

// ─────────────────────────────────────────────
// GET /api/appartements/:id
// ─────────────────────────────────────────────
const getAppartement = async (req, res) => {
    try {
        const { id } = req.params;
        const apartment = await fetchApartmentById(id);

        if (!apartment) {
            return res.status(404).json({ error: "Apartment not found" });
        }

        return res.status(200).json({ data: apartment });
    } catch (err) {
        console.error("getAppartement ERROR:", err);
        res.status(500).json({ error: err.message, details: err });
    }
};

// ─────────────────────────────────────────────
// GET /api/appartements
// ─────────────────────────────────────────────
const getAllAppartements = async (req, res) => {
    try {
        const apartments = await fetchAllApartments();
        return res.status(200).json({ data: apartments });
    } catch (err) {
        console.error("getAllAppartements ERROR:", err);
        res.status(500).json({ error: err.message, details: err });
    }
};

// ─────────────────────────────────────────────
// PUT /api/appartements/:id
// ─────────────────────────────────────────────
const updateAppartement = async (req, res) => {
    try {
        const { id } = req.params;
        const fields = req.body;
        const profilLocataire = JSON.parse(fields.profilLocataire);
        const newFiles = req.files ?? [];

        // IDs of existing pictures the client wants removed
        const deletedPhotoIds = fields.deletedPhotoIds
            ? JSON.parse(fields.deletedPhotoIds)
            : [];

        // 1. If any existing photos were removed, delete from storage + DB
        if (deletedPhotoIds.length > 0) {
            // Fetch file_path values for the pictures to delete
            const { data: picRows, error: fetchPicError } = await supabase
                .from("Pictures")
                .select("id, file_path")
                .in("id", deletedPhotoIds);

            if (fetchPicError) throw fetchPicError;

            const filePaths = picRows.map((p) => p.file_path);

            // Remove files from Supabase Storage
            await deleteStorageFiles(filePaths);

            // Remove rows from Pictures table
            await deletePictureRecords(deletedPhotoIds);
        }

        // 2. Upload newly added photos (if any)
        if (newFiles.length > 0) {
            const newPhotoUrls = await uploadPhotos(newFiles);
            await insertPictures(id, newPhotoUrls);
        }

        // 3. Update the Apartment row
        const updatedApartment = await updateApartmentRecord(id, fields, profilLocataire);

        return res.status(200).json({
            message: "Apartment updated",
            data: updatedApartment,
        });
    } catch (err) {
        console.error("updateAppartement ERROR:", err);
        res.status(500).json({ error: err.message, details: err });
    }
};

// ─────────────────────────────────────────────
// GET /api/apartments/my
// ─────────────────────────────────────────────
const getMyApartments = async (req, res) => {
    try {
        const ownerId = req.user.id; // injected by your auth middleware
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 7;

        const result = await fetchApartmentsByOwner(ownerId, page, limit);

        return res.status(200).json(result);
    } catch (err) {
        console.error("getMyApartments ERROR:", err);
        res.status(500).json({ error: err.message, details: err });
    }
};

// ─────────────────────────────────────────────
// GET /api/clients/my
// ─────────────────────────────────────────────
const getMyClients = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 7;

        const result = await fetchMyClients(ownerId, page, limit);

        return res.status(200).json(result);
    } catch (err) {
        console.error("getMyClients ERROR:", err);
        res.status(500).json({ error: err.message, details: err });
    }
};


// ─────────────────────────────────────────────
// DELETE /api/appartements/:id
// ─────────────────────────────────────────────
const deleteAppartement = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Fetch all pictures linked to this apartment
        const pictures = await fetchPicturesByApartment(id);

        if (pictures.length > 0) {
            const filePaths = pictures.map((p) => p.file_path);
            const pictureIds = pictures.map((p) => p.id);

            // 2. Delete files from Supabase Storage
            await deleteStorageFiles(filePaths);

            // 3. Delete picture rows from DB
            await deletePictureRecords(pictureIds);
        }

        // 4. Delete the apartment row itself
        await deleteApartmentRecord(id);

        return res.status(200).json({ message: "Apartment deleted successfully ✅" });
    } catch (err) {
        console.error("deleteAppartement ERROR:", err);
        res.status(500).json({ error: err.message, details: err });
    }
};

module.exports = {
    createAppartement,
    getAppartement,
    getAllAppartements,
    updateAppartement,
    getMyApartments,
    getMyClients,
    deleteAppartement,
};
