const modal = function() {
  
  this.data = {
    mdCurrent: '',
    notify: {
      msg: '',
      type: ''
    },
    confirm: {
      msg: '',
      okText: '',
      cancelText: ''
    },
    prompt: {
      msg: '',
      type: 'text',
      placeholder: '',
      value: ''
    },
    html: {
      msg: '',
      html: ''
    }
  }
  
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

modal.prototype.aceptar = function (data) {
  this.close(this.data.mdCurrent);
  this.resolve(data || true);
}

modal.prototype.cancelar = function (data) {
  this.close(this.data.mdCurrent);
  this.resolve(data || false);
}

modal.prototype.notify = async function (msg, type) {
  return new Promise((resolve,reject)=>{    
    this.resolve = resolve;
    this.reject = reject;
    this.data.notify.msg  = msg;
    this.data.notify.type = type || 'success';
    this.data.mdCurrent = 'mdNotify';
    this.open(this.data.mdCurrent);
  });
};

modal.prototype.confirm = function (msg, cancelText, okText) {
  return new Promise((resolve,reject)=>{    
    this.resolve = resolve;
    this.reject = reject;
    this.data.confirm.msg = msg;
    this.data.confirm.cancelText = cancelText;
    this.data.confirm.okText = okText;
    this.data.mdCurrent = 'mdConfirm';
    this.open(this.data.mdCurrent);
  });
};

modal.prototype.prompt = function(msg, type, placeholder, value) {
	return new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
    this.data.prompt.msg = msg;
    this.data.prompt.type = type;
    this.data.prompt.placeholder = placeholder;
    this.data.prompt.value = value || '';
    this.data.mdCurrent = 'mdPrompt';
    this.open(this.data.mdCurrent);
	});
}

modal.prototype.displayHtml = function (msg, html) {
  this.data.html.msg  = msg;
  document.getElementById('dvMdHtml').innerHTML = html;
  this.open('mdHtml');
};

app.modules.modal = modal;