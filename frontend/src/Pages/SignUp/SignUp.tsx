import {
    Anchor,
    Box,
    Button,
    Card,
    Group,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthForm from '../../hooks/useFormAuth';
import authService from '../../services/Auth/AuthService';
import './SignUp.css';
import { toast } from 'react-toastify';
import { cacheAuthInfo } from '../../Utils/AuthUtil';

const SignUp = () => {
    const form = useAuthForm(true); // Enable confirm password validation
    const navigate = useNavigate();

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
        <div className="auth-page">
            <motion.div
                className="auth-container"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Card shadow="lg" radius="md" p="xl" className="auth-card">
                    <Title order={2} className="auth-title">Sign Up</Title>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput
                            label="Email"
                            placeholder="Enter your email"
                            className="auth-input"
                            {...form.getInputProps('email')}
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Enter your password"
                            className="auth-input"
                            {...form.getInputProps('password')}
                        />
                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                            className="auth-input"
                            {...form.getInputProps('confirmPassword')}
                        />
                        <Button type="submit" fullWidth mt="md" className="auth-button">
                            Sign Up
                        </Button>
                    </form>
                    <Group position="apart" mt="md">
                        <Text size="sm">Already have an account?</Text>
                        <Anchor
                            size="sm"
                            onClick={() => navigate('/signin')}
                            className="auth-link"
                        >
                            Sign In
                        </Anchor>
                    </Group>
                </Card>
            </motion.div>
        </div>
    );
};

export default SignUp;
