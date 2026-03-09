"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { fetchAccountLists } from "../api/lists";
import type { UserListsResponse } from "../types";

interface UseAccountListsOptions {
  page?: number;
}

export const useAccountLists = (
  accountId: number | null,
  sessionId: string | null,
  opts?: UseAccountListsOptions,
) => {
  const [data, setData] = useState<UserListsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const page = opts?.page ?? 1;

  const fetchData = useCallback(() => {
    if (!accountId || !sessionId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchAccountLists({
      accountId,
      sessionId,
      page,
    })
      .then((res) => {
        if (isMountedRef.current) setData(res);
      })
      .catch((err) => {
        if (isMountedRef.current) setError(err.message);
      })
      .finally(() => {
        if (isMountedRef.current) setLoading(false);
      });
  }, [accountId, sessionId, page]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
