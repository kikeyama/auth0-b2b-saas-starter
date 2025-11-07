"use client"

import { GlobeIcon } from "lucide-react"
import { useRouter } from 'next/navigation'
import { usePathname } from '@/i18n/navigation'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useTranslations } from 'next-intl';

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <GlobeIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform" />
          <span className="sr-only">Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/en${pathname}`, { locale: 'en' })}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/ja${pathname}`, { locale: 'ja' })}>
          日本語
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
