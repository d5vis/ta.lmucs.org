'use client'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function FAQ() {
  return (
    <Card className="w-full h-full text-left gap-4 rounded-2xl p-8">
      <h2 className="text-xl text-lmublue font-[family-name:var(--font-metric-bold)]">
        ITS Equipment Assigned to You
      </h2>
      <div>
        ITS keeps track of your inventory{' '}
        <Link
          href="https://docs.google.com/presentation/d/e/2PACX-1vTdyFvGRqePNnh7nR4xhPoj1M95dK-fObFws4riRT3lGSzR3T4PGrqnKKbiL0LE9XEiwQEBlq7tWQR3/pub"
          className="text-lmublue"
        >
          on this page.
        </Link>
      </div>
      <Separator className="mt-4 mb-4" />
    </Card>
  )
}
