var http = require('http')
var fs = require('fs')
var paypal = require('paypal-rest-sdk')
var url = require('url');


var server = http.createServer(body)

paypal.configure({
	'mode': 'sandbox',
	'client_id': 'AY26vz0SWMXneBByNC2gS0EWxJ0phl88JkJJSJaFVu-0Z_OkeBDoXHXcbzXwvU3Ox1lzK-2mMVbXZBSf',
	'client_secret': 'EDQI8Jg24Dwazlgs8HvYs_zt8i6F54zOp5ZedTJzoxgSP51nwu6SpqcgGwgFNvSigXvwN6VQ1CTREp6r'
})



function body(request,response) {
	var a = url.host
	console.log(a)
	if (request.url == '/') {
        paginaPrincipal(request,response);
	}else if (request.url == '/buy') {
        metodoDePago(request,response);
	}else if (request.url=='/success') {
        paginaExito(request,response)
	}else if (request.url=='/err') {
        paginaError(request,response)
	}else{
		console.log('la pagina no es correcta la direccion');
		response.end('la direccion no existe');
	}
}
function paginaPrincipal(request,response) {
	fs.readFile('/Users/JuanCamiloArboleda/Desktop/Paypal/index.html',cargar)
	function cargar(error,data) {
		if (error) {
			console.log(error);
			response.end('error');
		}else{
			response.write(data);
			response.end()
		}
	}
}

function paginaExito(request,response) {
	fs.readFile('/Users/JuanCamiloArboleda/Desktop/Paypal/success.html',cargar)
	function cargar(error,data) {
		if (error) {
			console.log(error);
			response.end('error');
		}else{
			response.write(data);
			response.end()
		}
	}
}

function paginaError(request,response) {
	fs.readFile('/Users/JuanCamiloArboleda/Desktop/Paypal/err.html',cargar)
	function cargar(error,data) {
		if (error) {
			console.log(error);
			response.end('error');
		}else{
			response.write(data);
			response.end()
		}
	}
}


function metodoDePago(request,response) {
	var payment = {
		"intent": "authorize",
		"payer": {
			"payment_method":"paypal"
		},
		"redirect_urls":{
			"return_url":"http://192.168.1.55:8080/success",
			"cancel_url":"http://192.168.1.55.:8080/err"
		},
		"transactions":[{
			"amount":{
				"total":20.44,
				"currency":"USD"
			},
			"description":"compre un libro"
		}]
	}
	var payment = JSON.stringify(payment);

	

	paypal.payment.create(payment,function(error,payment) {
	var links = {}

	if (error) {
		console.log(JSON.stringify(error))
	}else{
		
		payment.links.forEach(function(linkObj) {
			links[linkObj.rel] = {
				href: linkObj.href,
                method: linkObj.method    
			}
		})
		if (links.hasOwnProperty('approval_url')) {
             var a = links['approval_url'].href
             response.writeHead(302,  {Location: ""+a})
             response.end()
            }else{
			console.error('no redirect URI present')
		}

	 var paymentId = req.query.paymentId;
	 var payerId = { payer_id: req.query.PayerID };

	 paypal.payment.execute(paymentId, payerId, function(error, payment){
	  if(error){
	    console.error(JSON.stringify(error));
	  } else {
	    if (payment.state == 'approved'){
	      console.log('payment completed successfully');
	    } else {
	      console.log('payment not successful');
	    }
	  }
	});
	}
 })
}
console.log('servidor creado perfectamente')
server.listen(8080)