var crypto = require('crypto');

module.exports = function verifyFacebookSignatureHeader(req, res, buf) {
  var signature = req.headers['x-hub-signature'];
  if (!signature) {
    console.log('Signature absent in the request: %s', JSON.stringify(req));
  } else {
    // Get the facebook signature

    var elements = signature.split('sha1=');
    var facebookSignature = elements[1];
    console.log("facebookSignature : "+facebookSignature);
    var expectedSignature = crypto.createHmac('sha1','b424e04d4e47adcc4ed71c3c798b8504')
      .update(buf)
      .digest('hex');
      console.log("expectedSignature : "+expectedSignature);
    if (facebookSignature !== expectedSignature) {
      throw new Error('Could not verify message was sent from Facebook.');
    }
  }

};
