"use client";
import Button from "../shared/Button";
import {Home, Bell} from "lucide-react";
import {Search} from "@/components/shared/Search";
import { TMDBConnectButton } from "./TMDBConnectButton";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { useEffect } from "react";

const USER_NAME = "John Doe";

const TopNavBar = () => {
    const { user } = useAuth();
    const userName = user?.user_metadata.name;
    const userEmail = user?.email;

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
                <Search placeholder="Search" className="w-full h-full border-none focus-visible:ring-0 placeholder:text-primary" />
            </div>
            
            <Button 
                variant="secondary" 
                className="rounded-full aspect-square h-full bg-card"
            >
                <Bell size={24} className="text-primary" />
            </Button>
            
            <TMDBConnectButton isConnected={false} onDisconnect={() => {}}>
                <Avatar className="w-12 h-12">
                    <AvatarFallback>{userName?.split(" ")[0].charAt(0) ?? userEmail?.split("@")[0].charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{userName ?? userEmail?.split("@")[0]}</span>
            </TMDBConnectButton>
        </header>
    )
}

export {TopNavBar};