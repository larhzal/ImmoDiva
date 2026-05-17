const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.getOwnerEmailByApartmentId = async (apartmentId) => {
  const { data: apartment, error } = await supabase
    .from("Apartment")
    .select("owner_id")
    .eq("id", apartmentId)
    .single();

  if (error) throw error;

  const { data: userData, error: userError } =
    await supabase.auth.admin.getUserById(apartment.owner_id);

  if (userError || !userData?.user?.email) {
    throw new Error("Owner email not found");
  }

  return userData.user.email;
};