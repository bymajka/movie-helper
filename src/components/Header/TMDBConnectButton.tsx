"use client";

import Button  from "@/components/shared/Button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect } from "react";

interface TMDBConnectButtonProps {
    isConnected: boolean;
    onDisconnect: () => void;
    children?: React.ReactNode;
}

export const TMDBConnectButton = ({ onDisconnect, children }: TMDBConnectButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const [isConnected, setIsConnected] = useState(false);

    const fetchStatus = async () => {
        const { data } = await axios.get("/api/tmdb/status", { validateStatus: () => true });
        console.log(data);
        setIsConnected(!!data?.connected);
    };

    useEffect(() => {
        fetchStatus().catch(() => setIsConnected(false));
    }, []);
    
    const handleConnect = async () => {
        setIsLoading(true);
        try {
            // Redirect to the connect endpoint
            window.location.href = '/api/tmdb/connect';
          } catch (error) {
            console.error('Failed to connect to TMDB:', error);
            setIsLoading(false);
          }
        };

        const handleDisconnect = async () => {
            setIsLoading(true);
            try {
              const response = await axios.post('/api/tmdb/disconnect', null, {validateStatus: () => true});
              
              if (response.status === 200) {
                onDisconnect?.();
                await fetchStatus();
              }
            } catch (error) {
              console.error('Failed to disconnect from TMDB:', error);
            } finally {
              setIsLoading(false);
            }
          };

          // still loading initial status
  if (isConnected === null) {
    return (
      <Button disabled variant="secondary" className="rounded-full h-full w-auto px-1 pr-4 flex items-center gap-2.5 bg-card">
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

          if (isConnected) {
            return (
              <Button 
                onClick={handleDisconnect}
                disabled={isLoading}
                variant="secondary"
                className="rounded-full h-full w-auto px-1 pr-4 flex items-center gap-2.5 bg-card"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
              </Button>
            );
          }
        
          return (
            <Button 
              onClick={ handleConnect}
              disabled={isLoading}
              variant="secondary" 
              className="rounded-full h-full w-auto px-1 pr-4 flex items-center gap-2.5 bg-card"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
            </Button>
          );
}