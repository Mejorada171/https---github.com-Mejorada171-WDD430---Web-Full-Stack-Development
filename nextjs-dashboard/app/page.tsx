import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue, fetchLatestInvoices } from '@/app/lib/data';
import Image from 'next/image';
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';  

// Define the Revenue type
type Revenue = {
  month: string;
  revenue: number;
};


export default async function Page() {
  const rawRevenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  // Transform rawRevenue to Revenue[] if necessary
  const revenue: Revenue[] = Array.isArray(rawRevenue)
    ? rawRevenue.map((row: any) => ({
        month: row.month,
        revenue: row.revenue,
      }))
    : [];

  // Add these variables for dashboard cards
  const totalPaidInvoices = Array.isArray(latestInvoices)
    ? latestInvoices.filter((invoice: any) => invoice.status === 'paid').reduce((sum: number, invoice: any) => sum + invoice.amount, 0)
    : 0;
  const totalPendingInvoices = Array.isArray(latestInvoices)
    ? latestInvoices.filter((invoice: any) => invoice.status === 'pending').reduce((sum: number, invoice: any) => sum + invoice.amount, 0)
    : 0;
  const numberOfInvoices = Array.isArray(latestInvoices) ? latestInvoices.length : 0;
  const numberOfCustomers = Array.isArray(latestInvoices)
    ? new Set(latestInvoices.map((invoice: any) => invoice.customerId)).size
    : 0;
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className={styles.shape} />
      <div className="flex h-20 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black" />
          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Acme.</strong> This is the example for the{' '}
            <a href="https://nextjs.org/learn/" className="text-blue-500">
              Next.js Learn Course
            </a>
            , brought to you by Vercel.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
                <Image
        src="/hero-mobile.png"
        width={560}
        height={620}
        className="block md:hidden"
        alt="Screenshot of the dashboard project showing mobile version"
      />
        </div>
      </div>
      {/* Dashboard Section */}
      <section className="mt-8">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Dashboard
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {<Card title="Collected" value={totalPaidInvoices} type="collected" />}
          {<Card title="Pending" value={totalPendingInvoices} type="pending" />}
          {<Card title="Total Invoices" value={numberOfInvoices} type="invoices" />}
          {<Card
            title="Total Customers"
            value={numberOfCustomers}
            type="customers"
          />}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
          <RevenueChart revenue={revenue} />
          {<LatestInvoices latestInvoices={latestInvoices} />}
        </div>
      </section>
    </main>
  );
}
