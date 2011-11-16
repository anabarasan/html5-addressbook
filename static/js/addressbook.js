var bookKeys = new Array();

function initialize(){
	if(BrowserDetect.browser=="Explorer"){
		if(BrowserDetect.version == 6){
			document.write("<h1>This browser is....<br/>dead!<br/>mar gaya!<br/>poota kesu!<br/>Go get a life!</h1>");
		} else if (BrowserDetect.version > 6 && BrowserDetect.version < 9 ){
			document.write("<h1>Goiyala!<br/>How dare you use this cursed browser?<br/>I will not allow you to use this application</h1>");
		} else if (BrowserDetect.version == 9){
			document.write("<h1>Peetaarrrruu!<br/>If you have the latest version of Internet Explorer...<br/>I will allow you to use this application a?<br/>Poda</h1>");
		}
	} else {
		document.getElementById("contacts").style.display = "";
		getAllContacts();
	}
}

function Keys(){
    if (localStorage.getItem('addressbook') == null) {
        localStorage.setItem('addressbook', bookKeys);
    } else {
        bookKeys = localStorage.getItem('addressbook').split(",");
    }
}

function show(id){
	var divList = document.getElementsByTagName("div");
	for (var i = 0; i < divList.length; i++){
		document.getElementById(divList[i].id).style.display = "none";
	}
	document.getElementById(id).style.display = "";
	document.getElementById("ContactList").style.display="";
}

function getAllContacts(){
	Keys();
	document.getElementById('ContactList').innerHTML = "";
	for (var i = 0; i < bookKeys.length; i++){
		if(bookKeys[i]){
			var deletebutton = "&nbsp;&nbsp;&nbsp;<img src='/static/images/delete.png' onClick=\"javascript:removeContact('"+bookKeys[i]+"')\"/><br/>";
			var editlink =  "<a onClick=\"javascript:editContact('"+bookKeys[i]+"')\"/>"+bookKeys[i]+"</a>";
			document.getElementById('ContactList').innerHTML = document.getElementById('ContactList').innerHTML + editlink + deletebutton;
		}
	}
}

function newContact() {
	resetEditor();
	show('ContactEditor');	
}
function addContact() {
	Keys();
    var bookKey = document.getElementById('firstname').value + document.getElementById('lastname').value;
    var formData = form2object('frmAddressEditor');
	console.info(formData);
	if(bookKey){
		if (localStorage.getItem(bookKey) == null) {
			bookKeys.push(bookKey);
			localStorage.setItem('addressbook', bookKeys);
		}
		localStorage.setItem(bookKey, JSON.stringify(formData, null, '\t'));
	}
	
	getAllContacts();
	resetEditor();
	show('ContactDetails');
}

function removeContact(contactName) {
    bookKeys = localStorage.getItem('addressbook').split(",");
    for (var i = 0; i < bookKeys.length; i++) {
        if (bookKeys[i] == contactName)
            bookKeys.splice(i, 1);
    }
    localStorage.removeItem(contactName);
	localStorage.setItem('addressbook', bookKeys);
	getAllContacts();
	alert('Contact Removed');
}

function editContact(contactName) {
	contactDetails = String(localStorage.getItem(contactName)).replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g,"");
	contactDetails = contactDetails.split(",")
	for (i=0; i < contactDetails.length; i++){
		detail = contactDetails[i].split(":");
		document.getElementById(cleanDetails(detail[0])).value=cleanDetails(detail[1]);
	}
	show("ContactEditor");
}
 
function resetEditor(){
	var inputList = document.getElementsByTagName("input");
	for (var i = 0; i < inputList.length; i++){
		if(inputList[i].id != "btn1"){
			document.getElementById(inputList[i].id).value = "";
		}
	}
}

function replaceAll(txt, replace, with_this) {
  return txt.replace(new RegExp(replace, 'g'),with_this);
}

function cleanDetails(detail){
		return replaceAll(replaceAll(replaceAll(detail,"\"",""),"{",""),"}","")
}

/***********************************************************************
 * http://www.textfixer.com/tutorials/javascript-line-breaks.php
 * http://naspinski.net/post/Javascript-replaceAll-function.aspx
 * http://www.dailycoding.com/Posts/howtoset100tableheightinhtml.aspx
***********************************************************************/

//Offline Cache related

var webappCache = window.applicationCache;
 
function updateCache(){
    console.info("updating cache");
    webappCache.swapCache();
    window.location.reload();
    window.location.href=window.location.href;
}

function errorCache(){
    alert("Cache failed to update.  Will Check again next time...");
}

webappCache.addEventListener("updateready", updateCache, false);
webappCache.addEventListener("obsolete", updateCache, false);
webappCache.addEventListener("error", errorCache, false);

/***********************************************************************
 * http://www.thecssninja.com/javascript/how-to-create-offline-webapps-on-the-iphone
***********************************************************************/

//Sync to store related

function sync(toWhere){
	var request = new XMLHttpRequest();
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			if(toWhere=="Server"){
				alert(request.responseText);
			} else if(toWhere=="Local"){
				payload = request.responseText;
				getPayLoad(payload);
			}
		}
	}
	
	if(toWhere=="Server"){
		payload = genPayLoad();
		request.open("POST","sync",true);
		request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		request.send("sync=server&payload="+payload);
	} else if(toWhere=="Local"){
		request.open("GET","sync?sync=local",true);
		request.send();
	}
}

function genPayLoad(){
	var addressbook = "{\"root\":\"addressbook\",";
	
	for (i=0; i<=localStorage.length-1; i++) {  
		key = localStorage.key(i);  
		val = localStorage.getItem(key);  
		
		if(key=="addressbook"){
			val = "{" + val + "}";
		}
		
		addressbook = addressbook + "\"" + key + "\" :" + val + ",";
		
    }
    
    addressbook = addressbook.substr(0,addressbook.length-1) + "}";
	console.info(addressbook);
	return addressbook
}

function getPayLoad(payload){
	console.info(payload);
}

