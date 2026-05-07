const { supabaseAdmin: supabase } = require("../../config/db");
// ─────────────────────────────────────────────
// Storage helpers
// ─────────────────────────────────────────────

/**
 * Upload an array of multer files to Supabase Storage.
 * Returns an array of photo metadata objects ready to insert into Pictures.
 */
const uploadPhotos = async (files) => {
    const photoUrls = [];

    for (const file of files) {
        const fileName = `${Date.now()}-${file.originalname}`;

        const { error } = await supabase.storage
            .from("appartements")
            .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (error) throw error;

        photoUrls.push({
            file_path: fileName,
            file_name: file.originalname,
            file_size: file.size,
            file_mime: file.mimetype,
        });
    }

    return photoUrls;
};

/**
 * Delete files from Supabase Storage by their file_path values.
 */
const deleteStorageFiles = async (filePaths) => {
    if (!filePaths.length) return;

    const { error } = await supabase.storage
        .from("appartements")
        .remove(filePaths);

    if (error) throw error;
};

// ─────────────────────────────────────────────
// Pictures table helpers
// ─────────────────────────────────────────────

/**
 * Insert picture rows linked to an apartment.
 */
const insertPictures = async (apartmentId, photoUrls) => {
    const rows = photoUrls.map((photo) => ({
        apartment_id: apartmentId,
        file_path: photo.file_path,
        file_name: photo.file_name,
        file_size: photo.file_size,
        file_mime: photo.file_mime,
    }));

    const { error } = await supabase.from("Pictures").insert(rows);
    if (error) throw error;
};

/**
 * Delete picture rows by their IDs.
 */
const deletePictureRecords = async (ids) => {
    if (!ids.length) return;

    const { error } = await supabase
        .from("Pictures")
        .delete()
        .in("id", ids);

    if (error) throw error;
};

// ─────────────────────────────────────────────
// Apartment table helpers
// ─────────────────────────────────────────────

/**
 * Map French form fields → English DB columns (shared by insert & update).
 */
const mapFields = (fields, profilLocataire) => ({
    title: fields.titre,
    city: fields.ville,
    description: fields.description,
    surface: fields.surface,
    address: fields.adresse,
    number_rooms: fields.nbChambres,
    number_bathrooms: fields.nbSallesBain,
    floor: fields.etage,
    elevator: fields.ascenseur === "true",
    parking: fields.parking === "true",
    pool: fields.piscine === "true",
    furnitured: fields.meuble === "true",
    balcony: fields.balcon === "true",
    concierge: fields.gardien === "true",
    monthly_price: fields.prixMensuel,
    charges_included: fields.chargesIncluses === "true",
    animals_accepted: fields.animaux === "true",
    deposit_required: fields.caution,
    rommates_accepted: fields.colocataires === "true",
    rental_min_duration: fields.dureeMini,
    rental_duration_unit: fields.dureeUnit,
    smokers_accepted: fields.fumeurs === "true",
    roomer_profil_desired: profilLocataire,
});

/**
 * Insert a new Apartment row and return the created record.
 */
const insertApartment = async (fields, profilLocataire) => {
    const row = {
        ...mapFields(fields, profilLocataire),
        owner_id: fields.owner_id,
    };

    const { data, error } = await supabase
        .from("Apartment")
        .insert([row])
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Update an existing Apartment row and return the updated record.
 */
const updateApartmentRecord = async (id, fields, profilLocataire) => {
    const { data, error } = await supabase
        .from("Apartment")
        .update({
            ...mapFields(fields, profilLocataire),
            status: "En Attente",   // ← reset status on every update
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Fetch a single apartment with its pictures by ID.
 * Returns null when not found.
 */
const fetchApartmentById = async (id) => {
    const { data, error } = await supabase
        .from("Apartment")
        .select(`
            *,
            photos:Pictures (
                id,
                file_path,
                file_name,
                file_size,
                file_mime
            )
        `)
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    // Attach public URLs for convenient frontend use
    data.photos = data.photos.map((photo) => ({
        ...photo,
        url: supabase.storage
            .from("appartements")
            .getPublicUrl(photo.file_path).data.publicUrl,
    }));

    return data;
};

/**
 * Fetch all apartments with their pictures, ordered by creation date (newest first).
 */
const fetchAllApartments = async () => {
    const { data, error } = await supabase
        .from("Apartment")
        .select(`
            *,
            photos:Pictures (
                id,
                file_path,
                file_name,
                file_size,
                file_mime
            )
        `)
        .order("created_at", { ascending: false });

    if (error) throw error;

    // Attach public URLs for each apartment's photos
    return data.map((apartment) => ({
        ...apartment,
        photos: apartment.photos.map((photo) => ({
            ...photo,
            url: supabase.storage
                .from("appartements")
                .getPublicUrl(photo.file_path).data.publicUrl,
        })),
    }));
};

/**
 * Fetch all apartments belonging to a specific owner, with pagination.
 */
const fetchApartmentsByOwner = async (ownerId, page = 1, limit = 7) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from("Apartment")
        .select(`*, photos:Pictures (id, file_path, file_name, file_size, file_mime)`,
            { count: "exact" })
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) throw error; // ✅ check error BEFORE using data

    const approved = data.filter(a => a.status === "Acceptée").length;
    const pending  = data.filter(a => a.status !== "Acceptée").length;

    return {
        apartments: data.map((apartment) => ({
            ...apartment,
            photos: apartment.photos.map((photo) => ({
                ...photo,
                url: photo.file_path.startsWith("http")
                    ? photo.file_path
                    : supabase.storage.from("appartements").getPublicUrl(photo.file_path).data.publicUrl,
            })),
        })),
        total: count,
        totalPages: Math.ceil(count / limit),
        approved,
        pending,
    };
};

/**
 * Fetch all picture rows for a given apartment ID.
 */
const fetchPicturesByApartment = async (apartmentId) => {
    const { data, error } = await supabase
        .from("Pictures")
        .select("id, file_path")
        .eq("apartment_id", apartmentId);

    if (error) throw error;
    return data;
};

/**
 * Delete an Apartment row by ID.
 */
const deleteApartmentRecord = async (id) => {
    const { error } = await supabase
        .from("Apartment")
        .delete()
        .eq("id", id);

    if (error) throw error;
};

module.exports = {
    uploadPhotos,
    deleteStorageFiles,
    insertPictures,
    deletePictureRecords,
    insertApartment,
    updateApartmentRecord,
    fetchApartmentById,
    fetchAllApartments,
    fetchApartmentsByOwner,
    fetchPicturesByApartment,
    deleteApartmentRecord,
};