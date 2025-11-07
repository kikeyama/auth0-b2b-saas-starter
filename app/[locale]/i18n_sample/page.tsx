//import {use} from 'react';
import {setRequestLocale} from 'next-intl/server';
//import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
//import { appClient } from "@/lib/auth0"

//export default appClient.withPageAuthRequired(
//  async function Home({params}) {
export default async function Home({
  params
}: Readonly<{
  params: Promise<{locale: string}>
}>) {
//  const {locale} = use(params);
  const {locale} = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Once the request locale is set, you
  // can call hooks from `next-intl`
//  const t = useTranslations('home');
  const t = await getTranslations('sample');  // async

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
//);
