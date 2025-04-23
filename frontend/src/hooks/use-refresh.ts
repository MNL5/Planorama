import { CanceledError } from 'axios';
import { useEffect, useState } from 'react';

import AuthService from '../services/auth-service/auth-service';
import { cacheAuthInfo, getRefreshToken } from '../utils/auth-utils';

const useRefresh = (disable: boolean) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const refreshToken = getRefreshToken();
        if (refreshToken && !disable) {
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
