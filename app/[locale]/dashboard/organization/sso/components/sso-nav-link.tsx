"use client"

import { Link } from "@/i18n/navigation"
import { useParams, useSelectedLayoutSegment } from "next/navigation"

import { cn } from "@/lib/utils"

export default function SsoNavLink({
  strategy,
  slug,
  children,
}: {
  strategy: string,
  slug: string
  children: React.ReactNode
}) {
  const { connectionId } = useParams<{ connectionId: string }>()
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/dashboard/organization/sso/${strategy}/edit/${connectionId}/${slug}`}
      className={cn(
        isActive
          ? "font-semibold text-primary underline underline-offset-[12px]"
          : "font-normal text-muted-foreground transition-colors hover:text-foreground"
      )}
    >
      {children}
    </Link>
  )
}
