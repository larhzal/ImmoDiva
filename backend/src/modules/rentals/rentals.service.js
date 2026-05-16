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

// recuperer les demandes 
//fonction pour recuperer les denmandes recues
exports.getDemandesRecues = async (publisherId) => {
  const { data, error } = await supabase
    .from('sent_request')
    .select(`
      id,
      created_at,
      response,
      statut,
      profil,
      date_emmenagement,
      duree_location,
      presentation,
      motivation,
      User (
        first_name,
        last_name
      ),
      Apartment!inner (
        id,
        title,
        address,
        owner_id,
        Pictures:Pictures(
          file_path
        )
      )
    `)
    .eq('Apartment.owner_id', publisherId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}
//repondre a le demande de location d'un client
exports.repondreDemande = async (id, response) => {
  const { data, error } = await supabase
    .from('sent_request')
    .update({ response })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

exports.getDemandeById = async (id) => {
  // on recupere tous d'abord les infos de la demande, de l'appartement comcerne et de client
  const { data, error } = await supabase
    .from("sent_request")
    .select(`
      *,
      Apartment:apartment_id (
        id,
        title,
        city,
        address,
        monthly_price,
        Pictures:Pictures(file_path)
      ),
      User:client_id (
        id,
        first_name,
        last_name,
        age,
        nationality
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  // on recupere l'email de client de auth.users a travers client_id
  let email = null;

  if (data?.client_id) {
    const { data: user, error: userError } =
      await supabase.auth.admin.getUserById(data.client_id);

    if (!userError && user?.user) {
      email = user.user.email;
    }
  }

  return {
    ...data,
    email,
  };
};