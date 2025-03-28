import { Box, Button, PasswordInput, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import useAuthForm from '../../hooks/useFormAuth';

const SignUp = () => {
    const form = useAuthForm(true); // Pass true to enable confirm password validation
    const navigate = useNavigate();

    const handleSubmit = (values) => {
        console.log('Sign-Up Data:', values);
        navigate('/');
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
