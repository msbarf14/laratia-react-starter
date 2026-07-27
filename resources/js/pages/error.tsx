import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

const errorMessages: Record<number, { title: string; description: string }> = {
    400: {
        title: 'Bad Request',
        description:
            'Permintaan yang Anda kirim tidak valid atau tidak dapat diproses.',
    },
    401: {
        title: 'Unauthorized',
        description: 'Anda perlu login untuk mengakses halaman ini.',
    },
    403: {
        title: 'Forbidden',
        description: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
    },
    404: {
        title: 'Halaman Tidak Ditemukan',
        description:
            'Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.',
    },
    419: {
        title: 'Page Expired',
        description:
            'Sesi Anda telah berakhir. Silakan muat ulang halaman dan coba lagi.',
    },
    429: {
        title: 'Too Many Requests',
        description:
            'Terlalu banyak permintaan. Silakan tunggu beberapa saat dan coba lagi.',
    },
    500: {
        title: 'Server Error',
        description:
            'Terjadi kesalahan pada server. Tim kami sedang menangani masalah ini.',
    },
    503: {
        title: 'Service Unavailable',
        description:
            'Layanan sedang dalam pemeliharaan. Silakan coba beberapa saat lagi.',
    },
};

type Props = {
    status: number;
};

export default function Error({ status }: Props) {
    const error = errorMessages[status] ?? {
        title: `Error ${status}`,
        description: 'Terjadi kesalahan yang tidak terduga.',
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-md text-center">
                <div className="flex flex-col items-center gap-6">
                    <Link
                        href={dashboard()}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-md">
                            <AppLogoIcon className="size-12 fill-current text-[var(--foreground)] dark:text-white" />
                        </div>
                    </Link>

                    <div className="space-y-3">
                        <h1 className="text-6xl font-bold tracking-tighter text-primary">
                            {status}
                        </h1>
                        <h2 className="text-xl font-semibold tracking-tight">
                            {error.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {error.description}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" asChild>
                            <Link href={dashboard()}>Kembali ke Dashboard</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/" method="get">
                                Muat Ulang
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
