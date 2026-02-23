"use client";

import { useParams } from "next/navigation";
import { MovieView } from "@/views";

export default function MoviePage() {
  const { id } = useParams();
  return <MovieView id={Number(id)} />;
}
