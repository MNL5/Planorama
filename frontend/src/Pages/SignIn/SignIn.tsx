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
import authService from '../../Services/Auth/AuthService';
import { CircularProgress } from "@mui/material";
import './SignIn.css';
import useLogin from '../../hooks/useLogin';

const SignIn = () => {
    const form = useAuthForm();
    const {isPending, handleSubmit} = useLogin(authService.signIn);
    const navigate = useNavigate();

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
