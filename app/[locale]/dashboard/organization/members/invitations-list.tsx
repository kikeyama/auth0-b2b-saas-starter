"use client"

import { CopyIcon, DotsVerticalIcon, TrashIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

import { Role } from "@/lib/roles"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { revokeInvitation } from "./actions"

import { useTranslations } from 'next-intl';

interface Props {
  invitations: {
    id: string
    inviter: {
      name: string
    }
    invitee: {
      email: string
    }
    role: Role
    url: string
  }[]
}

export function InvitationsList({ invitations }: Props) {
  // Get translation from messages
  const t = useTranslations('InvitationsList');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('email')}</TableHead>
              <TableHead>{t('role')}</TableHead>
              <TableHead>{t('invited_by')}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">
                  {invitation.invitee.email}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{t('user_role', {user_role: invitation.role})}</Badge>
                </TableCell>
                <TableCell>{invitation.inviter.name}</TableCell>
                <TableCell className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline">
                        <DotsVerticalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={async () => {
                          await navigator.clipboard.writeText(invitation.url)
                          toast.success(t('copy.success'))
                        }}
                      >
                        <CopyIcon className="mr-1 size-4" />
                        {t('copy.copy_link')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onSelect={async () => {
                          const { error } = await revokeInvitation(
                            invitation.id
                          )
                          if (error) {
                            return toast.error(error)
                          }

                          toast.success(
                            t('delete.success', {email: invitation.invitee.email})
                          )
                        }}
                      >
                        <TrashIcon className="mr-1 size-4" />
                        {t('delete.button')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
