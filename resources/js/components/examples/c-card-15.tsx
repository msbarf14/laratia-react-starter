import {
    ArrowDown,
    ArrowUp,
    MoreHorizontal,
    Settings,
    TriangleAlert,
    Pin,
    Share2,
    Trash,
} from 'lucide-react';
import { Badge } from '@/components/reui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

export function StatCardExample() {
    const title = 'Revenue';
    const value = '$12.4k';
    const delta = 12.5;
    const positive = true;
    const lastMonth = '$11.0k';

    return (
        <Card className="w-full max-w-xs">
            <CardContent className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        {title}
                    </h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="-me-1.5"
                                aria-label="More options"
                            >
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Settings className="size-4" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <TriangleAlert className="size-4" />
                                    Add Alert
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Pin className="size-4" />
                                    Pin to Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Share2 className="size-4" />
                                    Share
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive">
                                    <Trash className="size-4" />
                                    Remove
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                        <span className="text-2xl font-medium tracking-tight text-foreground tabular-nums">
                            {value}
                        </span>
                        <Badge
                            variant={
                                positive ? 'success-light' : 'destructive-light'
                            }
                        >
                            {positive ? (
                                <ArrowUp className="size-3" />
                            ) : (
                                <ArrowDown className="size-3" />
                            )}
                            {delta}%
                        </Badge>
                    </div>
                    <Separator />
                    <div className="text-xs text-muted-foreground">
                        Vs last month:{' '}
                        <span className="font-medium text-foreground tabular-nums">
                            {lastMonth}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
