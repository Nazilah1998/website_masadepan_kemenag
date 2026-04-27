// src/components/VercelSpeedInsights.jsx
"use client";

import { SpeedInsights } from "@vercel/speed-insights/react";

export default function VercelSpeedInsights() {
    return (
        <SpeedInsights
            beforeSend={(data) => {
                const pathname = new URL(data.url).pathname;

                if (pathname.startsWith("/admin")) {
                    return null;
                }

                return data;
            }}
        />
    );
}