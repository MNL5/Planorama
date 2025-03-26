import { CanceledError } from 'axios';
import { useEffect, useState } from 'react';
import AuthService from '../../Services/Auth/AuthService';
import { cacheAuthInfo, getRefreshToken } from '../../Utils/AuthUtil';

const AuthContainer = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCreateUser, setCreateUser] = useState<boolean>(false);

    useEffect(() => {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            const { request, abort } = AuthService.refresh(refreshToken);
            request
                .then((response) => {
                    cacheAuthInfo(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    if (!(error instanceof CanceledError)) {
                        setIsLoading(false);
                    }
                });

            return abort;
        } else {
            setIsLoading(false);
        }
    }, []);

    // TODO: add isLoading and a circular progress or something
    return isCreateUser ? (
        <SignUpForm switchToSignIn={() => setCreateUser(false)} />
    ) : (
        <SignInForm switchToSignUp={() => setCreateUser(true)} />
    );
};

export default AuthContainer;
