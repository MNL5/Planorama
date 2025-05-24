import {
  Card,
  Text,
  Group,
  Title,
  Button,
  Anchor,
  TextInput,
  PasswordInput,
} from "@mantine/core";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import "./sign-in.css";
import useLogin from "../../hooks/use-login";
import useAuthForm from "../../hooks/use-form-auth";
import authService from "../../services/auth-service/auth-service";
import MainLoader from "../mainLoader/MainLoader";

const SignIn = () => {
  const form = useAuthForm();
  const { isPending, handleSubmit } = useLogin(authService.signIn);
  const navigate = useNavigate();

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
            Sign In
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
            <Button
              fullWidth
              mt={"md"}
              radius={"md"}
              type={"submit"}
              className="auth-button"
            >
              Sign In
            </Button>
          </form>
          <Group mt="md">
            <Text size="sm">Don't have an account?</Text>
            <Anchor
              size="sm"
              onClick={() => navigate("/signup")}
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
