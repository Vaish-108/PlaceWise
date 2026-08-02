const dns = require("dns");

dns.lookup(
  "ac-4h2ar8o-shard-00-00.n80suuw.mongodb.net",
  (err, address) => {
    console.log(err);
    console.log(address);
  }
);