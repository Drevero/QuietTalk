var url_server='http://witzing.olympe.in/quiet_talk/core';
var number_user='';
var password_user='';
var ondiscus=false;
var discu_act=0;
var ndom_msg=0;
var timing_act;
var notif_act=false;
var gif_url='';
var nmb_msg_actu=0;
var timing_recup_conv; 
$(document).on( "swiperight", "#messages", function( event ) {
	erase_conv();
	recup_conv();
	$.mobile.navigate( "#connected", { transition : "fade" } );
 });
$(".msg_conv").on("taphold",function(event){
	alert('caca');
  }); 
function getXMLHttpRequest()
{
	var xhr = null;
	
	if (window.XMLHttpRequest || window.ActiveXObject) {
		if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject('Msxml2.XMLHTTP');
			} catch(e) {
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
			}
		} else {
			xhr = new XMLHttpRequest(); 
		}
	} else {
		alert('Votre navigateur ne supporte pas l\'objet XMLHTTPRequest...');
		return null;
	}
	
	return xhr;
}
if(window.localStorage.getItem("password") && window.localStorage.getItem("number"))
{
	number_user=window.localStorage.getItem("number");
	password_user=window.localStorage.getItem("password");
}
else
{
	window.location='index.html#accueil';
}
function deconnect()
{
	if(confirm('Êtes-vous sûr de vouloir vous déconnecter ?'))
	{
		window.localStorage.clear();
		window.location='index.html';
	}
}
function init_messenger()
{
	var xhr=new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
		{
			var ndom=xhr.responseXML;
			if(ndom)
			{
				window.location='conversation.html#connected';
			}
		}
	};
	xhr.open('POST', url_server + '/api.php', true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send('number=' + number_user + '&password=' + password_user);
}
function recup_conv()
{
	var xhr=new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
		{
			var ndom=xhr.responseXML;
			document.getElementById('number_user_panel').innerHTML=number_user;
			var balises=ndom.getElementsByTagName('conversation').length;
			if(balises>0)
			{
				document.getElementById('liste_conversations').innerHTML='';
			}
			for(var i=0;i<balises;i++)
			{
				if(ndom.getElementsByTagName('conversation')[i].getAttribute('read')==0 && !notif_act)
				{
					notif_act=true;
				}
				if(i==0)
				{
					document.getElementById('liste_conversations').innerHTML+='<li class="ui-first-child msg_conv"><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-transition="slide" href="#messages" onclick="enter_discu(\'' + ndom.getElementsByTagName('conversation')[i].getAttribute('number_js') + '\');load_discus(\'' + ndom.getElementsByTagName('conversation')[i].getAttribute('number_js') + '\');" data-transition="slideup"><h2>' + ndom.getElementsByTagName('conversation')[i].getAttribute('name') + '<img src="img/unread.png" class="read_i' + ndom.getElementsByTagName('conversation')[i].getAttribute('read') + '"/></h2><p class="read_msg' + ndom.getElementsByTagName('conversation')[i].getAttribute('read') + '">' + emojione.shortnameToImage(ndom.getElementsByTagName('conversation')[i].getAttribute('message')) + '</p><p class="ui-li-aside"><strong>' + ndom.getElementsByTagName('conversation')[i].getAttribute('date') + '</strong></p></a></li>';
				}
				else
				{
					var test=(balises-1);
					if(i==test)
					{
						document.getElementById('liste_conversations').innerHTML+='<li class="ui-last-child msg_conv"><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-transition="slide" href="#messages" onclick="enter_discu(\'' + ndom.getElementsByTagName('conversation')[i].getAttribute('number_js') + '\');load_discus(\'' + ndom.getElementsByTagName('conversation')[i].getAttribute('number_js') + '\');" data-transition="slideup"><h2>' + ndom.getElementsByTagName('conversation')[i].getAttribute('name') + '<img src="img/unread.png" class="read_i' + ndom.getElementsByTagName('conversation')[i].getAttribute('read') + '"/></h2><p class="read_msg' + ndom.getElementsByTagName('conversation')[i].getAttribute('read') + '"></h2><p>' + emojione.shortnameToImage(ndom.getElementsByTagName('conversation')[i].getAttribute('message')) + '</p><p class="ui-li-aside"><strong>' + ndom.getElementsByTagName('conversation')[i].getAttribute('date') + '</strong></p></a></li>';
					}
					else
					{
						document.getElementById('liste_conversations').innerHTML+='<li class="msg_conv"><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" href="#messages" data-transition="slide" onclick="enter_discu(\'' + ndom.getElementsByTagName('conversation')[i].getAttribute('number_js') + '\');load_discus(\'' + ndom.getElementsByTagName('conversation')[i].getAttribute('number_js') + '\');" data-transition="slideup"><h2>' + ndom.getElementsByTagName('conversation')[i].getAttribute('name') + '<img src="img/unread.png" class="read_i' + ndom.getElementsByTagName('conversation')[i].getAttribute('read') + '"/></h2><p class="read_msg' + ndom.getElementsByTagName('conversation')[i].getAttribute('read') + '"></h2><p>' + emojione.shortnameToImage(ndom.getElementsByTagName('conversation')[i].getAttribute('message')) + '</p><p class="ui-li-aside"><strong>' + ndom.getElementsByTagName('conversation')[i].getAttribute('date') + '</strong></p></a></li>';
					}
				}
			}
		}
	};
	xhr.open('POST', url_server + '/api.php', true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send('nmb=' + number_user + '&pswd=' + password_user + '&recup_conv=true');
	timing_recup_conv=setTimeout('recup_conv()', 5000);
}
function visual_fond()
{
	lecteur_img=new FileReader();
	lecteur_img.onload=function(lectev) {
		document.getElementById('options').style.background='url(' + lectev.target.result + ')';
	};
	var fichier=document.getElementById('fond_file').files[0];
	if(fichier.type=='image/png' || fichier.type=='image/jpeg' || fichier.type=='image/gif' || fichier.type=='image/jpg')
	{
		if(fichier.size<4000000)
		{
			lecteur_img.readAsDataURL(fichier);
		}
		else
		{
			alert('Désolé, mais l\'image est trop volumineuse');
		}
	}
	else
	{
		alert('Désolé, mais votre type de format est non supporté');
	}
}
function enter_discu(id)
{
	ondiscus=true;
	discu_act=id;
	clearTimeout(timing_recup_conv);
}
function load_discus(id)
{
	if(ondiscus && discu_act!=0)
	{
		if(nmb_msg_actu<ndom_msg)
		{
			document.getElementById('content_messenger2').innerHTML='<img src="img/loader.gif" id="loader_discu"/><p style="text-align: center;">Chargement en cours</p>';
		}
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
			{
				notif_act=false;
				var ndom=xhr.responseXML;
				var balises=ndom.getElementsByTagName('conversation').length;
				ndom_msg=ndom.getElementsByTagName('conversation').length;
				if(nmb_msg_actu<ndom_msg)
				{
					document.getElementById('name').innerHTML=ndom.getElementsByTagName('conversation')[0].getAttribute('name');
					document.getElementById('content_messenger2').style.maxHeight=screen.height-150 + 'px';
					document.getElementById('content_messenger2').innerHTML='';
					document.getElementById('name_user_panel').innerHTML=ndom.getElementsByTagName('conversation')[0].getAttribute('name');
					document.getElementById('number_user_panel2').innerHTML=ndom.getElementsByTagName('conversation')[0].getAttribute('user_nmb');
					document.getElementById('clean_convers').setAttribute('onclick', 'delete_conv(\'' + ndom.getElementsByTagName('conversation')[0].getAttribute('user_nmb') + '\');');
					for(var i=0;i<balises;i++)
					{
						var read_state='';
						nmb_msg_actu+=1;
						if(ndom.getElementsByTagName('conversation')[i].getAttribute('sender')!='msg example-msg')
						{
							read_state=', délivré';
							if(ndom.getElementsByTagName('conversation')[i].getAttribute('read')=='1')
							{
								read_state=', lu';
							}
						}
						document.getElementById('content_messenger2').innerHTML+='<li class="' + ndom.getElementsByTagName('conversation')[i].getAttribute('sender') + '"><div class="content"><p>' + emojione.shortnameToImage(ndom.getElementsByTagName('conversation')[i].getAttribute('message')) + '<br /><span class="date">' + ndom.getElementsByTagName('conversation')[i].getAttribute('date') + '' + read_state + '</span></p></div><div class="sep"></div></li>';
					}
					var gif=document.getElementsByTagName('img');
					for(var i=0;i<gif.length;i++)
					{
						if(gif[i].getAttribute('class')=='gif')
						{
							gif[i].setAttribute('id', 'gif' + i);
							gif[i].setAttribute('onclick', 'show_gif(' + i + ', \'' + gif[i].getAttribute('src') + '\');');
							gif[i].setAttribute('src', 'img/gif_replace.png');
							gif[i].setAttribute('class', 'mini');
						}
					}
				}
			}
		};
		document.getElementById('send_button_true').setAttribute('onclick', 'send_message(\'' + discu_act + '\')');
		xhr.open('POST', url_server + '/api.php', true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send('nmb=' + number_user + '&pswd=' + password_user + '&conv=' + discu_act);
		timing_act=setTimeout('load_discus(' + discu_act + ')', 2500);
	}
}
function gif_init()
{
	document.getElementById('results_gif').innerHTML='<div style="background-image: url(\'https://media.giphy.com/media/on6xnmvix3Tfa/giphy.gif\');" onclick="gif_put(\'Emotions\');"><p>#Emotions</p></div><div style="background-image: url(\'https://media.giphy.com/media/3rgXBxIdlkiBg0b7VK/giphy.gif\');" onclick="gif_put(\'LOL\');"><p>#LOL</p></div><div style="background-image: url(\'https://media.giphy.com/media/10Velb45AjmRos/giphy.gif\');" onclick="gif_put(\'Angry\');"><p>#Angry</p></div><div style="background-image: url(\'https://media.giphy.com/media/klZBxHoFLN44M/giphy.gif\');" onclick="gif_put(\'Simpsons\');"><p>#Simpsons</p></div><div style="background-image: url(\'https://media.giphy.com/media/TJufnSz934AnK/giphy.gif\');" onclick="gif_put(\'Smoke\');"><p>#Smoke</p></div><div style="background-image: url(\'https://media.giphy.com/media/M7gtacN7aPNsc/giphy.gif\');" onclick="gif_put(\'Happy\');"><p>#Happy</p></div>';
}
function gif_leave()
{
	document.getElementById('results_gif').innerHTML='';
	document.getElementById('gif_input').value='';
}
function gif_put(name)
{
	document.getElementById('gif_input').value=name;
	search_gif();
}
function show_gif(id, url)
{
	document.getElementById('gif' + id).setAttribute('src', 'img/loader.gif');
	document.getElementById('gif' + id).setAttribute('src', url);
	document.getElementById('gif' + id).setAttribute('class', '');
}
function delete_conv(id)
{
	if(confirm('Êtes-vous sûr de vouloir supprimer cette conversation définitivement ?'))
	{
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
			{
				erase_conv();
				window.location='index.html#connected';
			}
		};
		xhr.open('POST', url_server + '/api.php', true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send('nmb=' + number_user + '&pswd=' + password_user + '&supr=' + id);
		timing_act=setTimeout('load_discus(' + discu_act + ')', 2500);
	}
}
function send_message(id)
{
	if(gif_url=='')
	{
		var message=document.getElementById('message_input').value;
		message=emojione.toShort(message);
	}
	else
	{
		var message=gif_url;
	}
	if(message.length>0)
	{
		document.getElementById('send_button').src='img/loader.gif';
		var onclick_url=document.getElementById('send_button_true').getAttribute('onclick');
		document.getElementById('send_button_true').setAttribute('onclick', '');
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
			{
				var rando=Math.floor(Math.random()*10);
				document.getElementById('send_button_true').setAttribute('onclick', onclick_url);
				document.getElementById('send_button').src='img/send.png';
				var li=document.createElement('li');
				li.setAttribute('class', 'msg nv green example-msg');
				li.setAttribute('id', rando);
				li.innerHTML='<div class="content"><p>' + message + '</p></div><div class="sep"></div>';
				var pa=document.getElementById('content_messenger2');
				pa.insertBefore(li, pa.firstChild);
				document.getElementById('message_input').value='';
				document.getElementById('content_messenger2').scrollTo(0, -1);
				anim_msg(rando, 0);
			}
		};
		xhr.open('POST', url_server + '/api.php', true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send('nmb=' + number_user + '&pswd=' + password_user + '&send_to=' + id + '&msg=' + message);
	}
}
function send_msg_new()
{
	var message=document.getElementById('message_input_new').value;
	var number_new=document.getElementById('num_new_msg').value;
	message=emojione.toShort(message);
	if(message.length>0 && number_new>0)
	{
		document.getElementById('send_button_new').src='img/loader.gif';
		var onclick_url=document.getElementById('send_button_new').getAttribute('onclick');
		document.getElementById('send_button_new').setAttribute('onclick', '');
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
			{
				document.getElementById('message_input_new').value='';
				document.getElementById('num_new_msg').value='';
				window.location='conversation.html#connected';
				document.getElementById('send_button_new').setAttribute('onclick', onclick_url);
				document.getElementById('send_button_new').src='img/send.png';
			}
		};
		xhr.open('POST', url_server + '/api.php', true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send('nmb=' + number_user + '&pswd=' + password_user + '&send_to=' + number_new + '&msg=' + message);
	}
}
function search_gif()
{
	var results=document.getElementById('results_gif');
	var key=document.getElementById('gif_input').value;
	results.innerHTML='<img src="img/loader.gif" style="display: block;margin: auto;margin-top: 25%;"/>';
	var xhr=new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
		{
			var ndom=JSON.parse(xhr.responseText);
			results.innerHTML='';
			for(var i=0;i<ndom.data.length;i++)
			{
				var img=document.createElement('img');
				img.src='img/loader2.gif';
				img.src=ndom.data[i].images.fixed_height.url;
				img.setAttribute('onclick', 'add_gif(\'' + ndom.data[i].images.fixed_height.url + '\');');
				img.style.background='url(\'img\loader.gif\')';
				results.appendChild(img);
			}
		}
	};
	xhr.open('GET', 'http://api.giphy.com/v1/gifs/search?q=' + key + '&api_key=dc6zaTOxFJmzC&limit=11', true);
	xhr.send(null);
}
function add_gif(url)
{
	gif_url='<img src="' + url + '" class="gif"/>';
	send_message(discu_act);
	gif_url='';
	document.getElementById('gif_input').value='';
	document.getElementById('results_gif').innerHTML='';
	window.history.back();
}
function anim_msg(id, sec)
{
	clearTimeout(timing_act);
	if(sec<=1)
	{
		sec=sec+0.5;
		document.getElementById(id).style.marginTop=sec + '%';
		setTimeout('anim_msg(' + id + ', ' + sec + ')', 100);
	}
	else
	{
		sec=0;
		timing_act=setTimeout('load_discus(' + discu_act + ')', 2500);
	}
}
function erase_conv()
{
	ondiscus=false;
	ndom_msg=0;
	discu_act=0;
	nmb_msg_actu=0;
	document.getElementById('name').innerHTML='...';
	document.getElementById('send_button_true').setAttribute('onclick', '');
	document.getElementById('content_messenger2').innerHTML='<img src="img/loader.gif" id="loader_discu"/><p style="text-align: center;">Chargement en cours</p>';
	clearTimeout(timing_act);
}
$('#popup_gif').popup();
$('#popup_gif').popup('open');
init_messenger();
recup_conv();
