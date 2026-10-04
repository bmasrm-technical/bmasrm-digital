import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  // Check if user exists in public.admins table (RLS policy allows admin to read own row)
  const { data: adminRecord, error: adminError } = await supabase
    .from("admins")
    .select("user_id, email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminRecord) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return { user, admin: adminRecord, supabase };
}
