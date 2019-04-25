const findServerConfig = ({ host = "", basePath = "/api/v1" }) => {
  let port;
  const parts = host.split(":");
  if (parts[1]) {
    port = Number(parts[1]);
  } else {
    port = process.env.PORT || 12121;
  }
  return {
    port,
    baseUrl: basePath
  };
};

module.exports = {
  findServerConfig
};