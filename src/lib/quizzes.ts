// The quiz section. A quiz without `questions` is announced on the hub but cannot be played yet.

export interface QuizAnswer {
  text: string;
  /** personality quizzes: which result this answer counts towards */
  result?: string;
  /** trivia quizzes: marks the right answer */
  correct?: boolean;
}

/** Trivia quizzes: the verdict for a score of at least `min` right answers. */
export interface QuizTier {
  min: number;
  title: string;
  text: string;
}

export interface QuizQuestion {
  text: string;
  answers: QuizAnswer[];
}

export interface QuizResult {
  title: string;
  text: string;
}

export interface Quiz {
  slug: string;
  title: string;
  blurb: string;
  meta: string;
  /** background of the quiz's card on the hub; literal class names so Tailwind picks them up */
  color: string;
  isNew?: boolean;
  /** "personality": answers add up to one of `results`. "trivia": answers are right or wrong and the score picks a tier. */
  kind?: "personality" | "trivia";
  /** trivia quizzes: a line shown above every question */
  prompt?: string;
  questions?: QuizQuestion[];
  results?: Record<string, QuizResult>;
  tiers?: QuizTier[];
}

export const QUIZZES: Quiz[] = [
  {
    slug: "ti-sinefil-eisai",
    title: "Τι σινεφίλ είσαι;",
    blurb: "Οκτώ ερωτήσεις που αποκαλύπτουν αν είσαι Ταρκοφσκικός, Marvel-άκιας ή «το βιβλίο ήταν καλύτερο».",
    meta: "8 ερωτήσεις · 2 λεπτά",
    color: "bg-[#FFD60A]",
    isNew: true,
    kind: "personality",
    results: {
      tarkovsky: {
        title: "Ο Ταρκοφσκικός",
        text: "Για σένα μια ταινία αρχίζει να έχει ενδιαφέρον εκεί που οι άλλοι αρχίζουν να χασμουριούνται. Λες «υποβλητικό» χωρίς ειρωνεία και το εννοείς τις μισές φορές.",
      },
      marvel: {
        title: "Ο Marvel-άκιας",
        text: "Ξέρεις ποιος ήρωας εμφανίζεται σε ποια φάση και δεν φεύγεις ποτέ πριν σβήσει η οθόνη. Το σινεμά για σένα είναι γιορτή, και καλά κάνεις.",
      },
      book: {
        title: "Ο «το βιβλίο ήταν καλύτερο»",
        text: "Βλέπεις κάθε μεταφορά με το βιβλίο ανοιχτό στο μυαλό σου. Έχεις δίκιο πιο συχνά απ' όσο αντέχει η παρέα σου.",
      },
      usual: {
        title: "Ο Συνήθης Θεατής",
        text: "Βλέπεις ό,τι σου κάνει κέφι και δεν ζητάς συγγνώμη από κανέναν. Είσαι ο λόγος που υπάρχει αυτή η σελίδα.",
      },
    },
    questions: [
      {
        text: "Παρασκευή βράδυ. Τι βάζεις να δεις;",
        answers: [
          { text: "Τρίωρη ασπρόμαυρη ταινία με υπότιτλους που δεν διαβάζονται.", result: "tarkovsky" },
          { text: "Ό,τι έχει εκρήξεις και σκηνή μετά τους τίτλους.", result: "marvel" },
          { text: "Τη μεταφορά ενός βιβλίου, για να έχω να γκρινιάζω.", result: "book" },
          { text: "Ό,τι έχει το πρώτο πλακάκι της πλατφόρμας.", result: "usual" },
        ],
      },
      {
        text: "Η ταινία έχει ένα πλάνο επτά λεπτών με ένα χωράφι. Εσύ:",
        answers: [
          { text: "Δακρύζω. Επιτέλους σινεμά.", result: "tarkovsky" },
          { text: "Κοιτάζω το κινητό μέχρι να γίνει κάτι.", result: "marvel" },
          { text: "Σκέφτομαι ότι στο βιβλίο ήταν μισή σελίδα.", result: "book" },
          { text: "Πάω για ποπ κορν. Δεν έχασα τίποτα.", result: "usual" },
        ],
      },
      {
        text: "Σε ρωτάνε ποια είναι η αγαπημένη σου ταινία. Λες:",
        answers: [
          { text: "Κάτι που δεν έχει δει κανείς στο τραπέζι.", result: "tarkovsky" },
          { text: "Αυτή που έχω δει έντεκα φορές.", result: "marvel" },
          { text: "«Η ταινία ή το βιβλίο;»", result: "book" },
          { text: "Την τελευταία που είδα και μου άρεσε.", result: "usual" },
        ],
      },
      {
        text: "Πέφτουν οι τίτλοι τέλους. Τι κάνεις;",
        answers: [
          { text: "Μένω μέχρι το τελευταίο όνομα, από σεβασμό.", result: "tarkovsky" },
          { text: "Μένω για τη σκηνή μετά τους τίτλους.", result: "marvel" },
          { text: "Εξηγώ στην παρέα τι άλλαξαν από το πρωτότυπο.", result: "book" },
          { text: "Προσπαθώ να θυμηθώ πού πάρκαρα.", result: "usual" },
        ],
      },
      {
        text: "Ποια είναι η ιδανική διάρκεια μιας ταινίας;",
        answers: [
          { text: "Πάνω από τρεις ώρες, αλλιώς δεν προλαβαίνει να ανασάνει.", result: "tarkovsky" },
          { text: "Δυόμισι ώρες, αν έχει καλή τελική μάχη.", result: "marvel" },
          { text: "Όσο χρειάζεται για να χωρέσουν όλα τα κεφάλαια.", result: "book" },
          { text: "Ενενήντα λεπτά και σπίτι.", result: "usual" },
        ],
      },
      {
        text: "Τι λες βγαίνοντας από την αίθουσα;",
        answers: [
          { text: "«Υποβλητικό.»", result: "tarkovsky" },
          { text: "«Πότε βγαίνει το επόμενο;»", result: "marvel" },
          { text: "«Έκοψαν τον καλύτερο χαρακτήρα.»", result: "book" },
          { text: "«Καλή ήταν. Πάμε για σουβλάκι;»", result: "usual" },
        ],
      },
      {
        text: "Ποπ κορν;",
        answers: [
          { text: "Στο σινεμά δεν τρώμε. Ακούμε τη σιωπή.", result: "tarkovsky" },
          { text: "Το μεγάλο, με αναψυκτικό και νάτσος.", result: "marvel" },
          { text: "Προτιμώ ένα τσάι, όπως όταν διαβάζω.", result: "book" },
          { text: "Ναι, και έχει τελειώσει πριν από τα τρέιλερ.", result: "usual" },
        ],
      },
      {
        text: "Τι έχεις στη λίστα «θα το δω»;",
        answers: [
          { text: "Όλη τη φιλμογραφία ενός Ούγγρου σκηνοθέτη.", result: "tarkovsky" },
          { text: "Τις επόμενες δώδεκα ταινίες του ίδιου σύμπαντος.", result: "marvel" },
          { text: "Όσα θα δω αφού πρώτα διαβάσω το βιβλίο.", result: "book" },
          { text: "Μια λίστα 140 ταινιών που δεν ανοίγω ποτέ.", result: "usual" },
        ],
      },
    ],
  },
  {
    slug: "mantepse-tin-ataka",
    title: "Μάντεψε την ατάκα",
    blurb: "Μια φράση, τέσσερις ταινίες. Πόσες βρίσκεις χωρίς να γκουγκλάρεις;",
    meta: "10 ερωτήσεις · 3 λεπτά",
    color: "bg-[#34D399]",
    isNew: true,
    kind: "trivia",
    prompt: "Από ποια ταινία είναι η ατάκα;",
    tiers: [
      { min: 10, title: "Κινηματογραφική μνήμη", text: "Δέκα στις δέκα. Ή έχεις δει τα πάντα, ή έχεις πολύ καλό ίντερνετ. Σε πιστεύω." },
      { min: 7, title: "Ο σινεφίλ της παρέας", text: "Είσαι αυτός που ψιθυρίζει τις ατάκες μισό δευτερόλεπτο πριν τις πει ο ηθοποιός. Η παρέα σε αντέχει, με το ζόρι." },
      { min: 4, title: "Κυριακάτικος θεατής", text: "Τις έχεις ακούσει όλες, απλώς δεν θυμάσαι πού. Μια επανάληψη στα κλασικά δεν έβλαψε ποτέ κανέναν." },
      { min: 0, title: "Μόνο τα τρέιλερ", text: "Δεν πειράζει. Έχεις μπροστά σου δέκα σπουδαίες ταινίες να δεις για πρώτη φορά, και σε ζηλεύω λίγο." },
    ],
    questions: [
      {
        text: "«I'm gonna make him an offer he can't refuse.»",
        answers: [
          { text: "The Godfather", correct: true },
          { text: "Scarface" },
          { text: "Goodfellas" },
          { text: "Casino" },
        ],
      },
      {
        text: "«Keep your friends close, but your enemies closer.»",
        answers: [
          { text: "The Godfather" },
          { text: "The Godfather Part II", correct: true },
          { text: "The Godfather Part III" },
          { text: "Goodfellas" },
        ],
      },
      {
        text: "«You talkin' to me?»",
        answers: [
          { text: "Raging Bull" },
          { text: "Mean Streets" },
          { text: "Taxi Driver", correct: true },
          { text: "Goodfellas" },
        ],
      },
      {
        text: "«Here's Johnny!»",
        answers: [
          { text: "Psycho" },
          { text: "Misery" },
          { text: "Halloween" },
          { text: "The Shining", correct: true },
        ],
      },
      {
        text: "«Hasta la vista, baby.»",
        answers: [
          { text: "The Terminator" },
          { text: "Terminator 2: Judgment Day", correct: true },
          { text: "Predator" },
          { text: "Total Recall" },
        ],
      },
      {
        text: "«You're gonna need a bigger boat.»",
        answers: [
          { text: "Jaws", correct: true },
          { text: "Titanic" },
          { text: "The Abyss" },
          { text: "The Perfect Storm" },
        ],
      },
      {
        text: "«I love the smell of napalm in the morning.»",
        answers: [
          { text: "Platoon" },
          { text: "Full Metal Jacket" },
          { text: "Apocalypse Now", correct: true },
          { text: "The Deer Hunter" },
        ],
      },
      {
        text: "«Why so serious?»",
        answers: [
          { text: "Batman Begins" },
          { text: "Joker" },
          { text: "The Dark Knight Rises" },
          { text: "The Dark Knight", correct: true },
        ],
      },
      {
        text: "«You can't handle the truth!»",
        answers: [
          { text: "A Few Good Men", correct: true },
          { text: "JFK" },
          { text: "The Firm" },
          { text: "Philadelphia" },
        ],
      },
      {
        text: "«Here's looking at you, kid.»",
        answers: [
          { text: "Gone with the Wind" },
          { text: "Casablanca", correct: true },
          { text: "The Maltese Falcon" },
          { text: "Citizen Kane" },
        ],
      },
    ],
  },
  {
    slug: "alitheia-i-dithen",
    title: "Αλήθεια ή δήθεν;",
    blurb: "Ιστορίες από τα γυρίσματα. Κάποιες έγιναν, κάποιες τις έβγαλα από το μυαλό μου.",
    meta: "Σύντομα",
    color: "bg-[#EF4444]",
  },
  {
    slug: "poios-skinothetis-eisai",
    title: "Ποιος σκηνοθέτης είσαι;",
    blurb: "Συμμετρία όπως ο Άντερσον ή χάος όπως ο Λιντς; Απάντησε ειλικρινά.",
    meta: "Σύντομα",
    color: "bg-[#FF7AB6]",
  },
  {
    slug: "sinefil-bingo",
    title: "Σινεφίλ μπίνγκο",
    blurb: "Μια κάρτα με κλισέ για την επόμενη φεστιβαλική ταινία που θα δεις.",
    meta: "Σύντομα",
    color: "bg-[#009DF8]",
  },
  {
    slug: "ti-na-do-apopse",
    title: "Τι να δω απόψε;",
    blurb: "Τρεις ερωτήσεις για τη διάθεσή σου και σου βγάζω μία ταινία.",
    meta: "Σύντομα",
    color: "bg-white",
  },
];

export function isPlayable(quiz: Quiz): quiz is Quiz & { questions: QuizQuestion[] } {
  if (!quiz.questions?.length) return false;
  return quiz.kind === "trivia" ? !!quiz.tiers?.length : !!quiz.results;
}
