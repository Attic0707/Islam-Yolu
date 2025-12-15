// app.config.js
export default ({ config }) => ({
  ...config,
  android: {
    ...(config.android ?? {}),
    package: "com.tavanarasi.islamapp",
  },
});
