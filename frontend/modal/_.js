const modal = function() {
  this.notifyMsg = '';
	this.notifyType = '';
}

modal.prototype.open = function (id) {
	const el = document.getElementById(id);
	if (!el) return;
	bootstrap.Modal.getOrCreateInstance(el).show();
};

modal.prototype.close = function (id) {
	const el = document.getElementById(id);
	if (!el) return;
	bootstrap.Modal.getOrCreateInstance(el).hide();
};

modal.prototype.notify = async function (msg, type) {
  return new Promise((resolve,reject)=>{    
    this.notifyMsg  = msg;
    this.notifyType = type || 'success';
    this.open('mdNotify');
    document.getElementById('btnMdAceptar').addEventListener( 'click' , (event) => {
      this.close('mdNotify');
      resolve(true);
    });
  });
};

modal.prototype.confirm = function (message, cancelText, okText) {
  return new Promise((resolve,reject)=>{    
    this.message  = message;
    this.cancelText  = cancelText;
    this.okText  = okText;
    this.open('mdConfirm');
    document.getElementById('btnMdConfirmOk').addEventListener( 'click' , (event) => {
      this.close('mdConfirm');
      resolve(true);
    });
  });
};

modal.prototype.displayHtml = function (title, html) {
  this.title  = title;
  document.getElementById('dvMdHtml').innerHTML = html;
  this.open('mdHtml');
};

app.modules.modal = modal;