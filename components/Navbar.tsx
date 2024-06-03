"use client"
import Link from "next/link"
import { Logo } from "./Logo"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "./ui/button"
import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "./ToggleMode"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Menu } from "lucide-react"

export function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  )
}

const items = [{
  label: "Dashboard",
  link: "/"
}, { label: "Transactions", link: "/transactions" }, { label: "Manage", link: "/manage" }]

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  return (<div className="block border-separate lg:hidden bg-background">
    <nav className="container flex items-center justify-between px-8">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant={`ghost`} size={`icon`}>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={`left`} className="w-[400px] sm:w-[540px]">
          <Logo />
          <div className="flex flex-col gap-4 pt-4 mt-4">
            {items.map(item => {
              return <NavbarItem key={item.label} link={item.link} label={item.label} clickCallback={() => setIsOpen((prev) => !prev)} />
            })}
          </div>
        </SheetContent>
      </Sheet>
      <div className="h-[80px] min-h[60px] flex items-center gap-x-4">
        <Logo />
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </nav>
  </div>)
}
function DesktopNavbar() {
  return (<div className="hidden border-separate border-b bg-background lg:block">
    <nav className="flex items-center justify-between gap-4">
      <div className="ml-12"><Logo /></div>
      <div className="h-[80px] min-h-[60px] mr-12">
        <div className="flex h-full">
          {items.map((item) => (
            <NavbarItem
              key={item.label}
              link={item.link}
              label={item.label}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-x-12 lg:gap-x-4 mr-12">
        <ModeToggle />
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </nav>
  </div>)
}

function NavbarItem({ link, label, clickCallback }: { link: string, label: string, clickCallback?: () => void }) {
  const pathName = usePathname()
  const isActive = pathName === link ? true : false
  return <div className="relative flex items-center">
    <Link
      href={link}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "w-full justify-start text-lg text-muted-foreground hover:text-foreground hover:bg-background",
        isActive && "text-foreground"
      )}
      onClick={() => {
        if (clickCallback) {
          clickCallback();
        }
      }}
    >
      {label}
    </Link>
  </div>
}
