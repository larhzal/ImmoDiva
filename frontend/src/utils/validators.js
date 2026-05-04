// validators.js

export const validateAppartementForm = (fields) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(fields).forEach(field => {
         if (field === "dureeMini" || field === "dureeUnit") return;
        const value = fields[field];

        if (Array.isArray(value)) {
            if (value.length === 0) {
                newErrors[field] = "Ce champ est obligatoire";
                isValid = false;
            }
        } else if (!value || value.toString().trim() === "") {
            newErrors[field] = "Ce champ est obligatoire";
            isValid = false;
        }
    });

    if (!fields.dureeMini || fields.dureeMini.toString().trim() === "") {
        newErrors.dureeMini = "Durée obligatoire";
        isValid = false;
    }

    if (!fields.dureeUnit || fields.dureeUnit.trim() === "") {
        newErrors.dureeUnit = "Unité obligatoire";
        isValid = false;
    }

    console.log(fields);
    return { isValid, errors: newErrors };
};