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
    document.getElementById('btnMdConfirmCancel').addEventListener( 'click' , (event) => {
      this.close('mdConfirm');
      resolve(false);
    });
  });
};

modal.prototype.prompt = function(title, type, placeholder, value) {
	return new Promise((resolve, reject) => {
			
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

		modalB.show();
	});
}

modal.prototype.displayHtml = function (title, html) {
  this.title  = title;
  document.getElementById('dvMdHtml').innerHTML = html;
  this.open('mdHtml');
};

app.modules.modal = modal;