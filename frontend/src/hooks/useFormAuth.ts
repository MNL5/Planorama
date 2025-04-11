import { useForm } from '@mantine/form';

const useAuthForm = (isSignUp = false) => {
    return useForm({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email',
            password: (value) =>
                value.length >= 6
                    ? null
                    : 'Password must be at least 6 characters',
            confirmPassword: isSignUp
                ? (value, values) =>
                      value === values.password
                          ? null
                          : 'Passwords do not match'
                : undefined,
        },
    });
};

export default useAuthForm;
