"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";
import { ArrowRight, Cloud, Code, GitBranch, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                router.push("/dashboard");
            }
        };
        checkUser();
    }, []); 

    const FeatureCard = ({ Icon, title, description }) => (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 flex flex-col items-start text-left shadow-2xl transition-all duration-300 hover:bg-gray-700 hover:border-blue-500 hover:scale-[1.02] cursor-default">
            <Icon className="h-10 w-10 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-base text-gray-300">
                {description}
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center pt-20 pb-16 px-4">
            {/* Hero Section */}
            <header className="text-center text-white max-w-4xl mx-auto mb-20">
                {/* Updated icon and styling */}
                <Code className="mx-auto h-20 w-20 text-green-400 mb-6 drop-shadow-lg" />
                <h1 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 drop-shadow-xl">
                    API Tester Pro
                </h1>
                <p className="text-xl md:text-2xl mb-10 text-gray-300">
                    The **professional platform** for testing, managing, and organizing your API workflow efficiently.
                </p>

                {/* Buttons - Maintained original logic */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    <button
                        onClick={() => router.push("/login")}
                        className="bg-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-xl transform transition-all duration-300 hover:bg-blue-500 hover:shadow-blue-500/50 flex items-center justify-center gap-2"
                    >
                        Login <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => router.push("/signup")}
                        className="bg-green-600 text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-xl transform transition-all duration-300 hover:bg-green-500 hover:shadow-green-500/50 flex items-center justify-center gap-2"
                    >
                        Signup <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <hr className="w-1/3 border-t border-gray-700 mb-20" />

            {/* Features Section */}
            <section className="w-full max-w-7xl">
                <h2 className="text-4xl font-bold text-center text-white mb-12">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1: Collections (Updated to be more specific) */}
                    <FeatureCard
                        Icon={GitBranch}
                        title="Structured Collections"
                        description="Group complex requests logically into folders and sub-folders to manage projects of any scale."
                    />

                    {/* Feature 2: High-Performance Requests (Replacing the generic Server icon) */}
                    <FeatureCard
                        Icon={Zap}
                        title="Rapid Testing"
                        description="Execute all major HTTP methods (GET, POST, PUT, DELETE, PATCH) with lightning-fast response parsing."
                    />

                    {/* Feature 3: History (Updated to emphasize traceability) */}
                    <FeatureCard
                        Icon={Cloud}
                        title="Cloud History Sync"
                        description="Automatically track every request and sync history across devices for full traceability and quick re-runs."
                    />

                    {/* New Feature 4: Environment Variables */}
                    <FeatureCard
                        Icon={Code}
                        title="Environment Variables"
                        description="Define dynamic variables for different environments (Dev, Staging, Prod) to easily switch configurations."
                    />

                    {/* New Feature 5: Security */}
                    <FeatureCard
                        Icon={ShieldCheck}
                        title="Robust Authentication"
                        description="Seamlessly handle various auth methods including OAuth 2.0, JWT, and Basic Auth right in your requests."
                    />

                    {/* New Feature 6: Responsive UI */}
                    <FeatureCard
                        Icon={ArrowRight} // Reusing an icon for visual balance
                        title="Intuitive Design"
                        description="A clean, dark-mode interface designed for power users, ensuring maximum focus and efficiency."
                    />
                </div>
            </section>
        </div>
    );
}