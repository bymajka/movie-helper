"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { fetchListDetails } from "../api/lists";
import type { ListDetails } from "../types";

export const useListDetails = (listId: number | null) => {
  const [data, setData] = useState<ListDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(() => {
    if (!listId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchListDetails({ listId })
      .then((res) => {
        if (isMountedRef.current) setData(res);
      })
      .catch((err) => {
        if (isMountedRef.current) setError(err.message);
      })
      .finally(() => {
        if (isMountedRef.current) setLoading(false);
      });
  }, [listId]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
