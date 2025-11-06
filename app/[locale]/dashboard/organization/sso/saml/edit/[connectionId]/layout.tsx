import { AppBreadcrumb } from "@/components/app-breadcrumb"

import SsoNavLink from "../../../components/sso-nav-link"

interface EditSamlConnectionLayoutProps {
  children: React.ReactNode
  params: Promise<{ connectionId: string }>
}

import { useTranslations } from 'next-intl';

export default function EditSamlConnectionLayout({
  children,
}: EditSamlConnectionLayoutProps) {
  // Get translation from messages
  const t = useTranslations('EditSamlConnectionLayout');

  return (
    <div className="space-y-2">
      <div className="px-2 py-3">
        <AppBreadcrumb
          title={t('back')}
          href="/dashboard/organization/sso"
        />
      </div>

      <div className="space-y-4">
        <nav className="space-x-6 border-b px-6 py-2 text-sm">
          <SsoNavLink strategy="saml" slug="settings">{t('settings')}</SsoNavLink>
          <SsoNavLink strategy="saml" slug="provisioning">{t('provisioning')}</SsoNavLink>
        </nav>

        <div>{children}</div>
      </div>
    </div>
  )
}
