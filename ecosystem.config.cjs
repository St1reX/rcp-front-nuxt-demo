module.exports = {
  apps: [
    {
      name: "rcp-front",
      exec_mode: "cluster",
      instances: 4,
      script: ".output/server/index.mjs",
      interpreter: "node",
      interpreter_args: "--experimental-specifier-resolution=node",
    },
  ],
};
