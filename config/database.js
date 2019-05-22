if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb://kartikey:KARTIKEY@123@ds121589.mlab.com:21589/vidjot-dev-prod"
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost:27017/vidjot-dev2"
  };
}
