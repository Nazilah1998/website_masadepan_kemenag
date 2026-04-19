"use client";

import { useEffect, useState } from "react";

function SunIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2.5" />
            <path d="M12 19.5V22" />
            <path d="M4.93 4.93l1.77 1.77" />
            <path d="M17.3 17.3l1.77 1.77" />
            <path d="M2 12h2.5" />
            <path d="M19.5 12H22" />
            <path d="M4.93 19.07l1.77-1.77" />
            <path d="M17.3 6.7l1.77-1.77" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M21 12.79A9 9 0 1 1 11.21 3c-.06.49-.09.99-.09 1.5A8.5 8.5 0 0 0 19.5 13c.51 0 1.01-.03 1.5-.21Z" />
        </svg>
    );
}

function resolveTheme() {
    if (typeof window === "undefined") return "light";

    const root = document.documentElement;

    return (
        root.getAttribute("data-admin-theme") ||
        root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
}

export default function AdminThemeToggle() {
    const [theme, setTheme] = useState(resolveTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-admin-theme", theme);
    }, [theme]);

    function toggleTheme() {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="admin-icon-button"
            aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
            title={theme === "dark" ? "Mode terang" : "Mode gelap"}
        >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
    );
}