import Image from "next/image";

export const FallbackCardImage = () => (
    <Image src="/image-placeholder.svg" alt="No Image" fill className="object-cover" />
);