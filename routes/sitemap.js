var express = require('express'),
    router = express.Router();
    
var hostName = process.env.SITE_URL || 'https://est-nachrism.c9users.io'

var sm = require('sitemap'),
    sitemap = sm.createSitemap({
        hostname : hostName,
        cacheTime : 1000 * 60 * 24  //keep the sitemap cached for 24 hours
    });
 
router.get('/sitemap.xml', function(req, res) {
  sitemap.toXML( function (err, xml) {
      if (err) {
        return res.status(500).end();
      }
      res.header('Content-Type', 'application/xml');
      res.send( xml );
  });
});

module.exports = router;