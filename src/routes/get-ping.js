module.exports = (req, res) => {
  res.json(
    {
      version: process.env.npm_package_version,
      name: process.env.npm_package_name,
    }
  );
};
