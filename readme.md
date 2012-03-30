# BrowserID 
This is a drop-in class to support BrowserID.  It handles everything for you, all you need to tell it is the name of the login element and the path to the waiting graphic of your choice.

Requires: 
Mootools & PHP

## Just include a script tag and set a login element and you are good to go!

[Script]

 	new BrowserID({
		loginElement: document.id('login'),
		loginText:    'Click Here to Login',
		waitImage:    'gfx/wait.gif'
	});

[Html]

	<div id="logon"></div>

[Tips]

The users email address will be in the logon element.
	'email = document.id('login').get('text');' -or-
	'email = document.id('login').retrieve('auth').email;'
	
The authentication object will be in the element as well.
	'auth = document.id('login').retrieve('auth');'

## For advanced users, you can hook into events:

[Script]

	new BrowserID({
		loginElement: document.id('login'),
		loginText:    'Click Here to Login',
		waitImage:    'gfx/wait.gif'
	}).addEvents({
		'login':  function(o){ console.log("Login::%o", o); },
		'logout': function(o){ console.log("Logout::%o", o); }
	});

[Html]

    <div id="logon"></div>

[Tips]

The events login and logout pass the authentication object as
the first argument.
	'function(o){ console.log('Login::%o', o); }'
	