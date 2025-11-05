"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SubmitButton } from "@/components/submit-button"

import { deleteAccount } from "./actions"

import { useTranslations } from 'next-intl';

export function DeleteAccountForm() {
  // Get translation from messages
  const t = useTranslations('DeleteAccountForm');

  const router = useRouter()

  return (
    <Card>
      <form
        action={async () => {
          const { error } = await deleteAccount()

          if (error) {
            toast.error(error)
          } else {
            toast.success(
              t('success')
            )

            router.push("/auth/logout")
          }
        }}
      >
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <p className="text-sm">
            {t.rich('warning', {
              warning: (chunks) => <span className="font-bold">{chunks}</span>
            })}
          </p>
          <SubmitButton variant="destructive">{t('button')}</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  )
}
