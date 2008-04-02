/*

Tokenizer
created by: Michael Bumann - http://railslove.com
questions? michael@railslove.com

The Tokenizer allows you create inputs fields similar to Apple Mails's or facebook's receiver field.
It uses the script.aculo.us autocompleter

NEEDS TO BE REFACTORED! - but works...  ;)

If you have questions. please email me: michael@railslove.com

REQUIREMENTS:
=========
* Prototype
* Script.aculo.us

USAGE:
=========

	<div id="receivers" class="tokenizer">
	</div>
	<script type="text/javascript" charset="utf-8">
	  tokenizer = new Tokenizer("receivers",{inputName:"receivers[]",autocompleteURL:"/posts/receivers", autocompleteParam:"user"});
	</script>
	
	
THIS WILL CREATE:

	<div class="tokenizer">
		<div style="display: inline;"></div>
			<input name="tokens_input" class="tokenizer_input" style="width: 20px;" autocomplete="off"/>
			<div class="tokenizer_autocomplete" style="display: none;"></div>
		</div>
	</div>
	
TOKENS LOOK LIKE:
	
	<div class="token" id="token_1">
		<input type="checkbox" name="receivers[]" value="dude"/><span>dude</span><img src="/images/buttons/token_close.png" alt="close"/>
	</div>

*/


Tokenizer = Class.create();
Object.extend(Tokenizer.prototype,{
	wrapper: '',
	options: {},
	token_ids: [],
	token_id_numbers: [],
	initialize: function(wrapper, options){
		this.options = {
			inputName: "token[]",
			// where is your close (x) button??? 
			closeButton: "/images/buttons/token_close.gif",
			
			autocompleteURL: "",
			autocompleteParam: "",
		};
		Object.extend(this.options,options || {});
		this.wrapper = $(wrapper);
		this.wrapper.observe('click',function(event){
			this.input_element.focus();
		}.bind(this));
		this.input_element = $(document.createElement('input'));
		this.input_element.name="tokens_input";
		this.input_element.className='tokenizer_input';
		this.input_element.id = this.wrapper.id + "_input";
		this.input_element.observe('keydown',function(event){
			if(event.which == 8 && this.input_element.value=="") {
				this.removeLastToken();
			}
		}.bind(this));
		
		this.tokens = $(document.createElement('div'));
		this.tokens.id = this.wrapper.id + "_tokens";
		this.tokens.style.display = "inline";
		
		this.autocomplete_element = $(document.createElement('div'));
		this.autocomplete_element.id = this.wrapper.id + "_autocomplete_list";
		this.autocomplete_element.className = "tokenizer_autocomplete";
		
		this.wrapper.appendChild(this.tokens);
		this.wrapper.appendChild(this.input_element);
		this.wrapper.appendChild(this.autocomplete_element);

		new Ajax.Autocompleter(this.input_element.id, this.autocomplete_element.id, this.options.autocompleteURL, {paramName:this.options.autocompleteParam,updateElement:this.addToken.bind(this)});
	},
	addToken: function(element, options) {
		
		if(typeof element.tagName == "undefined") {
			receiver_type = element.receiver_type;
			receiver_param = element.receiver_param;
			receiver_name = element.receiver_name;
		}
		else {
			receiver_type = element.getElementsBySelector('span.receiver_type')[0].innerHTML;
			receiver_param = element.getElementsBySelector('span.receiver_param')[0].innerHTML
			receiver_name = element.getElementsBySelector('span.receiver_name')[0].innerHTML
		}
		
		options = options || {};
		Object.extend(options,this.options);
		new_token = $(document.createElement('div'));
		new_token.className = 'token';

		next_id_number = (this.token_id_numbers.max() || 0) + 1;
		this.token_id_numbers.push(next_id_number);
		new_token.id = this.wrapper.id + "token_" + next_id_number;

		token_input = $(document.createElement('input'));
		token_input.type = "checkbox"
		token_input.name = receiver_type.toLowerCase()+"s[]";
		token_input.value = receiver_param;
		token_input.checked = true;
		token_close = $(document.createElement('img'));
		token_close.src = this.options.closeButton;
		token_close.alt = "close";
		token_close.observe('click',function(event){
			element = $(Event.element(event));
			this.removeToken(element.up());
		}.bind(this));
		token_text = $(document.createElement('span'));
		token_text.innerHTML = receiver_name;
		
		new_token.appendChild(token_input);
		new_token.appendChild(token_text);
		new_token.appendChild(token_close);
		
		this.token_ids.push(new_token.id);
		
		this.tokens.appendChild(new_token);
		this.input_element.value = "";
		this.input_element.focus();
	},
	removeToken: function(element_id) {
		token = $(element_id);
		if(!token) return false;
		this.token_ids = this.token_ids.without(token.id);
		token.remove();
	},
	removeLastToken: function() {
		token = $(this.token_ids.last());
		if(!token) return false;
		this.token_ids = this.token_ids.without(token.id);
		token.remove();
	},
	removeAllTokens: function() {
		for(i=0;i<this.token_ids.length;i++) {
			token = $(this.token_ids[i]);
			if(token) {
				this.token_ids = this.token_ids.without(token.id);
				token.remove();
			}
		}
	}
	
});
	
