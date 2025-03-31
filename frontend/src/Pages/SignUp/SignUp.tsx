import { Box, Button, PasswordInput, TextInput } from '@mantine/core';
import useAuthForm from '../../hooks/useFormAuth';
import authService from '../../Services/Auth/AuthService';
import { toast } from 'react-toastify';
import { cacheAuthInfo } from '../../Utils/AuthUtil';

const SignUp = () => {
    const form = useAuthForm(true); // Pass true to enable confirm password validation

    const handleSubmit = async (values) => {
        const { email, password } = values;
        console.log('Signup Data:', values);
        try {
            const tokens = (await authService.signUp({ email, password }).request).data;
            cacheAuthInfo(tokens);
        } catch (error) {
            console.error(error);
            const innerError = error as { response: { data: string }; message: string };
            toast.error(innerError.response.data || "Problem has occured");
        }
    };

    return (
        <Box maw={400} mx="auto">
            <h2>Sign Up</h2>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Email"
                    placeholder="Enter your email"
                    {...form.getInputProps('email')}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    {...form.getInputProps('password')}
                />
                <PasswordInput
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    {...form.getInputProps('confirmPassword')}
                />
                <Button type="submit" mt="md" fullWidth>
                    Sign Up
                </Button>
            </form>
        </Box>
    );
};

export default SignUp;
