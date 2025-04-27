'use client'
import CreatorCard from '../../components/CreatorCard.jsx'
import { useState, useMemo } from 'react'
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
  Music,
  Camera,
  Video,
  Mic,
  BookOpen,
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

const Page = () => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

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

  const creators = [
    {
      id: 1,
      name: "TechGuru",
      category: "Technology",
      icon: <Settings className="mr-2 h-4 w-4" />,
      shortcut: "⌘T"
    },
    {
      id: 2,
      name: "MusicMaster",
      category: "Music",
      icon: <Music className="mr-2 h-4 w-4" />,
      shortcut: "⌘M"
    },
    {
      id: 3,
      name: "PhotoPro",
      category: "Photography",
      icon: <Camera className="mr-2 h-4 w-4" />,
      shortcut: "⌘P"
    },
    {
      id: 4,
      name: "VlogStar",
      category: "Vlogging",
      icon: <Video className="mr-2 h-4 w-4" />,
      shortcut: "⌘V"
    },
    {
      id: 5,
      name: "PodcastKing",
      category: "Podcasting",
      icon: <Mic className="mr-2 h-4 w-4" />,
      shortcut: "⌘K"
    },
    {
      id: 6,
      name: "BookWorm",
      category: "Literature",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
      shortcut: "⌘B"
    }
  ]

  const navigationItems = [
    {
      id: 7,
      name: "Home",
      icon: <HomeIcon className="mr-2 h-4 w-4" />,
      href: "/home",
      shortcut: "⌘H"
    },
    {
      id: 8,
      name: "Notification",
      icon: <Mail className="mr-2 h-4 w-4" />,
      href: "/notification",
      shortcut: "⌘N"
    },
    {
      id: 9,
      name: "Become a creator",
      icon: <Gamepad className="mr-2 h-4 w-4" />,
      href: "/creator/register",
      shortcut: "⌘C"
    },
    {
      id: 10,
      name: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      href: "/settings",
      shortcut: "⌘S"
    },
    {
      id: 11,
      name: "CGP Grey",
      icon: <User className="mr-2 h-4 w-4" />,
      href: "/creator/cgp-grey",
      shortcut: "⌘G"
    }
  ]

  const utilityItems = [
    {
      id: 12,
      name: "Calendar",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      shortcut: "⌘L"
    },
    {
      id: 13,
      name: "Search Emoji",
      icon: <Smile className="mr-2 h-4 w-4" />,
      shortcut: "⌘E"
    },
    {
      id: 14,
      name: "Calculator",
      icon: <Calculator className="mr-2 h-4 w-4" />,
      shortcut: "⌘U"
    }
  ]

  // Filter results based on exact match
  const filteredCreators = useMemo(() => {
    if (!searchTerm) return creators
    return creators.filter(creator => 
      creator.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
  }, [searchTerm, creators])

  const filteredNavigation = useMemo(() => {
    if (!searchTerm) return navigationItems
    return navigationItems.filter(item => 
      item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
  }, [searchTerm, navigationItems])

  const filteredUtilities = useMemo(() => {
    if (!searchTerm) return utilityItems
    return utilityItems.filter(item => 
      item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
  }, [searchTerm, utilityItems])

  const hasResults = 
    filteredCreators.length > 0 || 
    filteredNavigation.length > 0 || 
    filteredUtilities.length > 0

  return (
    <>
      <div className="bg-slate-700 w-[80vw] h-[10vh] flex justify-between items-center sticky top-0 backdrop-filter backdrop-blur-lg bg-opacity-30">
        <img src='/Yellow_Black_Brush_Streetwear_Brand_Logo_20250424_123341_0000-removebg-preview.png' width='200px' />
        <p className="text-sm text-muted-foreground">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>
        </p>
        <div className="top-4 right-4">
          <Link href='/creator/register'>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Become a Creator
            </button>
          </Link>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search creators or pages..." 
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          {!hasResults && <CommandEmpty>No exact matches found</CommandEmpty>}
          
          {filteredCreators.length > 0 && (
            <CommandGroup heading="Creators">
              {filteredCreators.map((creator) => (
                <CommandItem key={creator.id}>
                  {creator.icon}
                  <span>{creator.name}</span>
                  <CommandShortcut>{creator.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredNavigation.length > 0 && (
            <CommandGroup heading="Navigation">
              {filteredNavigation.map((item) => (
                <CommandItem key={item.id}>
                  {item.icon}
                  <Link href={item.href}>
                    <span>{item.name}</span>
                  </Link>
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredUtilities.length > 0 && (
            <CommandGroup heading="Utilities">
              {filteredUtilities.map((item) => (
                <CommandItem key={item.id}>
                  {item.icon}
                  <span>{item.name}</span>
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 m-10">
        <Tags title='gaming' color='bg-red-600' />
        <Tags title='education' color='bg-blue-600' />
        <Tags title='music' color='bg-green-600' />
        <Tags title='news' color='bg-yellow-600' />
        <Tags title='cooking' color='bg-green-600' />
        <Tags title='arts' color='bg-purple-600' />
        <Tags title='comedy' color='bg-yellow-600' />
      </div>

      <div className="flex flex-col justify-center items-center">
        <h1 className="p-10">Top creators</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <CreatorCard name="Pewdiepie" image={image3000} supporters="500k+" category="Entertainment" />
          <CreatorCard name="Filthy Frank" image={image3000} supporters="300k+" category="Comedy" />
          <CreatorCard name="Marques Brownlee" image={image3000} supporters="300k+" category="Tech" />
          <CreatorCard name="IShowSpeed" image={image3000} supporters="500k+" category="Streaming, Entertainment" />
        </div>
      </div>
    </>
  )
}

export default Page