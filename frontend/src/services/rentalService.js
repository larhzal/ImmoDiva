import axiosClient from "../api/axiosClient";
// envoyer une demande de location
export const createDemandeLocation = async (formData) => {
  return await axiosClient.post("/rentals", formData);
};


// Récupérer les demandes reçues par le publicateur
export const getDemandesRecues = async () => {
  const res = await axiosClient.get("/rentals/received")
  return res.data;
};

export const getDemandeById= async (requestId) =>{
  const res = await axiosClient.get(`/rentals/${requestId}`)
  return res.data
}

// mise à jour du statut (accepté ou refusé)
export const updateRequestStatus = async (requestId, statut) => {
  const url =
    statut === "accepted"
      ? `/rentals/${requestId}/accept`
      : `/rentals/${requestId}/refuse`;

  const res = await axiosClient.patch(url);
  return res.data;
};