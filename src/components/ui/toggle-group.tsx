import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
export function ToggleGroup({ className, ...props }: ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return <ToggleGroupPrimitive.Root className={cn('flex rounded-xl bg-muted p-1 gap-1', className)} {...props} />
}
export function ToggleGroupItem({ className, ...props }: ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return <ToggleGroupPrimitive.Item className={cn('inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all data-[state=on]:bg-background data-[state=on]:text-primary data-[state=on]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', className)} {...props} />
}
