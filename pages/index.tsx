import Head from "next/head";
import { useState, ChangeEvent, FormEvent } from "react";

export default function Home(): JSX.Element {
    const [link, setLink] = useState<string>("");
    const [short, setShort] = useState<string | null>(null);
    const [copyFeedback, setCopyFeedback] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();
        setLoading(true);

        const data = {
            link: link,
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/url`,
                options
            );
            const responseData = await response.json();
            setShort(responseData.url);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }

        setLink("");
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLink(event.target.value);
    };

    const copyToClipboard = (): void => {
        if (short) {
            navigator.clipboard.writeText(short);
            setCopyFeedback("Copied to clipboard!");
            setTimeout(() => {
                setCopyFeedback("");
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center bg-white">
            <Head>
                <title>URL Shortener</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex-grow py-10">
                <div className="max-w-md bg-white ">
                    <div className="shadow-md rounded p-8">
                        <h1 className="text-3xl font-bold mb-4 text-center text-black">
                            URL Shortener
                        </h1>

                        <form onSubmit={handleSubmit} className="text-center">
                            <input
                                className="border border-gray-300 rounded py-2 px-3 w-full mb-4"
                                type="text"
                                placeholder="Enter the link here"
                                value={link}
                                onChange={handleChange}
                            />
                            <button
                                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded w-full"
                                type="submit"
                            >
                                {loading ? "Loading..." : "Shorten URL"}
                            </button>
                        </form>
                    </div>

                    {short && (
                        <div className="shadow-md rounded p-8">
                            <div className="mt-4 text-center">
                                <p className="text-gray-700 mb-2 text-xl">
                                    Shortened URL:
                                </p>
                                <div className="bg-white p-3 rounded">
                                    <a
                                        className="text-black hover:underline break-all"
                                        href={short}
                                    >
                                        {short}
                                    </a>
                                </div>
                                <button
                                    className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded w-full mt-4"
                                    onClick={copyToClipboard}
                                >
                                    {copyFeedback || "Copy to Clipboard"}
                                </button>
                            </div>
                        </div>
                    )}
                    {loading && (
                        <div className="mt-4 text-center text-black">
                            Loading...
                        </div>
                    )}
                </div>
            </main>

            <footer className="text-center py-4 text-gray-600">
                © 2024 Made with ♥ by Sa4dUs
            </footer>
        </div>
    );
}
