"use strict";

const googleapis = require('./lib/googleapis');

module.exports = {
	
	//@route('/')
	//@method(['get'])
	//@roles(['root','admin','user'])
	renderDocument: function(req,res){
		res.render('account/document',{user: req.user});
	},
	
	//@route('/form')
	//@method(['get'])
	renderForm: function(req,res){
		res.render('account/form');
	},
	
	//@route('/login')
	//@method(['get'])
	renderLogin: function(req,res){
		res.render('account/login', {google_auth: googleapis.getURL()});
	},
	
	//@route('/forget')
	//@method(['get'])
	renderForget: function(req,res){
		res.render('account/forget');
	},
	
	//@route('/recovery')
	//@method(['get'])
	renderRecovery: function(req,res){
		res.render('account/recovery');
	},
	
	//@route('/admin/admin')
	//@method(['get'])
	//@roles(['root','admin'])
	renderAdmin: function(req,res){
		res.render('account/admin');
	}
	
}