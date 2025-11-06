"use client"

import { Link } from "@/i18n/navigation"
import {
  DotsVerticalIcon,
  GearIcon,
  PersonIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { deleteConnection } from "./oidc/new/actions"

import { useTranslations } from 'next-intl';

interface Props {
  connections: {
    id: string
    name: string
    strategy: string
    assignMembershipOnLogin: boolean
  }[]
}

export function ConnectionsList({ connections }: Props) {
  // Get translation from messages
  const t = useTranslations('ConnectionsList');

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
          <TableCaption>
            {t('table.caption', {count: connections.length})}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.col_name')}</TableHead>
              <TableHead>{t('table.col_strategy')}</TableHead>
              <TableHead>{t('table.col_membership')}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="w-[250px] font-medium">
                  {c.name}
                </TableCell>
                <TableCell>{c.strategy}</TableCell>
                <TableCell>
                  {c.assignMembershipOnLogin ? (
                    <Badge>{t('table.membership_enabled')}</Badge>
                  ) : (
                    <Badge variant="secondary">{t('table.membership_disabled')}</Badge>
                  )}
                </TableCell>
                <TableCell className="flex justify-end">
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <DotsVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        {c.strategy === "oidc" && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/organization/sso/oidc/edit/${c.id}/settings`}
                              >
                                <GearIcon className="mr-1 size-4" />
                                {t('table.connection_settings')}
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/organization/sso/oidc/edit/${c.id}/provisioning`}
                              >
                                <PersonIcon className="mr-1 size-4" />
                                {t('table.connection_provisioning')}
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}

                        {c.strategy === "samlp" && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/organization/sso/saml/edit/${c.id}/settings`}
                              >
                                <GearIcon className="mr-1 size-4" />
                                {t('table.connection_settings')}
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/organization/sso/saml/edit/${c.id}/provisioning`}
                              >
                                <PersonIcon className="mr-1 size-4" />
                                {t('table.connection_provisioning')}
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive">
                            <TrashIcon className="mr-1 size-4" />
                            {t('table.delete')}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t('table.alert.title', {name: c.name})}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('table.alert.description')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('table.alert.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            const { error } = await deleteConnection(c.id)
                            if (error) {
                              return toast.error(error)
                            }
                            toast.success(t('table.alert.error'))
                          }}
                        >
                          {t('table.alert.continue')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusIcon className="mr-1 size-4" />
              {t('add')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[160px]">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/organization/sso/oidc/new">{t('oidc')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/organization/sso/saml/new">{t('saml')}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
