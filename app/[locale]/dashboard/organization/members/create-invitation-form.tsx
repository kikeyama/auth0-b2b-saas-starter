"use client"

import { useRef } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SubmitButton } from "@/components/submit-button"

import { createInvitation } from "./actions"

import { useTranslations } from 'next-intl';

export function CreateInvitationForm() {
  // Get translation from messages
  const t = useTranslations('CreateInvitationForm');

  const ref = useRef<HTMLFormElement>(null)

  return (
    <Card>
      <form
        ref={ref}
        action={async (formData: FormData) => {
          const { error } = await createInvitation(formData)
          const email: string = formData.get('email') as string

          if (error) {
            toast.error(error)
          } else {
            toast.success(t('success', {email: email}))
            ref.current?.reset()
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
          <div className="flex space-x-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="jane@example.com"
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="role">{t('role')}</Label>
              <Select defaultValue="member" name="role">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">{t('member')}</SelectItem>
                  <SelectItem value="admin">{t('admin')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton>{t('button')}</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  )
}
