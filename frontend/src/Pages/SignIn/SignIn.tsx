import {
    Anchor,
    Box,
    Button,
    Group,
    PasswordInput,
    Text,
    TextInput,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import useAuthForm from '../../hooks/useFormAuth';
import authService from '../../Services/Auth/AuthService';
import { toast } from 'react-toastify';
import { cacheAuthInfo } from '../../Utils/AuthUtil';

const SignIn = () => {
    const form = useAuthForm();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const { email, password } = values;       

        try {
            const tokens = (
              await authService.signIn({ email, password }).request
            ).data;
            cacheAuthInfo(tokens);
        } catch (error) {
            console.error(error);
            const innerError = error as {
              response: { data: string };
              message: string;
            };
            toast.error(innerError.response.data || "Problem has occured");
        }
    };

    return (
        <Box maw={400} mx="auto">
            <h2>Sign In</h2>
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
                <Button type="submit" mt="md" fullWidth>
                    Sign In
                </Button>
            </form>
            <Group position="apart" mt="md">
                <Text size="sm">Don't have an account?</Text>
                <Anchor
                    size="sm"
                    onClick={() => navigate('/signup')}
                    style={{ cursor: 'pointer' }}
                >
                    Sign Up
                </Anchor>
            </Group>
        </Box>
    );
};

export default SignIn;
