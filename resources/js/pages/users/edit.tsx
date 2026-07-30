import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import InputError from '@/components/input-error';
import {
    Frame,
    FrameDescription,
    FrameFooter,
    FrameHeader,
    FramePanel,
    FrameTitle,
} from '@/components/reui/frame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index, update } from '@/routes/users';

type User = {
    id: number;
    name: string;
    username: string | null;
    email: string;
};

export default function EditUser({ user }: { user: User }) {
    return (
        <>
            <Head title={`Edit ${user.name}`} />

            <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div>
                    <h1 className="text-xl font-semibold">Edit User</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Perbarui informasi akun pengguna.
                    </p>
                </div>

                <Form {...update.form(user.id)} className="max-w-3xl">
                    {({ processing, errors }) => (
                        <Frame spacing="sm">
                            <FrameHeader>
                                <FrameTitle>Informasi akun</FrameTitle>
                                <FrameDescription>
                                    Perbarui identitas user yang dipilih.
                                </FrameDescription>
                            </FrameHeader>

                            <FramePanel>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="name">Nama</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={user.name}
                                            required
                                            autoComplete="name"
                                            autoFocus
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
                                            defaultValue={user.username ?? ''}
                                            autoComplete="username"
                                        />
                                        <InputError message={errors.username} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue={user.email}
                                            required
                                            autoComplete="email"
                                        />
                                        <InputError message={errors.email} />
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
                                    Simpan
                                </Button>
                            </FrameFooter>
                        </Frame>
                    )}
                </Form>
            </div>
        </>
    );
}

EditUser.layout = {
    breadcrumbs: [
        { title: 'User', href: index() },
        { title: 'Edit User', href: index() },
    ],
};
