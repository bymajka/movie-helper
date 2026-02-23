import { Button } from "@/shared/components/button";
import { Home, Bell } from "lucide-react";
import { Search } from "@/features/search/Search";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/avatar";
import Link from "next/link";

const USER_NAME = "John Doe";

export const TopNavBar = () => {
  return (
    <header className="flex h-14 w-full items-center gap-4">
      <Link href="/" passHref className="h-full">
        <Button
          variant="secondary"
          className="rounded-full bg-card h-full aspect-square cursor-pointer"
        >
          <Home size={24} className="text-primary" />
        </Button>
      </Link>
      <div className="flex-1 h-full">
        <Search
          placeholder="Search"
          className="w-full h-full border-none focus-visible:ring-0 placeholder:text-primary"
        />
      </div>

      <Button
        variant="secondary"
        className="rounded-full aspect-square h-full bg-card"
      >
        <Bell size={24} className="text-primary" />
      </Button>

      <Button
        variant="secondary"
        className="rounded-full h-full w-auto px-1 pr-4 flex items-center gap-2.5 bg-card"
      >
        <Avatar className="w-12 h-12">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-sm">{USER_NAME}</span>
      </Button>
    </header>
  );
};
