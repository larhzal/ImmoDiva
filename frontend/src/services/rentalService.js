import axiosClient from "../api/axiosClient";
// envoyer une demande de location
export const createDemandeLocation = async (formData) => {
  return await axiosClient.post("/rentals", formData);
};