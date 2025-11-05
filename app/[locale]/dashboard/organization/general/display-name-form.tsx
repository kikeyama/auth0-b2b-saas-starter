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
  organization: {
    id: string
    displayName: string
    slug: string
  }
}

export function DisplayNameForm({ organization }: Props) {
  // Get translation from messages
  const t = useTranslations('OrgDisplayNameForm');

  return (
    <Card>
      <form
        action={async (formData: FormData) => {
          const { error } = await updateDisplayName(formData)

          if (error) {
            toast.error(error)
          } else {
            toast.success("The organization's display name has been updated.")
          }
        }}
      >
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="display_name">{t('org_name')}</Label>
            <Input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="acme"
              defaultValue={organization.displayName}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="slug">{t('org_slug')}</Label>
            <Input
              id="slug"
              type="text"
              placeholder="acme"
              defaultValue={organization.slug}
              disabled
              readOnly
            />
            <p className="text-sm text-muted-foreground">
              {t('org_slug_description')}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton>{t('button')}</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  )
}
