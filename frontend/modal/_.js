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
    /*document.getElementById('btnMdAceptar').addEventListener( 'click' , (event) => {
      this.close('mdNotify');
      resolve(true);
    });*/
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
    /*document.getElementById('btnMdConfirmOk').addEventListener( 'click' , (event) => {
      this.close('mdConfirm');
      resolve(true);
    });
    document.getElementById('btnMdConfirmCancel').addEventListener( 'click' , (event) => {
      this.close('mdConfirm');
      resolve(false);
    });*/
  });
};

modal.prototype.prompt = function(msg, type, placeholder, value) {
	return new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
    this.data.prompt.msg = msg;
    this.data.prompt.type = type;
    this.data.prompt.placeholder = placeholder;
    this.data.prompt.value = value;
    this.data.mdCurrent = 'mdPrompt';
    this.open(this.data.mdCurrent);
    /*
      
		const modal = document.getElementById('mdPrompt');
		const modalB = new bootstrap.Modal(modal);
		
		//titulo
		modal.querySelector('.modal-title').textContent = title;
		
		//boton cerrar
		const btnHead = modal.querySelector('.btn-close');
		const newBtn = btnHead.cloneNode(true);
		btnHead.parentNode.replaceChild(newBtn, btnHead);
		newBtn.addEventListener('click', () => {
			modalB.hide();
			resolve('');
		});
			
		//input
		const input = document.createElement('input');
		input.type = type;
		input.value = value || '';
		input.placeholder = placeholder;
		input.classList.add('form-control');
		input.addEventListener('keypress', function(event) {
			if (event.key === 'Enter') {
				modalB.hide();
				resolve(this.value);
			}
		});
		modal.querySelector('.modal-body').innerHTML = '';
		modal.querySelector('.modal-body').appendChild(input);
		input.focus();
		
		modal.addEventListener('shown.bs.modal', function handler() {
			input.focus();
			modal.removeEventListener('shown.bs.modal', handler);
		});

		modalB.show();*/
	});
}

modal.prototype.displayHtml = function (msg, html) {
  this.data.html.msg  = msg;
  document.getElementById('dvMdHtml').innerHTML = html;
  this.open('mdHtml');
};

app.modules.modal = modal;