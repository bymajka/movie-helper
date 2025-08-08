import Image from "next/image";

interface LogoProps {
    className?: string;
}

const Logo = ({ className }: LogoProps) => {
    return (
        <Image src="/logo.svg" alt="logo" width={36} height={32} className={className} />
    )
}

export default Logo;