import Image from "next/image";
import imagePlaceholder from "@/shared/assets/icons/image-placeholder.svg";

export const FallbackCardImage = () => (
    <Image src={imagePlaceholder} alt="No Image" fill className="object-cover" />
);