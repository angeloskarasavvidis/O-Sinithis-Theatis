"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const MAX_SIZE_MB = 5;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Μη αποδεκτός τύπος αρχείου. Επιτρέπονται μόνο JPEG, PNG, WebP και GIF.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Το αρχείο δεν πρέπει να υπερβαίνει τα ${MAX_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);
    setError("");

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(path);
    onChangeRef.current(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... ή ανέβασε φωτογραφία →"
          className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-[#009DF8] bg-zinc-50"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 text-white text-sm rounded-lg hover:bg-[#009DF8] transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Ανέβασμα…" : "Επιλογή"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="preview" className="h-24 w-full object-cover rounded-lg border border-zinc-200" />
      )}
    </div>
  );
}
