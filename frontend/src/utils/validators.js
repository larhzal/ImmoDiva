// validators.js

export const validateAppartementForm = (fields) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(fields).forEach(field => {
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

    return { isValid, errors: newErrors };
};