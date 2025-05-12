import {
  Card,
  Text,
  Title,
  Group,
  Button,
  Anchor,
  TextInput,
  PasswordInput,
} from "@mantine/core";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import "./sign-up.css";
import useLogin from "../../hooks/use-login";
import useAuthForm from "../../hooks/use-form-auth";
import authService from "../../services/auth-service/auth-service";
import MainLoader from "../mainLoader/MainLoader";

const SignUp = () => {
  const form = useAuthForm(true); // Enable confirm password validation
  const navigate = useNavigate();
  const { isPending, handleSubmit } = useLogin(authService.signUp);

  return (
    <div className="auth-page">
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card
          shadow="lg"
          radius="md"
          p="xl"
          className="auth-card"
          style={isPending ? { pointerEvents: "none", opacity: 0.4 } : {}}
        >
          <MainLoader isPending={isPending} />
          <Title order={2} className="auth-title">
            Sign Up
          </Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              className="auth-input"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              className="auth-input"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              className="auth-input"
              {...form.getInputProps("confirmPassword")}
            />
            <Button type="submit" fullWidth mt="md" className="auth-button">
              Sign Up
            </Button>
          </form>
          <Group mt="md">
            <Text size="sm">Already have an account?</Text>
            <Anchor
              size="sm"
              onClick={() => navigate("/signin")}
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
