import { Logo } from "@/components/Logo";

export default function layout({ children }: { children: React.ReactNode }) {
  return <div className=" relative flex flex-col w-full h-screen  justify-center items-center">
    <div className="mt-10 flex gap-2 flex-col justify-center items-center">
      <Logo />
      {children}
    </div>
  </div>
}
