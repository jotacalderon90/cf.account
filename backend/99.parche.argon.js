"use strict";

const password = require('./lib/password');

module.exports = {
	
	//@route('/api/parcheargon')
	//@method(['get'])
  parcheargon: async function(req, res) {
    try {
      
      res.json({
        data: await password.hash(req.query.password)
      });
        
    } catch (error) {
      res.json({
        error: error
      });
    }
  }
	
}