import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

import { RelatedCharts } from '@/components/related-charts'

import { ChartSkeleton, TableSkeleton } from '@/components/skeleton'
import { Table } from '@/components/table'
import { Suspense } from 'react'
import { getQueryConfigByName } from './clickhouse-queries'

interface PageProps {
  params: {
    query: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export const dynamic = 'force-dynamic'
export const revalidate = 300

export default async function Page({
  params: { query },
  searchParams,
}: PageProps) {
  noStore()

  // Retrieves the query configuration by name.
  const queryConfig = getQueryConfigByName(query)
  if (!queryConfig) {
    return notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<ChartSkeleton />}>
        <RelatedCharts relatedCharts={queryConfig.relatedCharts} />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <Table
          title={query.replaceAll('-', ' ')}
          queryConfig={queryConfig}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  )
}
