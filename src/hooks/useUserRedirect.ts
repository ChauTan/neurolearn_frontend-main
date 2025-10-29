import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';

const useUserRedirect = () => {
    // Add refetch function from the query
    const {
        data: userData,
        isLoading: isLoadingUser,
        refetch
    } = useLoadUserQuery(undefined, {
        // Optionally force a fresh request (skip cache)
        refetchOnMountOrArgChange: true
    });

    useEffect(() => {
        // Trigger refetch when the hook mounts
        refetch();

        // Redirect logic
        if (!isLoadingUser && !userData) {
            redirect('/');
        }
    }, [userData, isLoadingUser, refetch]);

    return { userData, isLoadingUser, refetch };
};

export default useUserRedirect;
