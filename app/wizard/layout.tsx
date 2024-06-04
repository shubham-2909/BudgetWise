import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen w-fullflex-col items-center justify-center">
      {children}
    </div>
  )
}
