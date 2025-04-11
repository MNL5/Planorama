import { CanceledError } from 'axios';
import { useEffect, useState } from 'react';
import AuthService from '../services/Auth/AuthService';
import { cacheAuthInfo, getRefreshToken } from '../utils/AuthUtil';

const useRefresh = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
                        console.log('Failed to refresh token');
                        setIsLoading(false);
                    }
                });

            return abort;
        } else {
            setIsLoading(false);
        }
    }, []);

    return { isLoading };
};

export default useRefresh;
