import { Button } from '@/components/ui/button'
import { ModeTheme } from './ModeTheme'
import Link from 'next/link'
import { EllipsisVertical, ShoppingCart, UserIcon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { UserButton } from './UserButton'

const Menu: React.FC = () => {
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
          <SheetContent className="flex flex-col items-start wrapper">
            <SheetTitle className="font-bold">Menu</SheetTitle>
            <ModeTheme />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export { Menu }
