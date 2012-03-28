# BrowserID 

## Requires:
* MooTools 
* PHP

This is a drop-in class to support BrowserID.  It handles everything
for you, all you need to tell it is the name of the login element and the path to the waiting graphic of your choice.

## Example

    <script type="text/javascript" src="js/browserid.js"></script>

    <script type="text/javascript">
        window.addEvent('domready', function(){
            new BrowserID({
                loginElement: document.id('login'),
                waitImage:    'gfx/wait16.gif'
            });
        });
    </script>   

    <div class="head">
        <span id="login">&nbsp;</span>
    </div>
