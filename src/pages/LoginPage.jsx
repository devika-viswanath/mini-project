import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const LoginPage = () => {
    const { setUser } = useAppContext();
    const navigate = useNavigate();
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setUser({
            email: email || "test@greatstack.dev",
            name: name || "GreatStack"
        })
        navigate('/'); // Redirect to home after login
    }
    
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {state === "login" ? "Sign in to your account" : "Create your account"}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {state === "login" ? "Welcome back to GreenCart" : "Join GreenCart today"}
                    </p>
                </div>
                
                <form onSubmit={onSubmitHandler} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
                    <div className="space-y-4">
                        {state === "register" && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input 
                                    id="name"
                                    onChange={(e) => setName(e.target.value)} 
                                    value={name} 
                                    placeholder="Enter your full name" 
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                    type="text" 
                                    required 
                                />
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input 
                                id="email"
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                placeholder="Enter your email" 
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                type="email" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input 
                                id="password"
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                placeholder="Enter your password" 
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                type="password" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {state === "register" ? (
                            <p className="text-sm">
                                Already have an account? {" "}
                                <button 
                                    type="button"
                                    onClick={() => setState("login")} 
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Sign in
                                </button>
                            </p>
                        ) : (
                            <p className="text-sm">
                                Don't have an account? {" "}
                                <button 
                                    type="button"
                                    onClick={() => setState("register")} 
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Sign up
                                </button>
                            </p>
                        )}
                    </div>

                    <div>
                        <button 
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {state === "register" ? "Create Account" : "Sign In"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
