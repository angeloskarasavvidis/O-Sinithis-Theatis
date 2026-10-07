import { supabase } from "@/lib/supabase";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

/** Uploads an image to the `images` storage bucket. Resolves to its public URL, or to an error message in Greek. */
export async function uploadImage(file: File): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Μη αποδεκτός τύπος αρχείου. Επιτρέπονται μόνο JPEG, PNG, WebP και GIF." };
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { error: `Το αρχείο δεν πρέπει να υπερβαίνει τα ${MAX_SIZE_MB}MB.` };
  }

  const ext = file.name.split(".").pop();
  // the random part keeps files uploaded in the same millisecond apart
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from("images").upload(path, file, { upsert: true });
  if (error) return { error: error.message };

  return { url: supabase.storage.from("images").getPublicUrl(path).data.publicUrl };
}
