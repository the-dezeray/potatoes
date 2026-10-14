export type ExecMember = {
  role: string;
  name: string;
  image: string;
  quote?: string;
  bio?: string;
};

// ── Current Executive Board ────────────────────────────────────────────────
// Source of truth for the BIUST Innovation Club leadership.
// Used by the homepage, /about (SEO), and /members-view.

export const executives: ExecMember[] = [
  {
    role: "President",
    name: "Desiree Chingwaru",
    image: "/club-members/desiree.webp",
    quote: "Building a club where every BIUST student can ship real work.",
    bio: "President of the BIUST Innovation Club. Leads club strategy, partnerships, and oversees all projects, hack nights, and campus tech initiatives.",
  },
  {
    role: "Vice President",
    name: "Simeon Uden",
    image: "/club-members/oga.webp",
    quote: "Turning ideas into working prototypes, fast.",
    bio: "Vice President of the BIUST Innovation Club. Supports the president, coordinates project teams, and runs weekly build sessions and hack nights.",
  },
  {
    role: "Secretary",
    name: "Esabel",
    image: "/club-members/es.webp",
    quote: "Keeping the club organised so builders can build.",
    bio: "Secretary of the BIUST Innovation Club. Handles official notices, meeting records, membership, and day-to-day club administration.",
  },
]

// ── Former Executives (kept for history / SEO) ─────────────────────────────

export const formerExecutives: ExecMember[] = [
  {
    role: "Former President",
    name: "Phemelo Mokgosi",
    image: "/club-members/p.webp",
    bio: "Former President of the BIUST Innovation Club. Pioneered the next wave of tech in Botswana.",
  },
  {
    role: "Former PR",
    name: "Thandiswa Okuntle",
    image: "/club-members/s.webp",
    bio: "Former Public Relations officer of the BIUST Innovation Club.",
  },
  {
    role: "Former Secretary",
    name: "Lumbiel Timothy",
    image: "/club-members/lum.webp",
    bio: "Former Secretary of the BIUST Innovation Club.",
  },
]

export const members = [

  { name: "Koolopa",              role: "UI/UX Designer",    image: "/club-members/pol.webp" },
  { name: "Pako",                 role: "Backend Dev",       image: "/club-members/pk.webp" },
  { name: "Ross",                 role: "Backend Dev",       image: "/club-members/ross.webp" },
  { name: "Karabo",               role: "UI/UX Designer",    image: "/club-members/karabo.webp" },

  // New members
  { name: "Tsholofelo Blessing Bathusi", role: "Software Developer", image: "/club-members/IMG-20251029-WA0153 - Tsholofelo Blessing Bathusi.webp" },
  { name: "Sekao Ram",                   role: "Software Developer", image: "/club-members/IMG-20260117-WA0061(1)(1) - sekao ram.webp" },
  { name: "Anime_niac",                  role: "Software Developer", image: "/club-members/IMG-20260917-WA0022 - Anime_niac 映画.webp" },
  { name: "Oarabile Koore",              role: "Software Developer", image: "/club-members/IMG_20260228_175745_171 - Oarabile Koore.webp" },
  { name: "Sandile Siakayuwa",           role: "Software Developer", image: "/club-members/IMG_3197 - Sandile Siakayuwa.webp" },
  { name: "Tlotlang Morebodi",           role: "Software Developer", image: "/club-members/IMG_3705 - Tlotlang Morebodi.webp" },
  { name: "Theo Mothuti",                role: "Software Developer", image: "/club-members/IMG_8793 - Theo Mothuti.webp" },
  { name: "Govind Shain",                role: "Software Developer", image: "/club-members/Professional outdoor headshot of man - Govind Shain.webp" },
  { name: "Karl",                        role: "Software Developer", image: "/club-members/20260321_185720 - Karl.webp" },
  { name: "Shezzane Zendanemako",        role: "Software Developer", image: "/club-members/20260916_140458 - Shezzane Zendanemako.webp" },

]
