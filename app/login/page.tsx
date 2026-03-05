import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-[#363636]">
      {/* Subtle decorative lines matching CTA banner style */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="white" strokeWidth="1" />
        <line x1="10%" y1="80%" x2="90%" y2="20%" stroke="white" strokeWidth="1" />
      </svg>

      <div className="relative w-full max-w-lg z-10">
        <LoginForm />
      </div>
    </div>
  )
}