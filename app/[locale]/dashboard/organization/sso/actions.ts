"use server"

import { SessionData } from "@auth0/nextjs-auth0/types"

import { verifyDnsRecords } from "@/lib/domain-verification"
import { withServerActionAuth } from "@/lib/with-server-action-auth"

import { getTranslations } from 'next-intl/server';

export const verifyDomain = withServerActionAuth(
  async function verifyDomain(domain: string, session: SessionData) {
    // Get translation from messages
    const t = await getTranslations('verifyDomain');

    if (!domain || typeof domain !== "string") {
      return {
        error: t('no_domain'),
      }
    }

    try {
      const verified = await verifyDnsRecords(domain, session.user.org_id!)

      return { verified }
    } catch (error) {
      console.error("failed to validate the domain", error)
      return {
        error: t('failed_to_validate'),
      }
    }
  },
  {
    role: "admin",
  }
)
