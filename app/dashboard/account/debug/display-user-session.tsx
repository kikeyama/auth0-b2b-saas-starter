"use client"

import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { User } from "@auth0/nextjs-auth0/types"

interface Props {
  user: User
}

export function DisplayUserSession({ user }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User</CardTitle>
        <CardDescription>
          User session is displayed here for debugging.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-h-fit items-center gap-1.5">
              <pre className="overflow-auto">
                <code>{JSON.stringify(user, null, 2)}</code>
              </pre>
        </div>
      </CardContent>
    </Card>
  )
}
