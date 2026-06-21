"use client";

export default function AnnouncementBar() {
  const messages = [
    "🎬 Κάννες 2026: Ανακοινώθηκαν οι πρώτες ταινίες της επίσημης επιλογής",
    "🏆 Poor Things: Βραβεύτηκε με 4 Oscar σε μια μαγευτική βραδιά",
    "🎥 Νέα ταινία Νόλαν ανακοινώθηκε για το 2027",
    "⭐ Το Past Lives ορίστηκε ως η καλύτερη ταινία της δεκαετίας από το Cahiers du Cinéma",
    "📽️ Scorsese: Νέο project ανακοίνωσε ο δάσκαλος",
  ];

  return (
    <div className="bg-zinc-900 text-white text-xs py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="mx-8">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
