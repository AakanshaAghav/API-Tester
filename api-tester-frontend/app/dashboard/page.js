"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import ApiTester from "../apiTester";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async () => {
            const { data } = await supabase.auth.getSession();

            if (!data.session) {
                router.push("/login");
            } else {
                setUser(data.session.user);
                setLoading(false);
            }
        };

        check();
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;

    return <ApiTester user={user} />;
}
