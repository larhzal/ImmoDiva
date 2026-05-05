const { data } = require('react-router-dom')
const supabase = require('../../config/db')


// Envoyer une demande de location
exports.add_request = async (donnees) => {
  const { data, error } = await supabase
    .from('sent_request')
    .insert([donnees])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

//fonction pour recuperer l'email de publicateur de l'apartement dont on a envoyer la demande de location
exports.getOwnerEmailByApartmentId = async (apartmentId) => {
//recuperation de l'id de proprietaire de l'appartement de table appartement
  const { data: apartment, error: aptError } = await supabase
    .from("Apartment")
    .select("owner_id")
    .eq("id", apartmentId)
    .single();

  if (aptError) throw aptError;

  if (!apartment?.owner_id) {
    throw new Error("owner_id introuvable pour cet appartement");
  }
//recuperer l'email de table auth.users 
  const { data, error: userError } =
    await supabase.auth.admin.getUserById(apartment.owner_id);

  if (userError) throw userError;

  if (!data?.user?.email) {
    throw new Error("Email du propriétaire introuvable");
  }

  return data.user.email;
};