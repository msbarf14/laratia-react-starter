import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent } from '@/components/ui/card';
import { login } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <Card className="overflow-hidden p-0">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <Link
                                        href={login()}
                                        className="flex flex-col items-center gap-2 font-medium"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-md">
                                            <AppLogoIcon className="size-10 fill-current text-[var(--foreground)] dark:text-white" />
                                        </div>
                                    </Link>
                                    {title && (
                                        <h1 className="text-2xl font-bold">
                                            {title}
                                        </h1>
                                    )}
                                    {description && (
                                        <p className="text-balance text-muted-foreground">
                                            {description}
                                        </p>
                                    )}
                                </div>
                                {children}
                            </div>
                        </div>
                        <div className="relative hidden bg-muted md:block">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <AppLogoIcon className="size-32 fill-current text-primary/10" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
