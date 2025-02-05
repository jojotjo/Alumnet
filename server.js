require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const FINANCE_API_URL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${process.env.FINANCE_API_KEY}`;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend"))); // Serve frontend files

// API Route - Fetch financial data
app.get("/api/financial-data", async (req, res) => {
    try {
        const response = await axios.get(FINANCE_API_URL, {
            params: {
                ids: "bitcoin,ethereum",
                vs_currencies: "usd",
            },
        });

        res.json({
            stockMarket: { index: "S&P 500", value: 4550, change: "+1.2%" },
            crypto: {
                bitcoin: `$${response.data.bitcoin.usd}`,
                ethereum: `$${response.data.ethereum.usd}`,
            },
            currencyExchange: { USD_TO_EUR: "0.92", USD_TO_GBP: "0.79" },
        });
    } catch (error) {
        console.error("Error fetching financial data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Catch-all route (for frontend routing)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
