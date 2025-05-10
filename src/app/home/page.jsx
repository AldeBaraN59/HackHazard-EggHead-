'use client'
import CreatorCard from '@/components/CreatorCard'
import { useState } from 'react'
import {
  Calculator,
  Calendar,
  CreditCard,
  Home,
  Settings,
  Smile,
  User,
  HomeIcon,
  Mail,
  Gamepad
} from "lucide-react"
import image3000 from "../../../public/headphones-removebg-preview.png"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useEffect } from 'react'
import Link from 'next/link'
import Tags from '@/components/Tags'


const page = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  return (
    <>
      <div className="bg-slate-700 w-[80vw] h-[10vh] flex justify-between items-center sticky top-0  backdrop-filter backdrop-blur-lg  bg-opacity-30">
        <img src='/Yellow_Black_Brush_Streetwear_Brand_Logo_20250424_123341_0000-removebg-preview.png' width='200px' />
        <p className="text-sm text-muted-foreground">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>
        </p>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search creators or other pages" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Calendar />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <Calculator />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Application">
              <CommandItem>
                <HomeIcon />
                <Link href="/home">
                  <span>Home</span>
                </Link>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Mail />
                <Link href="/notification">
                  <span>Notification</span>
                </Link>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Gamepad />
                <Link href="/notification">
                <span>Become a creator</span>
                </Link>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Memberships">
              <CommandItem>
                <HomeIcon />
                <Link href="/creator">
                  <span>CGP Grey</span>
                </Link>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>

            </CommandGroup>
          </CommandList>
        </CommandDialog>
        <div className="top-4 right-4">
          <Link href='/creatorRegistration'>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Become a Creator
            </button>
          </Link>
        </div>
      </div>
      <div className="tags grid grid-cols-5 m-24 gap-5">
        <Tags title='gameing' color='bg-red-600' />
        <Tags title='education' color='bg-blue-600' />
        <Tags title='music' color='bg-green-600' />
        <Tags title='news' color='bg-yellow-600' />
        <Tags title='cooking' color='bg-green-600' />
        <Tags title='arts' color='bg-purple-600' />
        <Tags title='arts' color='bg-yellow-600' />
      </div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="p-10">Top creators</h1>
        <div className="grid grid-cols-4">
          <CreatorCard name="Pewdiepie" image={image3000} supporters="500k+" category="Entertainment" />
          <CreatorCard name="Filthy Frank" image={image3000} supporters="300k+" category="Comedy" />
          <CreatorCard name="Marques Brownlee" image={image3000} supporters="300k+" category="Tech" />
          <CreatorCard name="IShowSpeed" image={image3000} supporters="500k+" category="Streaming, Entertainment" />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="p-10">Top creators</h1>
        <div className="grid grid-cols-4">
          <CreatorCard name="Pewdiepie" image={image3000} supporters="500k+" category="Entertainment" />
          <CreatorCard name="Filthy Frank" image={image3000} supporters="300k+" category="Comedy" />
          <CreatorCard name="Marques Brownlee" image={image3000} supporters="300k+" category="Tech" />
          <CreatorCard name="IShowSpeed" image={image3000} supporters="500k+" category="Streaming, Entertainment" />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="p-10">Top creators</h1>
        <div className="grid grid-cols-4">
          <CreatorCard name="Pewdiepie" image={image3000} supporters="500k+" category="Entertainment" />
          <CreatorCard name="Filthy Frank" image={image3000} supporters="300k+" category="Comedy" />
          <CreatorCard name="Marques Brownlee" image={image3000} supporters="300k+" category="Tech" />
          <CreatorCard name="IShowSpeed" image={image3000} supporters="500k+" category="Streaming, Entertainment" />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="p-10">Top creators</h1>
        <div className="grid grid-cols-4">
          <CreatorCard name="Pewdiepie" image={image3000} supporters="500k+" category="Entertainment" />
          <CreatorCard name="Filthy Frank" image={image3000} supporters="300k+" category="Comedy" />
          <CreatorCard name="Marques Brownlee" image={image3000} supporters="300k+" category="Tech" />
          <CreatorCard name="IShowSpeed" image={image3000} supporters="500k+" category="Streaming, Entertainment" />
        </div>
      </div>
    </>

  )
}

export default page
