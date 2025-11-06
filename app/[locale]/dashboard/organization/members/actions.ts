"use server"

import { revalidatePath } from "next/cache"
import { SessionData } from "@auth0/nextjs-auth0/types"

import { managementClient } from "@/lib/auth0"
import { Role, roles } from "@/lib/roles"
import { withServerActionAuth } from "@/lib/with-server-action-auth"

import { getTranslations } from 'next-intl/server';

export const createInvitation = withServerActionAuth(
  async function createInvitation(formData: FormData, session: SessionData) {
    // Get translation from messages
    const t = await getTranslations('createInvitation');

    const email = formData.get("email")

    if (!email || typeof email !== "string") {
      return {
        error: t('no_email_address'),
      }
    }

    const role = formData.get("role") as Role

    if (
      !role ||
      typeof role !== "string" ||
      !["member", "admin"].includes(role)
    ) {
      return {
        error: t('role_error'),
      }
    }

    try {
      const roleId = roles[role]

      await managementClient.organizations.createInvitation(
        {
          id: session.user.org_id!,
        },
        {
          invitee: {
            email,
          },
          inviter: {
            name: session.user.name!,
          },
          client_id: process.env.AUTH0_CLIENT_ID,
          // if the roleId exists, then assign it. Regular members do not have a role assigned,
          // only admins are assigned a specific role.
          roles: roleId ? [roleId] : undefined,
        }
      )

      revalidatePath("/dashboard/organization/members")
    } catch (error) {
      console.error("failed to create invitation", error)
      return {
        error: t('failed_to_create'),
      }
    }

    return {}
  },
  {
    role: "admin",
  }
)

export const revokeInvitation = withServerActionAuth(
  async function revokeInvitation(invitationId: string, session: SessionData) {
    // Get translation from messages
    const t = await getTranslations('revokeInvitation');

    try {
      await managementClient.organizations.deleteInvitation({
        id: session.user.org_id!,
        invitation_id: invitationId,
      })

      revalidatePath("/dashboard/organization/members")
    } catch (error) {
      console.error("failed to revoke invitation", error)
      return {
        error: t('failed_to_revoke'),
      }
    }

    return {}
  },
  {
    role: "admin",
  }
)

export const removeMember = withServerActionAuth(
  async function removeMember(userId: string, session: SessionData) {
    // Get translation from messages
    const t = await getTranslations('removeMember');

    if (userId === session.user.sub) {
      return {
        error: t('cannot_remove_yourself'),
      }
    }

    try {
      await managementClient.organizations.deleteMembers(
        {
          id: session.user.org_id!,
        },
        {
          members: [userId],
        }
      )

      revalidatePath("/dashboard/organization/members")
    } catch (error) {
      console.error("failed to remove member", error)
      return {
        error: t('failed_to_remove'),
      }
    }

    return {}
  },
  {
    role: "admin",
  }
)

export const updateRole = withServerActionAuth(
  async function updateRole(userId: string, role: Role, session: SessionData) {
    // Get translation from messages
    const t = await getTranslations('updateRole');

    if (userId === session.user.sub) {
      return {
        error: t('cannot_update_your_own'),
      }
    }

    if (
      !role ||
      typeof role !== "string" ||
      !["member", "admin"].includes(role)
    ) {
      return {
        error: t('role_error'),
      }
    }

    const roleId = roles[role]

    try {
      const { data: currentRoles } =
        await managementClient.organizations.getMemberRoles({
          id: session.user.org_id!,
          user_id: userId,
        })

      // if the user has any existing roles, remove them
      if (currentRoles.length) {
        await managementClient.organizations.deleteMemberRoles(
          {
            id: session.user.org_id!,
            user_id: userId,
          },
          {
            roles: currentRoles.map((r) => r.id),
          }
        )
      }

      // if the user is being assigned a non-member role (non-null), set the new role
      if (roleId) {
        await managementClient.organizations.addMemberRoles(
          {
            id: session.user.org_id!,
            user_id: userId,
          },
          {
            roles: [roleId],
          }
        )
      }

      revalidatePath("/dashboard/organization/members")
    } catch (error) {
      console.error("failed to update member's role", error)
      return {
        error: t('failed_to_update'),
      }
    }

    return {}
  },
  {
    role: "admin",
  }
)
