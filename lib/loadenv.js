function loadenv() {
  const config = {};
  Object.keys(process.env).forEach(name => {
    const parts = name.split("_");
    if (parts[0] === "swagger") config[part[1]] = process.env[name];
  });
  return config;
}

module.exports = loadenv;
