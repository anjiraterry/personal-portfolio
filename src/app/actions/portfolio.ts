"use server";

import { createServerSupabaseClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

async function ensureAuth() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");
  return supabase;
}

export async function updatePersonal(data: any) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("personal").upsert({ id: "1", ...data });
  if (error) throw error;
  revalidatePath("/");
  return { success: true };
}

export async function upsertProject(data: any) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("projects").upsert(data);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${data.slug}`);
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/projects");
  return { success: true };
}

export async function upsertExperience(data: any) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("experience").upsert(data);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/resume");
  revalidatePath("/about");
  return { success: true };
}

export async function deleteExperience(id: string) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/resume");
  return { success: true };
}

export async function upsertFocusArea(data: any) {
  const supabase = await ensureAuth();
  
  // If this area is being set as current, unset others first
  if (data.is_current) {
    await supabase.from("focus_areas").update({ is_current: false }).neq("id", data.id || "00000000-0000-0000-0000-000000000000");
  }

  const { error } = await supabase.from("focus_areas").upsert(data);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/focus");
  return { success: true };
}

export async function deleteFocusArea(id: string) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("focus_areas").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/focus");
  return { success: true };
}

export async function upsertNote(data: any) {
  const supabase = await ensureAuth();
  const { readTime, ...rest } = data;
  const sanitizedData = {
    ...rest,
    read_time: data.read_time || readTime
  };
  const { error } = await supabase.from("notes").upsert(sanitizedData);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/notes");
  revalidatePath(`/notes/${data.slug}`);
  return { success: true };
}

export async function deleteNote(id: string) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/notes");
  return { success: true };
}

export async function upsertMetric(data: any) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("metrics").upsert(data);
  if (error) throw error;
  revalidatePath("/");
  return { success: true };
}

export async function deleteMetric(id: string) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("metrics").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  return { success: true };
}

export async function upsertTechItem(data: any) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("tech_stack").upsert(data);
  if (error) throw error;
  revalidatePath("/");
  return { success: true };
}

export async function deleteTechItem(id: string) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("tech_stack").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  return { success: true };
}

export async function upsertExpertiseItem(data: any) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("expertise").upsert(data);
  if (error) throw error;
  revalidatePath("/");
  return { success: true };
}

export async function deleteExpertiseItem(id: string) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("expertise").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  return { success: true };
}

export async function upsertEducation(data: any) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("education").upsert(data);
  if (error) throw error;
  revalidatePath("/resume");
  return { success: true };
}

export async function deleteEducation(id: string) {
  const supabase = await ensureAuth();
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/resume");
  return { success: true };
}
export async function upsertPhilosophy(data: any) {
  const supabase = await ensureAuth();
  
  // Get current philosophy from personal table
  const { data: personal } = await supabase.from("personal").select("philosophy").eq("id", "1").single();
  let currentPhilosophy = personal?.philosophy || [];
  
  if (data.id) {
    // Update existing
    currentPhilosophy = currentPhilosophy.map((p: any) => p.id === data.id ? data : p);
  } else {
    // Add new
    const newItem = { ...data, id: Math.random().toString(36).substring(2) + Date.now() };
    currentPhilosophy = [...currentPhilosophy, newItem];
  }

  const { error } = await supabase.from("personal").update({ philosophy: currentPhilosophy }).eq("id", "1");
  if (error) throw error;
  revalidatePath("/about");
  return { success: true };
}

export async function deletePhilosophy(id: string) {
  const supabase = await ensureAuth();
  
  // Get current philosophy from personal table
  const { data: personal } = await supabase.from("personal").select("philosophy").eq("id", "1").single();
  let currentPhilosophy = personal?.philosophy || [];
  
  currentPhilosophy = currentPhilosophy.filter((p: any) => p.id !== id);

  const { error } = await supabase.from("personal").update({ philosophy: currentPhilosophy }).eq("id", "1");
  if (error) throw error;
  revalidatePath("/about");
  return { success: true };
}


export async function uploadImage(formData: FormData) {
  const supabase = await ensureAuth();
  const file = formData.get("file") as File;
  const bucket = (formData.get("bucket") as string) || "portfolio";
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { publicUrl };
}
