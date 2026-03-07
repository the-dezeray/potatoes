import { Footer } from "@/components/footer"

// ── Data ─────────────────────────────────────────────────────────────────────

const executives = [
  {
    role: "President",
    name: "Phemelo Mokgosi",
    image: "/club-members/p.webp",
    quote: "Pioneering the next wave of tech in BW.",
    wide: true,
  },
  {
    role: "Vice President",
    name: "Desiree Chingwaru",
    image: "/club-members/2.png",
  },
  {
    role: "HR Manager",
    name: "Lumbiel A",
    image: "/club-members/3.png",
  },
  {
    role: "Treasurer",
    name: "Thandiswa Okuntle",
    image: "/club-members/l.jpeg",
  },
  {
    role: "Secretary",
    name: "Simoen Uden",
    image: "/club-members/s.jpeg",
  },
]

const members = [
  { name: "Kagiso Molefe",   role: "Full-Stack Dev",    image: "/club-members/1.png" },
  { name: "Tshepo Nkosi",    role: "UI/UX Designer",    image: "/club-members/2.png" },
  { name: "Amogelang Tau",   role: "Backend Dev",       image: "/club-members/3.png" },
  { name: "Lerato Sithole",  role: "Mobile Dev",        image: "/club-members/4.png" },
  { name: "Mpho Dithebe",    role: "ML Engineer",       image: "/club-members/5.png" },
  { name: "Oratile Kgosi",   role: "DevOps",            image: "/club-members/6.png" },
  { name: "Boitumelo Rre",   role: "Cybersecurity",     image: "/club-members/7.png" },
  { name: "Naledi Garekwe",  role: "Data Analyst",      image: "/club-members/8.png" },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#1c1c1c] selection:bg-[#8ecfc8]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pt-24 pb-10">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b]">
          01. Our People
        </span>
        <h1 className="mt-2 text-3xl md:text-4xl font-medium tracking-tight leading-tight">
          Meet the team.
        </h1>
        <p className="mt-3 text-xs text-[#6b6b6b] max-w-md leading-relaxed">
          A collective of builders, designers, and problem-solvers pushing technology
          forward at BIUST.
        </p>

        {/* count pill */}
        <div className="mt-4 inline-flex items-center gap-2 border-2 border-[#1c1c1c] bg-[#fbd35a] shadow-[3px_3px_0px_0px_#1c1c1c] rounded-full px-3 py-1">
          <span className="text-xs font-bold font-mono">
            {executives.length + members.length}&nbsp;members
          </span>
        </div>
      </section>

      {/* ── Executives ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b]">
            Executive Board
          </span>
          <div className="flex-1 h-px bg-[#1c1c1c]/10" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {executives.map((exec) => (
            <div
              key={exec.name}
              className="group relative overflow-hidden rounded-2xl border-2 border-[#1c1c1c] shadow-[3px_3px_0px_0px_#1c1c1c] bg-gray-200 aspect-square"
            >
              <img
                src={exec.image}
                alt={exec.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                <span className="text-[9px] font-mono uppercase tracking-widest opacity-60 mb-0.5">
                  {exec.role}
                </span>
                <h4 className="text-sm font-bold leading-tight">{exec.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Members ──────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-20">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b]">
            Members
          </span>
          <div className="flex-1 h-px bg-[#1c1c1c]/10" />
          <span className="text-[10px] font-mono text-[#6b6b6b]">{members.length} listed</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {members.map((m) => (
            <div
              key={m.name}
              className="group relative overflow-hidden rounded-2xl border-2 border-[#1c1c1c] shadow-[2px_2px_0px_0px_#1c1c1c] bg-gray-200 aspect-square"
            >
              <img
                src={m.image}
                alt={m.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              {/* name overlay — visible on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex flex-col justify-end p-3 text-white">
                <h4 className="text-xs font-bold leading-tight">{m.name}</h4>
                <span className="text-[9px] font-mono opacity-70 mt-0.5">{m.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
