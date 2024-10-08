import { Suspense } from 'react'

import { RelatedCharts } from '@/components/related-charts'
import { ChartSkeleton, TableSkeleton } from '@/components/skeleton'
import { Table } from '@/components/table'

import { databaseDiskSpaceByDatabaseConfig as queryConfig } from '../../config'

interface PageProps {
  params: {
    database: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({
  params: { database },
  searchParams,
}: PageProps) {
  let params = {
    ...searchParams,
    database: database,
  }

  return (
    <div className="flex flex-col">
      <Suspense fallback={<ChartSkeleton />}>
        <RelatedCharts relatedCharts={queryConfig.relatedCharts} />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <Table
          title={'Disks usage by database: ' + database}
          queryConfig={queryConfig}
          searchParams={params}
        />
      </Suspense>
    </div>
  )
}
