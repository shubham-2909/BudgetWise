export default function layout({ children }: { children: React.ReactNode }) {
  return <div className=" relative flex flex-col w-full h-screen  justify-center items-center">
    <div className="mt-12">
      {children}
    </div>
  </div>
}
