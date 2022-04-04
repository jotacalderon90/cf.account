"use strict";

module.exports = {
	
	//@route('/')
	//@method(['get'])
	//@roles(['root','admin','user'])
	renderDocument: function(req,res){
		res.render('document',{user: req.user});
	},
	
	//@route('/form')
	//@method(['get'])
	renderForm: function(req,res){
		res.render('form');
	},
	
	//@route('/login')
	//@method(['get'])
	renderLogin: function(req,res){
		res.render('login');
	},
	
	//@route('/forget')
	//@method(['get'])
	renderForget: function(req,res){
		res.render('forget');
	},
	
	//@route('/recovery')
	//@method(['get'])
	renderRecovery: function(req,res){
		res.render('recovery');
	},
	
	//@route('/admin/admin')
	//@method(['get'])
	//@roles(['root','admin'])
	renderAdmin: function(req,res){
		res.render('admin');
	}
	
}