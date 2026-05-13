const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");

// Supabase (use SERVICE ROLE here 🔥)
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// GET pending annonces
router.get("/", async (req, res) => {
    const { data, error } = await supabase
        .from("Apartment")
        .select("*")
        .eq("status", "En Attente")
        .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error });

    res.json(data);
});

// VALIDATE
router.put("/:id/validate", async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Apartment ID:", id);

        // GET APARTMENT
        const { data: apartment, error: apartmentError } = await supabase
            .from("Apartment")
            .select("*")
            .eq("id", id)
            .single();

        console.log("Apartment:", apartment);

        if (apartmentError) {
            console.log("Apartment error:", apartmentError);
            return res.status(500).json({ error: apartmentError.message });
        }

        // UPDATE STATUS
        const { error: updateError } = await supabase
            .from("Apartment")
            .update({ status: "Acceptée" })
            .eq("id", id);

        if (updateError) {
            console.log("Update error:", updateError);
            return res.status(500).json({ error: updateError.message });
        }

        // GET USER
        const { data: userData, error: userError } =
            await supabase.auth.admin.getUserById(apartment.owner_id);

        console.log("User data:", userData);

        if (userError) {
            console.log("User error:", userError);
            return res.status(500).json({ error: userError.message });
        }

        const email = userData.user.email;

        console.log("EMAIL:", email);

        // SEND EMAIL
        const info = await transporter.sendMail({
            from: `"ImmoDiva" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Appartement accepté",
            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    border: 1px solid #e5e5e5;
                    border-radius: 10px;
                ">
                    <h2 style="color: green; font-weight: bold; text-align: center;">
                        Votre appartement a été accepté! 
                    </h2>

                    <p>
                        Félicitations ! Votre appartement 
                        <strong>
                          ${apartment.title}
                        </strong>
                        a été <strong style="color: green;">accepté</strong>.
                    </p>

                    <p style="color:gray; font-size:12px; text-align: center; margin-top: 30px;">
                        ImmoDiva - Plateforme de location immobilière
                    </p>
                </div>
            `
        });


        console.log("Mail sent:", info);

        res.json({
            message: "Appartement validé"
        });

    } catch (err) {
        console.log("SERVER ERROR:", err);
        res.status(500).json({
            error: err.message
        });
    }
});

// REJECT
router.put("/:id/reject", async (req, res) => {
    const { id } = req.params;

    try {
        const { data: apartment, error: apartmentError } = await supabase
            .from("Apartment")
            .select("*")
            .eq("id", id)
            .single();

        if (apartmentError) {
            return res.status(500).json({ error: apartmentError.message });
        }

        const { error: updateError } = await supabase
            .from("Apartment")
            .update({ status: "Rejetée" })
            .eq("id", id);

        if (updateError) {
            return res.status(500).json({ error: updateError.message });
        }

        const { data: userData, error: userError } =
            await supabase.auth.admin.getUserById(apartment.owner_id);

        if (userError) {
            return res.status(500).json({ error: userError.message });
        }

        const email = userData.user.email;
        await transporter.sendMail({
            from: `"ImmoDiva" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Appartement rejeté",
            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    border: 1px solid #e5e5e5;
                    border-radius: 10px;
                ">
                    <h2 style="color: red; font-weight: bold; text-align: center;">
                        Votre appartement a été rejeté! 
                    </h2>

                    <p>
                        Nous sommes désolés, votre appartement à été rejeté!
                        <strong>
                          ${apartment.title}
                        </strong>
                        a été <strong style="color: red;">rejeté</strong>.
                    </p>

                    <p style="color:gray; font-size:12px; text-align: center; margin-top: 30px;">
                        ImmoDiva - Plateforme de location immobilière
                    </p>
                </div>
            `
        });

        console.log("Owner email:", email);

        // Send reject email here

        res.json({
            message: "Appartement rejeté",
            emailSentTo: email
        });

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