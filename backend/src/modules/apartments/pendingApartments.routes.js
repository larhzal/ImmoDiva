const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);


const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// GET pending annonces with pagination
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const PAGE_SIZE = 5;
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error, count } = await supabase
            .from("Apartment")
            .select("*", { count: "exact" })
            .eq("status", "En Attente")
            .order("created_at", { ascending: false })
            .range(from, to);

        if (error) return res.status(500).json({ error: error.message });

        res.json({
            annonces: data,
            total: count,
            totalPages: Math.ceil(count / PAGE_SIZE),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// VALIDATE
router.put("/:id/validate", async (req, res) => {
    try {
        const { id } = req.params;

        const { data: apartment, error: apartmentError } = await supabase
            .from("Apartment")
            .select("*")
            .eq("id", id)
            .single();

        if (apartmentError) return res.status(500).json({ error: apartmentError.message });

        const { error: updateError } = await supabase
            .from("Apartment")
            .update({ status: "Acceptée" })
            .eq("id", id);

        if (updateError) return res.status(500).json({ error: updateError.message });

        try {
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(apartment.owner_id);
            if (!userError) {
                const email = userData.user.email;
                const info = transporter.sendMail({
                    from: `"ImmoDiva" <${process.env.MAIL_USER}>`,
                    to: email,
                    subject: "Appartement accepté",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
                            <h2 style="color: green; font-weight: bold; text-align: center;">
                                Votre appartement a été accepté! 
                            </h2>
                            <p>
                                Félicitations ! Votre appartement 
                                <strong>${apartment.title}</strong>
                                a été <strong style="color: green;">accepté</strong>.
                            </p>
                            <p style="color:gray; font-size:12px; text-align: center; margin-top: 30px;">
                                ImmoDiva - Plateforme de location immobilière
                            </p>
                        </div>
                    `
                });
                console.log("Mail sent:", info);
            }
        } catch (mailErr) {
            console.log("Email non envoyé:", mailErr.message);
        }

        res.json({ message: "Appartement validé" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REJECT
router.put("/:id/reject", async (req, res) => {
    try {
        const { id } = req.params;

        const { data: apartment, error: apartmentError } = await supabase
            .from("Apartment")
            .select("*")
            .eq("id", id)
            .single();

        if (apartmentError) return res.status(500).json({ error: apartmentError.message });

        const { error: updateError } = await supabase
            .from("Apartment")
            .update({ status: "Rejetée" })
            .eq("id", id);

        if (updateError) return res.status(500).json({ error: updateError.message });

        try {
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(apartment.owner_id);
            if (!userError) {
                const email = userData.user.email;
                 transporter.sendMail({
                    from: `"ImmoDiva" <${process.env.MAIL_USER}>`,
                    to: email,
                    subject: "Appartement rejeté",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
                            <h2 style="color: red; font-weight: bold; text-align: center;">
                                Votre appartement a été rejeté! 
                            </h2>
                            <p>
                                Nous sommes désolés, votre appartement
                                <strong>${apartment.title}</strong>
                                a été <strong style="color: red;">rejeté</strong>.
                            </p>
                            <p style="color:gray; font-size:12px; text-align: center; margin-top: 30px;">
                                ImmoDiva - Plateforme de location immobilière
                            </p>
                        </div>
                    `
                });
                console.log("Owner email:", email);
            }
        } catch (mailErr) {
            console.log("Email non envoyé:", mailErr.message);
        }

        res.json({ message: "Appartement rejeté" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /apartments/stats
router.get("/stats", async (req, res) => {
    try {
        const { count: total } = await supabase
            .from("Apartment")
            .select("*", { count: "exact", head: true });

        const { count: approuvees } = await supabase
            .from("Apartment")
            .select("*", { count: "exact", head: true })
            .eq("status", "Acceptée");

        const { count: enAttente } = await supabase
            .from("Apartment")
            .select("*", { count: "exact", head: true })
            .eq("status", "En Attente");

        res.json({
            total: total || 0,
            approuvees: approuvees || 0,
            enAttente: enAttente || 0,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from("Apartment")
        .delete()
        .eq("id", id);

    if (error) return res.status(500).json({ error });

    res.json({ message: "Appartement supprimé" });
});

module.exports = router;