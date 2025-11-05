"use client"

import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/submit-button"

import { updateDisplayName } from "./actions"

import { useTranslations } from 'next-intl';

interface Props {
  displayName: string
}

export function DisplayNameForm({ displayName }: Props) {
  // Get translation from messages
  const t = useTranslations('AccountDisplayNameForm');

  return (
    <Card>
      <form
        action={async (formData: FormData) => {
          const { error } = await updateDisplayName(formData)

          if (error) {
            toast.error(error)
          } else {
            toast.success(t('success'))
          }
        }}
      >
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="display_name" className="sr-only">
              {t('title')}
            </Label>
            <Input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="John Smith"
              defaultValue={displayName}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton>{t('button')}</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  )
}
