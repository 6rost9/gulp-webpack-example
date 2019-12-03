import Animation from './animation.js';

var animation = new Animation;

export default class Form {
  constructor(form) {
    this.$form = $(form);
		this.$formWrap = this.$form.parents('.formWrap');
		this.$submitButton = this.$form.find('button[type="submit"]');
		this.$overlay = this.$formWrap.find('.overlay');
		this.$responce = this.$formWrap.find('.responce');
		this.$policy = this.$form.find('[name="policy"]');
		this.$resend = this.$formWrap.find('[data-resend]');
		this.to = (this.$form.attr('action') == undefined || this.$form.attr('action') == '') ? this.to : this.$form.attr('action');

    this.bind();
  }

  bind() {
		let self = this;

		this.$form.find('[data-dynamic-placeholder]').each(function () {
			$(this).on('blur',function () {
				if ($(this).val() == '') {
					$(this).removeClass('form_input_filled');
				} else {
					$(this).addClass('form_input_filled');
				}
			})
		})

		this.$form.find('[data-required]').each(function() {
				$(this).on('blur', function() {
					self.checkField($(this));
					self.checkValid();
				});
		});

		this.$form.on('submit', function(e) {
				self.sendIfValid(e);
		});

		this.$form.on('click', 'button.disabled', function(e) {
				e.preventDefault();
				return false;
		})

		this.$policy.on('click',function () {
			if ($(this).prop('checked')) {
				if (self.$form.find('.form_input_invalid').length == 0){
					self.$submitButton.removeClass('disabled');
				}
			} else {
				self.$submitButton.addClass('disabled');
			}
		})

		this.$resend.on('click',function () {
			self.reset();
		})
  }

	checkValid() {
		this.$submitButton.removeClass('disabled');
		if (this.$form.find('.form_input_invalid').length > 0) {
			this.$submitButton.addClass('disabled');
		}
	}

	checkField($field) {
			var valid = true;
			var name = $field.attr('name');
			var pattern_email = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;

			if ($field.val() == '') {
					valid = false;
			} else {
					if (name=='phone' && $field.val().indexOf('_') >= 0) {
							valid = false;
							var custom_error = 'Неверный формат телефона';
					}
					if (name=='email' && !(pattern_email.test($field.val()))) {
							valid = false;
							var custom_error = 'Неверный формат электронной почты';
					}
			}
			if (valid) {
					$field.removeClass('form_input_invalid').addClass('form_input_valid');
					if ($field.parent().find('.form_input_error').length > 0) {
							$field.parent().find('.form_input_error').html('');
					}
			} else {
				$field.addClass('form_input_invalid');
				var form_error = $field.data('error') || 'Заполните поле';
				var error_message = custom_error || form_error;

				if ($field.siblings('.form_input_error').length  == 0) {
						$field.parent('.elementWrap').append('<div class="form_input_error">' + error_message + '</div>');
				} else {
					$field.siblings('.form_input_error').html(error_message);
				}
			}
	}

	checkFields() {
		let self = this;
		var valid = true;
		this.$form.find('[data-required]').each(function() {
			if (!$(this).hasClass('form_input_valid')) {
				valid = false;
			}
			self.checkField($(this));
		});

		if (valid) {
			this.$submitButton.removeClass('disabled');
		} else {
			this.$form.find('.form_input_invalid')[0].focus();
			this.$submitButton.addClass('disabled');
		}

		if(!this.$form.find('[name="policy"]').prop('checked')){
			valid = false;
			this.$submitButton.addClass('disabled');
		}

		return valid;
	}

	reset() {
		let self = this;
		this.$form[0].reset();
		this.$form.find('input').removeClass('form_input_valid form_input_filled');

		animation.play(this.$responce,'fade-out',function () {
			self.$responce.addClass('hidden');
		});
	}

	sendIfValid(e) {
		e.preventDefault();
		let self = this;
		var formData = new FormData(this.$form[0]);

		if (this.checkFields()) {
			switch (this.$form.attr('name')) {
				case 'some':

				break;

				default:

				$.ajax({
					beforeSend: function() {
						self.$overlay.removeClass('hidden');
						animation.play(self.$overlay,'fade-in');
					},
					type: 'post',
					url: self.to,
					data: formData,
					processData: false,
					contentType: false,
					success: function(resp) {
						console.log(resp);
						self.$responce.find('.heading').html(resp.title);
						self.$responce.find('.message').html(resp.msg);
						self.$responce.removeClass('hidden');
						animation.play(self.$responce,'fade-in',function () {
							self.$overlay.addClass('hidden');
						});

					},
					error: function (resp) {
						console.log(resp);
						self.$overlay.removeClass('hidden');
						animation.play(self.$overlay,'fade-out');
					}
				});
			}
		}
	}
}
