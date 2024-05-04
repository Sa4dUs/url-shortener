import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (router.query.id) {
            fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/url?id=${router.query.id}`
            )
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data.url) {
                        window.location.href = data.url;
                    } else {
                        setError(true);
                    }
                })
                .catch((err) => {
                    setError(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [router.query.id]);

    if (loading) {
        return (
            <>
                <Head>
                    <title>URL Shortener | ...</title>
                </Head>
                <div className="flex items-center justify-center h-screen">
                    <div className="loader border-t-4 border-b-4 border-black rounded-full w-12 h-12 animate-spin"></div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Head>
                    <title>URL Shortener | Not found</title>
                </Head>
                <div className="text-center mt-8">
                    <h1 className="text-2xl text-black">
                        Error: Unable to redirect.
                    </h1>
                    <p className="text-base text-black mt-4">
                        The shortened URL could not be found. Please check the
                        URL and try again.
                    </p>
                    <a
                        href="/"
                        className="text-black hover:text-gray-500 mt-4 block"
                    >
                        Go to main page
                    </a>
                </div>
            </>
        );
    }

    return null;
}
