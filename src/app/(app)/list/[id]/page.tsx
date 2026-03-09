"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { ListView } from "@/views";

export default function ListPage() {
  const { id } = useParams();

  const listId = Number(id);
  if (!id || Array.isArray(id) || isNaN(listId) || listId <= 0) {
    notFound();
  }

  return <ListView id={listId} />;
}
