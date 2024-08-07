const nJwt = require("njwt");
const secureRandom = require("secure-random");
const fs = require("fs");
const path = require("path");

const keyFilePath = path.join(__dirname, "signingKey.txt");

module.exports = {
  createToken:
    /**
     * Create a JWT token using a claims and a signing key
     * @param {Object} claims JSON object containing at least `iss`, `sub`, `scope` and `aud`.
     * @param {String} signingKey A base64 encoded string with the signing secret.
     * @param {Boolean} compact Where the returned is a JWT String token or the JSON description of the token (header, body and signing key).
     * @param {String} algorithm The algorithm used to create the JWT token. By default is HS2256.
     * @param {Date} expiration A optional parameter with the expiration date. By default is set to 1 hour (60 minutes * 60 seconds * 1000 milliseconds).
     * @returns {type} JWT token configured with the `claims` and `expiration` (optional) passed as parameters.
     */
    function createToken(
      claims,
      signingKey,
      compact = true,
      algorithm = "HS256",
      expiration = new Date().getTime() + 60 * 60 * 1000
    ) {
      try {
        var jwt = nJwt.create(claims, signingKey, algorithm);
        jwt.setExpiration(expiration);
        return compact ? jwt.compact() : jwt;
      } catch (err) {
        console.error(err);
        return "";
      }
    },

  createSigningKey:
    /**
     * Creates a Signing Key based on a type passed. By default set to the `String` 'Buffer'.
     * @param {String} type The type for the Buffer required. By default is set to "Buffer".
     * @returns {String} The Signing Key Secret in Base64 String format.
     * The signingKey is stored in .txt format. If the file already exists, the existing signing key will be used. To create a new signing key, delete the existing file.
     */
    function createSigningKey(type = "Buffer") {
      if (fs.existsSync(keyFilePath)) {
        return fs.readFileSync(keyFilePath, "utf8");
      } else {
        var signingKey = secureRandom(256, { type: type }).toString("base64");
        fs.writeFileSync(keyFilePath, signingKey);
        return signingKey;
      }
    },
};
