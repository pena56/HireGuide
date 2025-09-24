import { Link, useNavigate } from "@tanstack/react-router";
import { ThemeToggle } from "../theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/convex";
import { Authenticated, AuthLoading, useQuery } from "convex/react";
import { Skeleton } from "../ui/skeleton";

export function Navbar() {
  return (
    <nav className="w-full h-[50px] flex justify-between items-center bg-accent px-4 md:px-10 sticky top-0 font-poppins z-10">
      <Link to="/">
        <div className="flex items-center gap-2">
          <img
            src="/logo.svg"
            className="w-8 h-8 object-contain"
            alt="Shiftly logo"
          />

          <p className="text-xl uppercase font-semibold">Shiftly</p>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Authenticated>
          <ProfileDropdown />
        </Authenticated>

        <AuthLoading>
          <Skeleton className="h-8 w-8 rounded-full" />
        </AuthLoading>
      </div>
    </nav>
  );
}

export const ProfileDropdown = () => {
  const navigate = useNavigate();
  const profile = useQuery(api.profile.getProfile);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {profile?.profileImageUrl && (
            <AvatarImage src={profile?.profileImageUrl} />
          )}

          <AvatarFallback className="uppercase bg-amber-400 cursor-pointer text-black">
            {profile?.name?.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] font-poppins">
        <DropdownMenuLabel className="text-xs ">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/profile" className="w-full">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  navigate({ to: "/login" });
                },
              },
            });
          }}
        >
          Signout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
