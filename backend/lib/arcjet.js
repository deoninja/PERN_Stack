import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import "dotenv/config";

// init arcjet.
arcjet.init();

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // shield protects your app from common attacks e.g. SQL injection, XSS, CRF attacks
        shield({mode: "LIVE"}),
        detectBot({
            mode: "LIVE",
            // block all bots except search engines
            allow: [
                "CATEGORY:SEARCH_ENGINE"
                // see the full list a https://arcjet.com/bot-list
            ]
        }),
        // Rate limitting

        tokenBucket({
            mode: "LIVE",
            refillRate: 5,
            interval: 10,
            capacity: 10,
                    
        }),
    ]
});