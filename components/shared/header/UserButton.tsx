import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Role } from '@/core/domain/enums/role'
import { signOutUser } from '@/core/presentation/actions/auth/user.actions'
import Link from 'next/link'

const UserButton = async () => {
  const session = await auth()
  if (!session?.user)
    return (
      <Link href="/sign-in">
        <Button>Sign In</Button>
      </Link>
    )

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? ''

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-300 cursor-pointer"
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link className="w-full" href="/user/profile">
              User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className='w-full' href='/user/orders'>
              Order History
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === Role.ADMIN && (
            <DropdownMenuItem>
              <Link className='w-full' href='/admin/overview'>
                Admin Panel
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start cursor-pointer"
                variant="ghost"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { UserButton }
