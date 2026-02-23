import Image from "next/image";
import logoSvg from "@/shared/assets/icons/logo.svg";

interface LogoProps {
    className?: string;
}

const Logo = ({ className }: LogoProps) => {
    return (
        <Image src={logoSvg} alt="logo" width={36} height={32} className={className} />
    )
}

export default Logo;