// Greek to Latin, close to ELOT 743. Two-letter combinations are handled before single letters.
const DIGRAPHS: [RegExp, string][] = [
  [/ου/g, "ou"],
  [/αι/g, "ai"],
  [/ει/g, "ei"],
  [/οι/g, "oi"],
  [/γγ/g, "ng"],
  [/γκ/g, "gk"],
  [/γχ/g, "nch"],
  [/γξ/g, "nx"],
  [/(^|[^α-ω])μπ/g, "$1b"],
  [/μπ/g, "mp"],
  // αυ / ευ / ηυ sound like "af / ef / if" before a voiceless consonant or at the end of a word
  [/([αεη])υ(?=[θκξπστφχψ]|[^α-ω]|$)/g, "$1f"],
  [/([αεη])υ/g, "$1v"],
];

const LETTERS: Record<string, string> = {
  α: "a", β: "v", γ: "g", δ: "d", ε: "e", ζ: "z", η: "i", θ: "th", ι: "i", κ: "k", λ: "l", μ: "m",
  ν: "n", ξ: "x", ο: "o", π: "p", ρ: "r", σ: "s", ς: "s", τ: "t", υ: "y", φ: "f", χ: "ch", ψ: "ps", ω: "o",
};

export function slugify(title: string): string {
  let text = title
    .toLowerCase()
    .normalize("NFD")
    // a diaeresis means the vowel is pronounced on its own (αϋ is not the "αυ" pair)
    .replace(/([ιυ])[̀-ͯ]*̈[̀-ͯ]*/g, (_, vowel) => (vowel === "ι" ? "i" : "y"))
    .replace(/[̀-ͯ]/g, ""); // drop accents

  for (const [pattern, replacement] of DIGRAPHS) text = text.replace(pattern, replacement);

  return text
    .replace(/[α-ως]/g, (letter) => LETTERS[letter] ?? "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Appends -2, -3, ... until the slug is not in `taken`.
export function uniqueSlug(title: string, taken: Iterable<string>): string {
  const used = new Set(taken);
  const base = slugify(title) || "post";
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
