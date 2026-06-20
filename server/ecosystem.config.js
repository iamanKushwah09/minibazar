// module.exports = {
//   apps: [
//     {
//       name: "next-app",
//       cwd: "C:/inetpub/wwwroot/www.selectionfootwear.com",
//       script: "node_modules/next/dist/bin/next",
//       args: "start",
//     }
//   ]
// };
// pm2 delete next-app     # optional: if previously failed
// pm2 start ecosystem.config.js
// pm2 save


// module.exports = {
//   apps: [
//     {
//       name: "next-app",
//       cwd: "C:/inetpub/wwwroot/www.selectionfootwear.com",
//       script: "node_modules/next/dist/bin/next",
//       args: "start",
//       instances: 1,
//       exec_mode: "fork",
//       env: {
//         NODE_ENV: "production",
//         PORT: 3000
//       }
//     }
//   ]
// };


module.exports = {
  apps: [
    {
      name: "next-app",
      cwd: "C:/inetpub/wwwroot/www.selectionfootwear.com",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      watch: false, // prevents unnecessary restarts due to file changes
      autorestart: true, // automatically restarts on crash
      restart_delay: 5000, // wait 5 seconds before restarting
      max_restarts: 10, // prevent infinite crash-restart loops
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
