import { Button as ButtonUI } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

const Button = ({ children, ...props }: ButtonProps) => {
    return (
        <ButtonUI className={cn("cursor-pointer", props.className)} {...props}>{children}</ButtonUI>
    )
}

export default Button;