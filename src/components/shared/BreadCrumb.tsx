import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import Link from "next/link";

const BreadCrumb = ({ items, className }: { items: { label: string, href: string }[], className?: string }) => {
    return (
        <Breadcrumb className={cn(className)}>
            <BreadcrumbList>
                {items.map((item, index) => (
                    <div key={`breadcrumb-${index}`} className="flex items-center gap-2" >
                        <BreadcrumbItem key={index}>
                            <BreadcrumbLink asChild>
                                <Link href={item.href} className={cn(index === items.length - 1 && "text-primary")} >{item.label}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {index < items.length - 1 && <BreadcrumbSeparator>
                            <span className="text-muted-foreground">/</span>
                        </BreadcrumbSeparator>}
                    </div>
                ))}
            </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;