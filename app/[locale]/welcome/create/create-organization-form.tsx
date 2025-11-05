"use client"

import { useState } from "react"
import { useUser } from "@auth0/nextjs-auth0"
import slugify from "@sindresorhus/slugify"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code } from "@/components/code"
import { SubmitButton } from "@/components/submit-button"

import { createOrganization } from "./actions"

import { useTranslations } from 'next-intl';

export function CreateOrganizationForm() {
  // Get translation from messages
  const t = useTranslations('CreateOrganizationForm');

  const { user } = useUser()
  const [name, setName] = useState("")

  return (
    <form
      action={async (formData: FormData) => {
        const { error } = await createOrganization(formData)

        if (error) {
          toast.error(error)
        } else {
          toast.success(t('success'))
        }
      }}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input
            value={user?.email || ""}
            id="email"
            placeholder="name@example.com"
            type="email"
            disabled
            readOnly
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="organization_name">{t('org_name')}</Label>
          <Input
            id="organization_name"
            name="organization_name"
            placeholder="Acme Corp"
            type="text"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {t('slug')}: <Code>{slugify(name || "Acme Corp")}</Code>
          </p>
        </div>
        <SubmitButton>{t('button')}</SubmitButton>
      </div>
    </form>
  )
}
