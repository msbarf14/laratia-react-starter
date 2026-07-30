import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Ellipsis,
    Pencil,
    Search,
    ShieldCheck,
    ShieldOff,
    Trash2,
    UserPlus,
    Users as UsersIcon,
    XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from '@/components/pagination';
import {
    Frame,
    FrameFooter,
    FrameHeader,
    FramePanel,
} from '@/components/reui/frame';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    bulkDestroy,
    create,
    destroy,
    edit,
    index,
    toggleVerification,
} from '@/routes/users';
import type { Auth } from '@/types';

type User = {
    id: number;
    name: string;
    username: string | null;
    email: string;
    email_verified_at: string | null;
    created_at: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedUsers = {
    data: User[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    per_page: number;
    to: number | null;
    total: number;
};

type Filters = {
    search: string;
    verification: string;
    per_page: number;
};

type PageProps = {
    auth: Auth;
};

export default function UsersIndex({
    users,
    filters,
}: {
    users: PaginatedUsers;
    filters: Filters;
}) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectAllMatching, setSelectAllMatching] = useState(false);
    const [bulkAction, setBulkAction] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [verificationTarget, setVerificationTarget] = useState<User | null>(
        null,
    );
    const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

    const selectableIds = useMemo(
        () => users.data.map((user) => user.id),
        [users.data],
    );
    const selectedOnPage = selectableIds.filter((id) =>
        selectedIds.includes(id),
    );
    const allOnPageSelected =
        selectableIds.length > 0 &&
        selectedOnPage.length === selectableIds.length;

    useEffect(() => {
        const normalizedSearch = search.trim();

        if (normalizedSearch === filters.search) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setSelectedIds([]);
            setSelectAllMatching(false);
            setBulkAction('');

            router.get(
                index.url(),
                {
                    search: normalizedSearch || undefined,
                    verification:
                        filters.verification === 'all'
                            ? undefined
                            : filters.verification,
                    per_page: filters.per_page,
                    page: 1,
                },
                { preserveState: true, replace: true },
            );
        }, 400);

        return () => window.clearTimeout(timeout);
    }, [search, filters.search, filters.verification, filters.per_page]);

    const visitIndex = (overrides: Record<string, string | number>) => {
        setSelectedIds([]);
        setSelectAllMatching(false);
        setBulkAction('');

        router.get(
            index.url(),
            {
                search: filters.search || undefined,
                verification:
                    filters.verification === 'all'
                        ? undefined
                        : filters.verification,
                per_page: filters.per_page,
                ...overrides,
            },
            { preserveState: true, replace: true },
        );
    };

    const toggleAll = (checked: boolean) => {
        setSelectAllMatching(false);
        setSelectedIds((current) =>
            checked
                ? Array.from(new Set([...current, ...selectableIds]))
                : current.filter((id) => !selectableIds.includes(id)),
        );
    };

    const toggleUser = (userId: number, checked: boolean) => {
        setSelectedIds((current) =>
            checked
                ? [...current, userId]
                : current.filter((id) => id !== userId),
        );
    };

    const applyBulkAction = () => {
        if (
            bulkAction === 'delete' &&
            (selectAllMatching || selectedIds.length > 0)
        ) {
            setConfirmBulkDelete(true);
        }
    };

    const deleteSelectedUsers = () => {
        router.delete(bulkDestroy.url(), {
            data: selectAllMatching
                ? {
                    all: true,
                    search: filters.search || undefined,
                    verification:
                        filters.verification === 'all'
                            ? undefined
                            : filters.verification,
                }
                : { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
                setSelectAllMatching(false);
                setBulkAction('');
                setConfirmBulkDelete(false);
            },
        });
    };

    const deleteUser = () => {
        if (!deleteTarget) {
            return;
        }

        router.delete(destroy.url(deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const toggleUserVerification = () => {
        if (!verificationTarget) {
            return;
        }

        router.patch(
            toggleVerification.url(verificationTarget.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => setVerificationTarget(null),
            },
        );
    };

    return (
        <>
            <Head title="Daftar User" />

            <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-semibold">Daftar User</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola akun dan status verifikasi pengguna.
                        </p>
                    </div>
                    <div>
                        <Button asChild>
                            <Link href={create()}>
                                <UserPlus />
                                Tambah User
                            </Link>
                        </Button>
                    </div>
                </div>

                <Frame spacing="sm">
                    <FrameHeader className="flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Select
                                    value={bulkAction}
                                    onValueChange={setBulkAction}
                                >
                                    <SelectTrigger className="min-w-40">
                                        <SelectValue placeholder="Bulk action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="delete">
                                            Hapus terpilih
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    disabled={bulkAction !== 'delete'}
                                    onClick={applyBulkAction}
                                >
                                    Terapkan
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="relative min-w-0 flex-1 sm:w-72">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    className="pl-9"
                                    placeholder="Cari nama, username, atau email"
                                    aria-label="Cari user"
                                />
                            </div>

                            <Select
                                value={filters.verification}
                                onValueChange={(value) =>
                                    visitIndex({
                                        verification:
                                            value === 'all' ? '' : value,
                                        page: 1,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full sm:w-44">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua status
                                    </SelectItem>
                                    <SelectItem value="verified">
                                        Terverifikasi
                                    </SelectItem>
                                    <SelectItem value="unverified">
                                        Belum diverifikasi
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </FrameHeader>

                    <FramePanel className="overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground uppercase">
                                    <tr>
                                        <th className="w-10 px-3 py-2.5">
                                            <Checkbox
                                                checked={
                                                    selectAllMatching ||
                                                    allOnPageSelected
                                                }
                                                indeterminate={
                                                    !selectAllMatching &&
                                                    selectedOnPage.length > 0 &&
                                                    !allOnPageSelected
                                                }
                                                onCheckedChange={(checked) =>
                                                    toggleAll(checked === true)
                                                }
                                                aria-label="Pilih semua user pada halaman"
                                            />
                                        </th>
                                        <th className="px-3 py-2.5">User</th>
                                        <th className="px-3 py-2.5">
                                            Username
                                        </th>
                                        <th className="px-3 py-2.5">Status</th>
                                        <th className="px-3 py-2.5">
                                            Terdaftar
                                        </th>
                                        <th className="w-12 px-3 py-2.5 text-right">
                                            <span className="sr-only">
                                                Action
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-3 py-2">
                                                <Checkbox
                                                    checked={selectedIds.includes(
                                                        user.id,
                                                    )}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        toggleUser(
                                                            user.id,
                                                            checked === true,
                                                        )
                                                    }
                                                    aria-label={`Pilih ${user.name}`}
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="font-medium">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-muted-foreground">
                                                {user.username
                                                    ? `@${user.username}`
                                                    : '-'}
                                            </td>
                                            <td className="px-3 py-2">
                                                {user.email_verified_at ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                    >
                                                        <CheckCircle2 />
                                                        Terverifikasi
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        <XCircle />
                                                        Belum verifikasi
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                                                {user.created_at
                                                    ? new Intl.DateTimeFormat(
                                                        'id-ID',
                                                        {
                                                            dateStyle:
                                                                'medium',
                                                        },
                                                    ).format(
                                                        new Date(
                                                            user.created_at,
                                                        ),
                                                    )
                                                    : '-'}
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            aria-label={`Action untuk ${user.name}`}
                                                        >
                                                            <Ellipsis />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onSelect={() =>
                                                                router.visit(
                                                                    edit.url(
                                                                        user.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            <Pencil />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={() =>
                                                                setVerificationTarget(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            {user.email_verified_at ? (
                                                                <>
                                                                    <ShieldOff />
                                                                    Batalkan
                                                                    verifikasi
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ShieldCheck />
                                                                    Verifikasi
                                                                    user
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            disabled={
                                                                user.id ===
                                                                auth.user?.id
                                                            }
                                                            onSelect={() =>
                                                                setDeleteTarget(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 />
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {selectedOnPage.length === selectableIds.length &&
                                selectableIds.length > 0 &&
                                users.total > users.data.length &&
                                !selectAllMatching && (
                                    <div className="flex items-center justify-between gap-3 border-t bg-primary/5 px-4 py-3 text-sm">
                                        <span>
                                            Semua {selectedOnPage.length} user
                                            di halaman ini telah dipilih.
                                        </span>
                                        <Button
                                            variant="link"
                                            className="h-auto px-0"
                                            onClick={() =>
                                                setSelectAllMatching(true)
                                            }
                                        >
                                            Pilih semua {users.total} user
                                        </Button>
                                    </div>
                                )}

                            {selectAllMatching && (
                                <div className="flex items-center justify-between gap-3 border-t bg-primary/5 px-4 py-3 text-sm">
                                    <span>
                                        Semua {users.total} user hasil filter
                                        telah dipilih.
                                    </span>
                                    <Button
                                        variant="link"
                                        className="h-auto px-0"
                                        onClick={() => {
                                            setSelectAllMatching(false);
                                            setSelectedIds([]);
                                            setBulkAction('');
                                        }}
                                    >
                                        Batalkan pilihan semua
                                    </Button>
                                </div>
                            )}

                            {users.data.length === 0 && (
                                <div className="flex min-h-56 flex-col items-center justify-center gap-2 p-6 text-center">
                                    <UsersIcon className="size-8 text-muted-foreground" />
                                    <p className="font-medium">
                                        User tidak ditemukan
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Ubah kata kunci atau filter yang
                                        digunakan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </FramePanel>

                    <FrameFooter className="flex-row items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {users.from ?? 0}-{users.to ?? 0} dari{' '}
                            {users.total} user
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Halaman
                            </span>
                            <Select
                                value={String(users.current_page)}
                                onValueChange={(value) =>
                                    visitIndex({ page: Number(value) })
                                }
                            >
                                <SelectTrigger size="sm" className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from(
                                        { length: users.last_page },
                                        (_, index) => index + 1,
                                    ).map((page) => (
                                        <SelectItem
                                            key={page}
                                            value={String(page)}
                                        >
                                            {page}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">
                                Baris
                            </span>
                            <Select
                                value={String(filters.per_page)}
                                onValueChange={(value) =>
                                    visitIndex({
                                        per_page: Number(value),
                                        page: 1,
                                    })
                                }
                            >
                                <SelectTrigger size="sm" className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 25, 50, 100].map((size) => (
                                        <SelectItem
                                            key={size}
                                            value={String(size)}
                                        >
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Pagination links={users.links} />
                        </div>
                    </FrameFooter>
                </Frame>
            </div>

            <Dialog
                open={deleteTarget !== null}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus user?</DialogTitle>
                        <DialogDescription>
                            Akun {deleteTarget?.name} akan dihapus permanen.
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                        >
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={deleteUser}>
                            <Trash2 />
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={verificationTarget !== null}
                onOpenChange={(open) => !open && setVerificationTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {verificationTarget?.email_verified_at
                                ? 'Batalkan verifikasi user?'
                                : 'Verifikasi user?'}
                        </DialogTitle>
                        <DialogDescription>
                            {verificationTarget?.email_verified_at
                                ? `Status verifikasi ${verificationTarget.name} akan dibatalkan.`
                                : `${verificationTarget?.name} akan ditandai sebagai user terverifikasi.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setVerificationTarget(null)}
                        >
                            Batal
                        </Button>
                        <Button onClick={toggleUserVerification}>
                            {verificationTarget?.email_verified_at ? (
                                <ShieldOff />
                            ) : (
                                <ShieldCheck />
                            )}
                            Konfirmasi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={confirmBulkDelete}
                onOpenChange={setConfirmBulkDelete}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus user terpilih?</DialogTitle>
                        <DialogDescription>
                            {selectAllMatching
                                ? users.total
                                : selectedIds.length}{' '}
                            akun akan dihapus permanen. Tindakan ini tidak dapat
                            dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmBulkDelete(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={deleteSelectedUsers}
                        >
                            <Trash2 />
                            Hapus semua
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'User',
            href: index(),
        },
    ],
};
