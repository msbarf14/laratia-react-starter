import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    links: PaginationLink[];
    className?: string;
};

export function Pagination({ links, className }: Props) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className={cn('flex items-center gap-1', className)}>
            {links.map((link, index) => {
                const isPrev = index === 0;
                const isNext = index === links.length - 1;
                const label = isPrev
                    ? 'Previous'
                    : isNext
                      ? 'Next'
                      : link.label;

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm text-muted-foreground"
                        >
                            {isPrev && <ChevronLeft className="size-4" />}
                            {!isPrev && !isNext && (
                                <span
                                    dangerouslySetInnerHTML={{ __html: label }}
                                />
                            )}
                            {isNext && <ChevronRight className="size-4" />}
                        </span>
                    );
                }

                return (
                    <Button
                        key={index}
                        variant={link.active ? 'default' : 'ghost'}
                        size="sm"
                        className="h-9 gap-1"
                        asChild
                    >
                        <Link href={link.url} preserveScroll>
                            {isPrev && <ChevronLeft className="size-4" />}
                            {!isPrev && !isNext && (
                                <span
                                    dangerouslySetInnerHTML={{ __html: label }}
                                />
                            )}
                            {isNext && <ChevronRight className="size-4" />}
                        </Link>
                    </Button>
                );
            })}
        </nav>
    );
}
