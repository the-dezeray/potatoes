import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { executives, formerExecutives, members } from "@/lib/members-data";

const SITE_URL = "https://biustinnovation.com";

export const metadata: Metadata = {
  title: "About the BIUST Innovation Club | Student Tech Club in Botswana",
  description:
    "About the BIUST Innovation Club — Botswana's student tech and innovation club at BIUST Palapye. Meet President Desiree Chingwaru, VP Simeon Uden, Secretary Esabel, and explore projects, hack nights & how to join.",
  keywords: [
    "BIUST Innovation Club",
    "BIUST",
    "Botswana International University of Science and Technology",
    "BIUST student clubs",
    "Palapye tech club",
    "Botswana tech community",
    "student developers Botswana",
    "hackathons Botswana",
    "Desiree Chingwaru",
    "Simeon Uden",
  ],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    siteName: "BIUST Innovation Club",
    title: "About the BIUST Innovation Club | Student Tech Club in Botswana",
    description:
      "Student-run tech and innovation club at BIUST, Palapye. We build real projects, host hack nights, and solve campus problems. Meet our executive board.",
    images: [{ url: `${SITE_URL}/image10.webp`, width: 1200, height: 630, alt: "BIUST Innovation Club members building together" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About the BIUST Innovation Club",
    description:
      "Meet the executive board: President Desiree Chingwaru, Vice President Simeon Uden, Secretary Esabel. Projects, hack nights & community at BIUST.",
    images: [`${SITE_URL}/image10.webp`],
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "BIUST Innovation Club",
  alternateName: ["BIUST Innovators Club", "BIUST Innovation Club Botswana"],
  url: SITE_URL,
  logo: `${SITE_URL}/club-logo.png`,
  image: `${SITE_URL}/image10.webp`,
  foundingDate: "2021",
  email: "hello@biustinnovation.com",
  description:
    "Student-run technology and innovation club at the Botswana International University of Science and Technology (BIUST) in Palapye, Botswana. Founded in 2021.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Palapye",
    addressCountry: "BW",
    name: "Botswana International University of Science and Technology",
  },
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "Botswana International University of Science and Technology",
    sameAs: "https://www.biust.ac.bw",
  },
  sameAs: [
    "https://www.linkedin.com/company/biust-innovators-club/",
    "https://github.com/INNOVATION-CLUB-BIUST",
    "https://www.tiktok.com/@biustinnovationclub",
    "https://www.instagram.com/biustinnovationclub/",
  ],
  member: executives.map((exec) => ({
    "@type": "Person",
    name: exec.name,
    jobTitle: `${exec.role}, BIUST Innovation Club`,
    image: `${SITE_URL}${exec.image}`,
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the BIUST Innovation Club?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The BIUST Innovation Club is a student-run technology and innovation club at the Botswana International University of Science and Technology in Palapye, founded in 2021. Members build real-world apps, solve campus problems, host hack nights, and collaborate with startups and industry.",
      },
    },
    {
      "@type": "Question",
      name: "Who are the current executives of the BIUST Innovation Club?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "President: Desiree Chingwaru. Vice President: Simeon Uden. Secretary: Esabel.",
      },
    },
    {
      "@type": "Question",
      name: "How do I join the BIUST Innovation Club?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Any BIUST student can apply via the Apply page. Visit https://biustinnovation.com/apply to submit your application.",
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#1c1c1c] selection:bg-[#8ecfc8] font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Breadcrumb (crawlable) */}
      <nav aria-label="Breadcrumb" className="px-6 md:px-10 max-w-6xl mx-auto pt-24 text-xs text-[#6b6b6b]">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[#1c1c1c] hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[#1c1c1c] font-semibold">
            About
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pt-8 pb-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b]">About us</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-medium tracking-tight leading-tight">
          About the BIUST Innovation Club
        </h1>
        <p className="mt-4 text-base text-[#444] max-w-2xl leading-relaxed">
          The <strong>BIUST Innovation Club</strong> is a student-run technology and innovation club at the{" "}
          <strong>Botswana International University of Science and Technology (BIUST)</strong> in{" "}
          <strong>Palapye, Botswana</strong>, founded in <strong>2021</strong>. We turn caffeine into functional code — building real-world apps,
          solving campus problems, hosting hack nights, and connecting students with startups and industry.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/apply"
            className="inline-flex items-center bg-[#fbd35a] border-2 border-[#1c1c1c] shadow-[3px_3px_0_#1c1c1c] rounded-lg px-5 py-2.5 text-sm font-bold hover:bg-[#f2c744] transition-colors"
          >
            Join the club
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center bg-white border-2 border-[#1c1c1c] shadow-[3px_3px_0_#1c1c1c] rounded-lg px-5 py-2.5 text-sm font-bold hover:bg-[#1c1c1c] hover:text-white transition-colors"
          >
            See our projects
          </Link>
          <Link href="/members-view" className="inline-flex items-center px-2 py-2.5 text-sm font-semibold underline underline-offset-4">
            Meet all {executives.length + formerExecutives.length + members.length}+ members
          </Link>
        </div>
      </section>

      {/* Mission */}
      <section aria-labelledby="mission" className="px-6 md:px-10 max-w-6xl mx-auto pb-12">
        <h2 id="mission" className="text-2xl md:text-3xl font-medium tracking-tight">
          Our mission
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="p-6 bg-white border-2 border-[#1c1c1c] shadow-[4px_4px_0_#1c1c1c] rounded-2xl">
            <h3 className="font-bold mb-2">Build real things</h3>
            <p className="text-sm text-[#555] leading-relaxed">
              We develop real-world apps and digital tools that move the needle for students, the university, and
              local communities — not just coursework. Explore them on our{" "}
              <Link href="/projects" className="underline font-semibold">
                projects page
              </Link>
              .
            </p>
          </article>
          <article className="p-6 bg-white border-2 border-[#1c1c1c] shadow-[4px_4px_0_#1c1c1c] rounded-2xl">
            <h3 className="font-bold mb-2">Grow Botswana&apos;s tech talent</h3>
            <p className="text-sm text-[#555] leading-relaxed">
              Weekly hack nights, rapid prototyping, design reviews, and peer learning. New to code? Start with our{" "}
              <Link href="/courses" className="underline font-semibold">
                courses
              </Link>{" "}
              then <Link href="/apply" className="underline font-semibold">apply to join</Link>.
            </p>
          </article>
        </div>
      </section>

      {/* Current executives */}
      <section aria-labelledby="executives" className="px-6 md:px-10 max-w-6xl mx-auto pb-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b]">Leadership</p>
        <h2 id="executives" className="mt-1 text-2xl md:text-3xl font-medium tracking-tight">
          Meet our current executive board
        </h2>
        <p className="mt-3 text-sm text-[#555] max-w-2xl leading-relaxed">
          The BIUST Innovation Club is led by three elected student executives:{" "}
          <strong>President Desiree Chingwaru</strong>, <strong>Vice President Simeon Uden</strong>, and{" "}
          <strong>Secretary Esabel</strong>. They set club strategy, run meetings and hack nights, manage
          partnerships, and keep official records.
        </p>

        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {executives.map((exec) => (
            <li
              key={exec.name}
              className="group overflow-hidden rounded-2xl border-2 border-[#1c1c1c] shadow-[4px_4px_0_#1c1c1c] bg-white"
            >
              <article>
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <Image
                    src={exec.image}
                    alt={`${exec.name}, ${exec.role} of the BIUST Innovation Club`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#6b6b6b]">{exec.role}</p>
                  <h3 className="text-lg font-bold tracking-tight">{exec.name}</h3>
                  {exec.bio && <p className="mt-2 text-sm text-[#555] leading-relaxed">{exec.bio}</p>}
                  {exec.quote && <p className="mt-2 text-xs italic text-[#777]">“{exec.quote}”</p>}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Former executives */}
      <section aria-labelledby="former-executives" className="px-6 md:px-10 max-w-6xl mx-auto pb-12">
        <h2 id="former-executives" className="text-2xl md:text-3xl font-medium tracking-tight">
          Former executives
        </h2>
        <p className="mt-3 text-sm text-[#555] max-w-2xl leading-relaxed">
          We thank our past leaders who built the foundation of the club. Former roles are shown below for history
          and continuity.
        </p>
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {formerExecutives.map((exec) => (
            <li key={exec.name} className="rounded-2xl border-2 border-[#1c1c1c]/15 bg-white/70 p-4 flex gap-4 items-start">
              <article className="flex gap-4">
                <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={exec.image}
                    alt={`${exec.name}, ${exec.role} of the BIUST Innovation Club`}
                    fill
                    sizes="64px"
                    className="object-cover grayscale"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#844B3E] bg-[#f4c3b3]/50 inline-block px-2 py-0.5 rounded-full">
                    {exec.role}
                  </p>
                  <h3 className="mt-1 text-sm font-bold">{exec.name}</h3>
                  {exec.bio && <p className="mt-1 text-xs text-[#666] leading-relaxed">{exec.bio}</p>}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* What we do + FAQ */}
      <section aria-labelledby="what-we-do" className="px-6 md:px-10 max-w-6xl mx-auto pb-12">
        <h2 id="what-we-do" className="text-2xl md:text-3xl font-medium tracking-tight">
          What we do at BIUST
        </h2>
        <ol className="mt-4 space-y-3 text-sm text-[#444] leading-relaxed list-decimal list-inside">
          <li>
            <strong>Build projects</strong> — student teams ship apps and tools. See <Link href="/projects" className="underline">projects</Link>.
          </li>
          <li>
            <strong>Solve campus problems</strong> — rapid prototypes for real BIUST needs.
          </li>
          <li>
            <strong>Host hack nights</strong> — weekly high-energy coding and idea validation.
          </li>
          <li>
            <strong>Collaborate</strong> — students, startups, and industry. <Link href="/contact" className="underline">Work with us</Link>.
          </li>
        </ol>
      </section>

      {/* CTA */}
      <section aria-labelledby="join" className="px-6 md:px-10 max-w-6xl mx-auto pb-24">
        <div className="bg-[#1c1c1c] text-white border-2 border-[#1c1c1c] shadow-[6px_6px_0_#fbd35a] rounded-3xl p-8 md:p-12 text-center">
          <h2 id="join" className="text-3xl md:text-4xl font-medium tracking-tight">
            Want to build with us in Botswana?
          </h2>
          <p className="mt-3 text-sm text-white/70 max-w-xl mx-auto">
            Whether you are a BIUST student, a partner, or just curious — read our{" "}
            <Link href="/blog" className="underline">blog</Link>, browse{" "}
            <Link href="/courses" className="underline">courses</Link>, or get in touch.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/apply" className="bg-[#fbd35a] text-[#1c1c1c] font-bold px-6 py-3 rounded-lg border-2 border-[#fbd35a]">
              Apply to join
            </Link>
            <Link href="/contact" className="border-2 border-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-[#1c1c1c] transition-colors">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
