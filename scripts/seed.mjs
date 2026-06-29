import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const posts = JSON.parse(
  readFileSync(join(__dirname, "../src/data/posts.json"), "utf-8")
);

const rows = posts.map((p) => ({
  id:           p.id,
  slug:         p.slug,
  title:        p.title,
  subtitle:     p.subtitle,
  excerpt:      p.excerpt,
  content:      p.content,
  author:       p.author,
  date:         p.date,
  reading_time: p.readingTime,
  genre:        p.genre,
  director:     p.director,
  year:         p.year,
  post_type:    p.postType,
  rating:       p.rating ?? null,
  image:        p.image,
  featured:     p.featured,
  tags:         p.tags,
  badge:        p.badge ?? null,
}));

const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Prefer": "resolution=merge-duplicates",
  },
  body: JSON.stringify(rows),
});

if (!res.ok) {
  const err = await res.text();
  console.error("Seed failed:", err);
  process.exit(1);
} else {
  console.log(`✓ Seeded ${rows.length} posts successfully.`);
}
