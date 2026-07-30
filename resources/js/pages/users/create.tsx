import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import {
    Frame,
    FrameDescription,
    FrameFooter,
    FrameHeader,
    FramePanel,
    FrameTitle,
} from '@/components/reui/frame';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { create, index, store } from '@/routes/users';

export default function CreateUser() {
    return (
        <>
            <Head title="Tambah User" />

            <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div>
                    <h1 className="text-xl font-semibold">Tambah User</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Buat akun pengguna baru.
                    </p>
                </div>

                <Form {...store.form()} className="max-w-3xl">
                    {({ processing, errors }) => (
                        <Frame spacing="sm">
                            <FrameHeader>
                                <FrameTitle>Informasi akun</FrameTitle>
                                <FrameDescription>
                                    Lengkapi identitas dan kredensial user.
                                </FrameDescription>
                            </FrameHeader>

                            <FramePanel>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="name">Nama</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            autoComplete="name"
                                            autoFocus
                                            placeholder="Nama lengkap"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="username">
                                            Username
                                        </Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            autoComplete="username"
                                            placeholder="username"
                                        />
                                        <InputError message={errors.username} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            placeholder="nama@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            autoComplete="new-password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Konfirmasi Password
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            required
                                            autoComplete="new-password"
                                        />
                                    </div>

                                    <div className="flex items-start gap-3 rounded-md border p-3 md:col-span-2">
                                        <input
                                            type="hidden"
                                            name="email_verified"
                                            value="0"
                                        />
                                        <Checkbox
                                            id="email_verified"
                                            name="email_verified"
                                            value="1"
                                            defaultChecked
                                        />
                                        <div className="grid gap-1">
                                            <Label htmlFor="email_verified">
                                                Tandai email terverifikasi
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                User dapat langsung mengakses
                                                halaman yang membutuhkan
                                                verifikasi email.
                                            </p>
                                            <InputError
                                                message={errors.email_verified}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </FramePanel>

                            <FrameFooter className="flex-row justify-end">
                                <Button variant="outline" asChild>
                                    <Link href={index()}>
                                        <ArrowLeft />
                                        Kembali
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save />
                                    Simpan User
                                </Button>
                            </FrameFooter>
                        </Frame>
                    )}
                </Form>
            </div>
        </>
    );
}

CreateUser.layout = {
    breadcrumbs: [
        { title: 'User', href: index() },
        { title: 'Tambah User', href: create() },
    ],
};
