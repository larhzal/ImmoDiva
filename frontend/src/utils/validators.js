// utils/validators.js

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
    if (fields.photos.length < 3) {
        newErrors.photos = "Veuillez ajouter au moins 3 photos";
        isValid = false;
    }

    if (fields.photos.length > 15) {
        newErrors.photos = "Maximum 15 photos autorisées";
        isValid = false;
    }
    console.log(fields);
    return { isValid, errors: newErrors };
};

// ── Reusable password rule (used by multiple keys below) ──────
const passwordRule = (value) => {
  if (!value || value.length === 0) return "Le mot de passe est obligatoire.";
  if (value.length < 8)             return "Le mot de passe doit contenir au moins 8 caractères.";
  if (value.length > 128)           return "Le mot de passe ne peut pas dépasser 128 caractères.";
  if (!/[A-Z]/.test(value))         return "Le mot de passe doit contenir au moins une majuscule.";
  if (!/[0-9]/.test(value))         return "Le mot de passe doit contenir au moins un chiffre.";
  return null;
};

const validators = {

  nom: (value) => {
    if (!value || value.trim().length < 2)  return "Le nom doit contenir au moins 2 caractères.";
    if (value.trim().length > 50)           return "Le nom ne peut pas dépasser 50 caractères.";
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value)) return "Le nom ne peut contenir que des lettres.";
    return null;
  },

  prenom: (value) => {
    if (!value || value.trim().length < 2)  return "Le prénom doit contenir au moins 2 caractères.";
    if (value.trim().length > 50)           return "Le prénom ne peut pas dépasser 50 caractères.";
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value)) return "Le prénom ne peut contenir que des lettres.";
    return null;
  },

  email: (value) => {
    if (!value || value.trim().length === 0)          return "L'email est obligatoire.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))   return "L'adresse email n'est pas valide.";
    if (value.length > 100)                           return "L'email ne peut pas dépasser 100 caractères.";
    return null;
  },

  tel: (value) => {
    if (!value || value.trim().length === 0) return null; // optional
    if (!/^\+?[\d\s\-()]+$/.test(value))     return "Le numéro de téléphone n'est pas valide.";
    const digits = value.replace(/\D/g, "");
    if (digits.length < 8)  return "Le numéro de téléphone doit contenir au moins 8 chiffres.";
    if (digits.length > 15) return "Le numéro de téléphone ne peut pas dépasser 15 chiffres.";
    return null;
  },

  age: (value) => {
    if (!value && value !== 0) return null; // optional
    const num = Number(value);
    if (isNaN(num))              return "L'âge doit être un nombre.";
    if (!Number.isInteger(num))  return "L'âge doit être un nombre entier.";
    if (num < 1 || num > 120)    return "L'âge doit être compris entre 1 et 120.";
    return null;
  },

  nationalite: (value) => {
    if (!value || value.trim().length === 0)  return null; // optional
    if (value.trim().length < 2)              return "La nationalité doit contenir au moins 2 caractères.";
    if (value.trim().length > 50)             return "La nationalité ne peut pas dépasser 50 caractères.";
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value))  return "La nationalité ne peut contenir que des lettres.";
    return null;
  },

  username: (value) => {
    if (!value || value.trim().length === 0) return null; // optional
    if (value.trim().length < 3)  return "Le nom d'utilisateur doit contenir au moins 3 caractères.";
    if (value.trim().length > 30) return "Le nom d'utilisateur ne peut pas dépasser 30 caractères.";
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores.";
    return null;
  },

  // ── Password field keys — must match the `name` props in your JSX ──
  password:  passwordRule,   // generic fallback / registration forms
  newPass:   passwordRule,   // name="newPass"  in the profile password section
  confirm:   passwordRule,   // name="confirm"  — also checked for match in the handler
  // "current" is intentionally left without format validation:
  // the server will reject a wrong current password; we only check it's non-empty.
  current: (value) => {
    if (!value || value.trim().length === 0) return "Veuillez saisir votre mot de passe actuel.";
    return null;
  },

};

// ── Validate an entire form object at once ────────────────────
// Returns { fieldName: errorMessage } — empty object means no errors.
export const validateForm = (fields) => {
  const errors = {};
  Object.keys(fields).forEach((key) => {
    if (validators[key]) {
      const error = validators[key](fields[key]);
      if (error) errors[key] = error;
    }
  });
  return errors;
};

export default validators;
