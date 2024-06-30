const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case 400:
      res.json({ title: "Validation error", message: err.message });
      break;
    case 401:
      res.json({ title: "Unauthorized error", message: err.message });
      break;
    case 403:
      res.json({ title: "Forbidden error", message: err.message });
      break;
    case 404:
      res.json({ title: "Not found error", message: err.message });
      break;
    case 500:
      res.json({ title: "Server error", message: err.message });
      break;
    default:
      console.log("No error");
      break;
  }
  res.json({ message: err.message });
};

module.exports = errorHandler;
