// The lit "ΚΟΥΙΖ" sign of the quiz section: a black board with a row of blinking bulbs above and below.
const BULBS = Array.from({ length: 22 }, (_, i) => i);

function BulbRow() {
  return (
    <div className="flex justify-between gap-1" aria-hidden="true">
      {BULBS.map((i) => (
        <span
          key={i}
          className={`w-2 h-2 shrink-0 rounded-full bg-[#FFF6D6] shadow-[0_0_0_3.5px_rgba(255,224,138,0.28)] sign-bulb ${i % 2 ? "sign-bulb-alt" : ""}`}
        />
      ))}
    </div>
  );
}

export default function QuizSign({ small = false }: { small?: boolean }) {
  return (
    <div className={`bg-black flex flex-col max-w-full ${small ? "gap-2 px-4 py-3" : "gap-2.5 px-6 py-4"}`}>
      <BulbRow />
      <p className={`font-display uppercase font-black text-center leading-[0.85] tracking-wider text-[#FFD60A] px-2 ${small ? "text-5xl" : "text-7xl md:text-9xl"}`}>
        Κουίζ
      </p>
      <BulbRow />
    </div>
  );
}
