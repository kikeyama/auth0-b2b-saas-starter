"use client"

import { EnvelopeClosedIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SubmitButton } from "@/components/submit-button"

import { resendVerificationEmail } from "./actions"

import { useTranslations } from 'next-intl';

export default function Verify() {
  // Get translation from messages
  const t = useTranslations('Verify');

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="grid gap-2">
          <EnvelopeClosedIcon className="size-5" />
          <span>{t('title')}</span>
        </CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <form
          action={async () => {
            const { error } = await resendVerificationEmail()

            if (error) {
              toast.error(error)
              return
            }

            toast.success(
              "The verification e-mail has successfully been sent. Please check your inbox."
            )
          }}
        >
          <SubmitButton>{t('button')}</SubmitButton>
        </form>
      </CardFooter>
    </Card>
  )
}
