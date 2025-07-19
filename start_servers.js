const { spawn } = require("child_process");

const servers = ["server1.js", "server2.js", "server.js", "Profile1.js", "Bookings1.js", "choice1.js"]; // List your server files here

servers.forEach((server) => {
    const process = spawn("node", [server], { stdio: "inherit" });
    process.on("close", (code) => {
        console.log(`Server ${server} exited with code ${code}`);
    });
});
