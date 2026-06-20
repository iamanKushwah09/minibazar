require("dotenv").config();
const dns = require("dns");
const mongoose = require("mongoose");

const FALLBACK_DNS_SERVERS = ["1.1.1.1", "8.8.8.8"];

const isLoopbackDnsServer = (server) =>
  server === "127.0.0.1" || server === "::1" || server.startsWith("127.");

const parseDnsServers = (value) =>
  value
    .split(/[\s,]+/)
    .map((server) => server.trim())
    .filter(Boolean);

const configureDnsForAtlas = (uri) => {
  if (!uri || !uri.startsWith("mongodb+srv://")) return;

  const explicitServers = process.env.MONGO_DNS_SERVERS;
  if (explicitServers) {
    const parsedServers = parseDnsServers(explicitServers);
    if (parsedServers.length > 0) {
      dns.setServers(parsedServers);
      console.log("Using DNS servers from MONGO_DNS_SERVERS:", parsedServers);
      return;
    }
  }

  const currentServers = dns.getServers();
  if (!currentServers.length || currentServers.every(isLoopbackDnsServer)) {
    dns.setServers(FALLBACK_DNS_SERVERS);
    console.warn(
      "Node is using loopback DNS for mongodb+srv; falling back to public resolvers:",
      FALLBACK_DNS_SERVERS,
    );
  }
};

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    configureDnsForAtlas(uri);
    await mongoose.connect(uri);
    console.log(
      `mongodb connection success to ${uri.split("/").pop().split("?")[0]}!`,
    );
    console.log("mongodb connection success!");
  } catch (err) {
    console.log("mongodb connection failed!", err.message);
  }
};

module.exports = {
  connectDB,
};
