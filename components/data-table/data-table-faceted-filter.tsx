'use client'

import { ListFilterIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { QueryConfig } from '@/types/query-config'

interface DataTableFacetedFilterProps {
  title?: string
  presets: Required<QueryConfig['filterParamPresets']>
}

export function DataTableFacetedFilter({
  title,
  presets,
}: DataTableFacetedFilterProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  if (!presets) return null

  const selected = new URLSearchParams(searchParams)
  const selectedValues = presets.filter(
    ({ key, value }) => selected.has(key) && selected.get(key) === value
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(selectedValues.length > 0 && 'bg-accent')}
        >
          <ListFilterIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.length > 0 && ` (${selectedValues.length})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit min-w-[170px]">
        {presets.map(({ name, key, value, ...preset }) => {
          const newParams = new URLSearchParams(searchParams)
          const isSelected = newParams.get(key) === value

          if (!isSelected) {
            newParams.set(key, value)
          } else {
            newParams.delete(key)
          }

          const href = pathname + '?' + newParams.toString()

          return (
            <DropdownMenuItem key={key + value}>
              <Link
                href={href}
                replace={true}
                data-selected={isSelected ? 'true' : 'false'}
                className={cn(
                  'flex flex-row content-between items-center gap-3',
                  'data-[selected=true]:font-bold'
                )}
              >
                {preset.icon && (
                  <preset.icon className="mr-2 size-4 text-muted-foreground" />
                )}
                <span>{name}</span>
              </Link>
            </DropdownMenuItem>
          )
        })}

        {selectedValues.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-center">
              <Link
                href={pathname}
                className="flex flex-row content-between items-center gap-3"
              >
                Clear filters
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
