"use server";

import { createServerSupabaseClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

async function ensureAuth() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");
  return supabase;
}

function formatDbError(error: any): { success: false; error: string } {
  console.error("Database action error:", error);
  if (error.code === "23505") {
    // Unique violation constraint
    const msg = error.message || "";
    const detail = error.details || "";
    if (msg.includes("projects_slug_key") || detail.includes("slug")) {
      return { success: false, error: "A project with this slug already exists. Please choose a unique title or slug." };
    }
    if (msg.includes("notes_slug_key") || detail.includes("slug")) {
      return { success: false, error: "A note with this slug already exists. Please choose a unique title or slug." };
    }
    return { success: false, error: "A record with this unique identifier already exists." };
  }
  return { success: false, error: error.message || "An unexpected database error occurred." };
}

export async function updatePersonal(data: any) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("personal").upsert({ id: "1", ...data });
    if (error) return formatDbError(error);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function upsertProject(data: any) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("projects").upsert(data);
    if (error) return formatDbError(error);
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${data.slug}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function deleteProject(id: string) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return formatDbError(error);
    revalidatePath("/");
    revalidatePath("/projects");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function upsertExperience(data: any) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("experience").upsert(data);
    if (error) return formatDbError(error);
    revalidatePath("/");
    revalidatePath("/resume");
    revalidatePath("/about");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function deleteExperience(id: string) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) return formatDbError(error);
    revalidatePath("/");
    revalidatePath("/resume");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function upsertFocusArea(data: any) {
  try {
    const supabase = await ensureAuth();
    
    // If this area is being set as current, unset others first
    if (data.is_current) {
      await supabase.from("focus_areas").update({ is_current: false }).neq("id", data.id || "00000000-0000-0000-0000-000000000000");
    }

    const { error } = await supabase.from("focus_areas").upsert(data);
    if (error) return formatDbError(error);
    revalidatePath("/");
    revalidatePath("/focus");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function deleteFocusArea(id: string) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("focus_areas").delete().eq("id", id);
    if (error) return formatDbError(error);
    revalidatePath("/");
    revalidatePath("/focus");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function upsertNote(data: any) {
  try {
    const supabase = await ensureAuth();
    const { readTime, ...rest } = data;
    const sanitizedData = {
      ...rest,
      read_time: data.read_time || readTime
    };
    const { error } = await supabase.from("notes").upsert(sanitizedData);
    if (error) return formatDbError(error);
    revalidatePath("/");
    revalidatePath("/notes");
    revalidatePath(`/notes/${data.slug}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function deleteNote(id: string) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) return formatDbError(error);
    revalidatePath("/");
    revalidatePath("/notes");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function upsertMetric(data: any) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("metrics").upsert(data);
    if (error) return formatDbError(error);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function deleteMetric(id: string) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("metrics").delete().eq("id", id);
    if (error) return formatDbError(error);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function upsertTechItem(data: any) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("tech_stack").upsert(data);
    if (error) return formatDbError(error);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function deleteTechItem(id: string) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("tech_stack").delete().eq("id", id);
    if (error) return formatDbError(error);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function upsertExpertiseItem(data: any) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("expertise").upsert(data);
    if (error) return formatDbError(error);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function deleteExpertiseItem(id: string) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("expertise").delete().eq("id", id);
    if (error) return formatDbError(error);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function upsertEducation(data: any) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("education").upsert(data);
    if (error) return formatDbError(error);
    revalidatePath("/resume");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function deleteEducation(id: string) {
  try {
    const supabase = await ensureAuth();
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) return formatDbError(error);
    revalidatePath("/resume");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function upsertPhilosophy(data: any) {
  try {
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
    if (error) return formatDbError(error);
    revalidatePath("/about");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function deletePhilosophy(id: string) {
  try {
    const supabase = await ensureAuth();
    
    // Get current philosophy from personal table
    const { data: personal } = await supabase.from("personal").select("philosophy").eq("id", "1").single();
    let currentPhilosophy = personal?.philosophy || [];
    
    currentPhilosophy = currentPhilosophy.filter((p: any) => p.id !== id);

    const { error } = await supabase.from("personal").update({ philosophy: currentPhilosophy }).eq("id", "1");
    if (error) return formatDbError(error);
    revalidatePath("/about");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function uploadImage(formData: FormData) {
  try {
    const supabase = await ensureAuth();
    const file = formData.get("file") as File;
    const bucket = (formData.get("bucket") as string) || "portfolio";
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) return { success: false, error: uploadError.message };

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { success: true, publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }
}
