import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Card from "../components/defaultcard";
import find_a_game_logo from "../assets/find_a_game_logo.png"
import { toast } from "react-toastify";
interface LoginProps {
    theme: string;
}

const Login: React.FC<LoginProps> = ({ theme }) => {
    const { login, signUp, isLoggedIn } = useUser();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (isSignUp) {
                if (!displayName) {
                    toast.error("Please enter a displayName");
                    return;
                }
                await signUp(email, password, displayName);
            } else {
                await login(email, password);
            }
        } catch (error) {
            toast.error(isSignUp ? "Sign Up failed" : "Login failed");
        }
    };

    return (
        <Card
            title="Login"
            theme={theme}
            // footerContent={<button className="text-blue-500">Footer Action</button>}
        >
            <div className="p-2 flex justify-center">
                <div className="px-4 pb-4 text-xs bg-neutral-500 bg-opacity-95 rounded-lg w-80">
                    <div className="h-32 sm:mx-auto sm:max-w-sm flex justify-center">
                        <img
                            alt="sidegames.golf"
                            src={find_a_game_logo}
                            className="mt-4"
                        />

                    </div>

                    <div className="mt-2 sm:mx-auto sm:max-w-sm text-left">
                        <form action="#" method="POST" className="space-y-1" onSubmit={handleAuth}>
                            <h2 className="text-center text-lg">
                                {isSignUp ? "Sign Up" : "Sign In"}
                            </h2>
                            <div>
                                <label htmlFor="email" className="">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                    />
                                </div>
                            </div>

                            {isSignUp && (
                                <div>
                                    <label htmlFor="displayName" className="">
                                        Display Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="displayName"
                                            name="displayName"
                                            type="text"
                                            required={isSignUp}
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full rounded-lg py-1.5 focus:ring-1 focus:ring-indigo-600"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    className="mt-5 w-full flex justify-center rounded-lg bg-indigo-600 py-1.5 text-sm/6 text-white hover:bg-indigo-500"
                                >
                                    {isSignUp ? "Sign Up" : "Sign In"}
                                </button>
                            </div>
                        </form>

                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="mt-2 text-white"
                        >
                            {isSignUp ? (
                                <>
                                    Already have an account? <span className="hover:text-indigo-600">Sign In</span>
                                </>
                            ) : (
                                <>
                                    Don't have an account? <span className="hover:text-indigo-600">Sign Up</span>
                                </>
                            )}
                        </button>
                        <div className="mt-4">
                            <div className="flex justify-center">
                                <span className="">Or continue with</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <a
                                href="#"
                                className="flex items-center justify-center gap-3 rounded-md bg-white px-3 py-2 sm:hover:bg-neutral-300"
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                                    <path
                                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                        fill="#EA4335"
                                    />
                                    <path
                                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                        fill="#34A853"
                                    />
                                </svg>
                                <span>Google</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Login;