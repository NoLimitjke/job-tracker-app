'use client';

import { Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { getSession } from '@/lib/auth/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import SignOutButton from './sign-out-btn';
import { useSession } from '@/lib/auth/auth-client';

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="border-b border-gray-200 bg-white ">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Briefcase className="w-5 h-5" />
          <h1>Job Tracker</h1>
        </Link>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button variant={'ghost'} className="text-gray-700 hover:text-black">
                  Dashboard
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant={'ghost'} className="relative w-8 h-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {session.user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <SignOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-up">
                <Button variant={'ghost'} className="text-gray-700 hover:text-black">
                  Log In
                </Button>
              </Link>
              <Link href="/sign-in">
                {' '}
                <Button className="bg-primary hover:bg-primary/80">Start for free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
