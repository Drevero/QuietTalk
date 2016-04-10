var url_server='http://witzing.olympe.in/quiet_talk/core';
var number_user='';
var password_user='';
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
	number_user=window.localStorage.getItem("number");;
	password_user=window.localStorage.getItem("password");;
	window.location='conversation.html';
}
else
{
	window.location='#accueil';
}
function login_in()
{
	var number_user=document.getElementById('number_user').value;
	var password_user=document.getElementById('password_user').value;
	var xhr=new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
		{
			var ndom=xhr.responseXML;
			if(ndom.getElementsByTagName('utilisateur')[0].getAttribute('valide')=='true')
			{
				document.getElementById('info_con').innerHTML='<span style="color: green;">Utilisateur Trouvé, connexion réussie</span>';
				window.localStorage.removeItem("number");
				window.localStorage.removeItem("password");
				window.localStorage.setItem("number", number_user);
				window.localStorage.setItem("password", password_user);
				window.location='conversation.html';
			}
			else
			{
				document.getElementById('info_con').innerHTML='Mot de passe ou utilisateur introuvable';
			}
		}
	};
	xhr.open('POST', url_server + '/api.php', true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send('number=' + number_user + '&password=' + password_user);
}
