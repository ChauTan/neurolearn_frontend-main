const AUTH_BASE_URL = `${process.env.BACKEND_BASE_URL}/auth`;

export async function signIn({ email, password }: { email: string; password: string }) {
    try {
        const res = await fetch(`${AUTH_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const user = await res.json();
        return user;
    } catch {
        throw new Error('Could not sign in');
    }
}
