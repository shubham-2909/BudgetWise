import { Navbar } from "@/components/Navbar";


export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" relative flex h-screen w-full flex-col"><div className="w-full">
      <Navbar />
      {children}
    </div>
    </div>
  )
}
