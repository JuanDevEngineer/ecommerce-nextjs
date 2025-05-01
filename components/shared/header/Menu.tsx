import Link from 'next/link'
import { EllipsisVertical, ShoppingCart } from 'lucide-react'

import { ModeTheme } from './ModeTheme'
import { UserButton } from './UserButton'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Search } from './Search'

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeTheme />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <UserButton />
      </nav>

      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start w-full max-w-3xl lg:mx-auto p-5 md:px-10">
            <SheetTitle className="font-bold">Menu</SheetTitle>
            <ModeTheme />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <UserButton />
            <SheetDescription></SheetDescription>
            <div className='mt-5'>
              <Search />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export { Menu }
