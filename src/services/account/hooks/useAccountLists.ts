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
  const requestIdRef = useRef(0);

  const page = opts?.page ?? 1;

  const fetchData = useCallback(() => {
    if (!accountId || !sessionId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    fetchAccountLists({
      accountId,
      sessionId,
      page,
    })
      .then((res) => {
        if (isMountedRef.current && requestIdRef.current === currentRequestId) {
          setData(res);
        }
      })
      .catch((err) => {
        if (isMountedRef.current && requestIdRef.current === currentRequestId) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMountedRef.current && requestIdRef.current === currentRequestId) {
          setLoading(false);
        }
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
