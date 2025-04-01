import {
    Anchor,
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
import { toast } from 'react-toastify';
import { cacheAuthInfo } from '../../Utils/AuthUtil';
import authService from '../../Services/Auth/AuthService';
import { CircularProgress } from "@mui/material";
import './SignIn.css';
import { useTransition } from 'react';

const SignIn = () => {
    const form = useAuthForm();
    const [isPending, startTransition] = useTransition();
    const navigate = useNavigate();

    const handleSubmit = (values) => {
        startTransition(async () => {
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
        })
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-container"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Card shadow="lg" radius="md" p="xl" className="auth-card" style={isPending ? { pointerEvents: "none", opacity: .4 } : {}}>
                    {isPending && <CircularProgress color="secondary" style={{position: "absolute", top: "40%", left: "45%", zIndex: 10, opacity: 1}} /> }
                    <Title order={2} className="auth-title">
                        Sign In
                    </Title>
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
                        <Button
                            type="submit"
                            fullWidth
                            mt="md"
                            className="auth-button"
                        >
                            Sign In
                        </Button>
                    </form>
                    <Group position="apart" mt="md">
                        <Text size="sm">Don't have an account?</Text>
                        <Anchor
                            size="sm"
                            onClick={() => navigate('/signup')}
                            className="auth-link"
                        >
                            Sign Up
                        </Anchor>
                    </Group>
                </Card>
            </motion.div>
        </div>
    );
};

export default SignIn;
