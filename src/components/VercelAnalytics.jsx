// src/components/VercelAnalytics.jsx
"use client";

import { Analytics } from "@vercel/analytics/react";

export default function VercelAnalytics() {
    return (
        <Analytics
            beforeSend={(event) => {
                const pathname = new URL(event.url).pathname;

                if (pathname.startsWith("/admin")) {
                    return null;
                }

                return event;
            }}
        />
    );
}