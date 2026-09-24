export interface LoginInter {
    email: string;
    password: string;
    showPassword: boolean;
    message: string;
    isError: boolean;
    users: { email: string; password: string; name: string }[];
    togglePassword(): void;
    onSubmit(): void;
    socialLogin(provider: string): void;
}
