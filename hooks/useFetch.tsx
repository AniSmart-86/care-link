import { useState } from "react";
import { toast } from "sonner"; // Assuming you're using Sonner for notifications

const useFetch = (cb: (...args: any[]) => Promise<any>) => {
    const [data, setData] = useState<any>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    const fn = async (...args: any[]) => {
        setLoading(true);
        setError(null);
        try {
            const response = await cb(...args);
            setData(response);
        } catch (error: any) {
            setError(error);
            toast.error(error?.message || "An error occurred");
            console.error("Error in useFetch:", error);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fn, setData, setLoading, setError };
};

export default useFetch;