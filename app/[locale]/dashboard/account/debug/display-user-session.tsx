"use client"

import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { cn } from "@/lib/utils"

import { User } from "@auth0/nextjs-auth0/types"

import { useTranslations } from 'next-intl';

interface Props {
  user: User
}

export function DisplayUserSession({ user }: Props) {
  // Get translation from messages
  const t = useTranslations('DisplayUserSession');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-h-fit items-center gap-1.5 bg-gray-700 text-gray-50 rounded-md">
              <pre className="overflow-hidden p-3">
                <code>{JSON.stringify(user, null, 2)}</code>
              </pre>
        </div>
      </CardContent>
    </Card>
  )
}
