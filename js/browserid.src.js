/***
 *  Version: 1
 * Requires: Mootools & PHP
 *    Title: BrowserID wrapper
 *
 * Matthew Hazlett
 * Clarity Computers
 * http://www.devclarity.com/
 * 3/30/2012
 *
 ***
 *
 * Just include a script tag and set a login element
 * and you are good to go!
 *
 *    new BrowserID({
 *          loginElement: document.id('login'),
 *          loginText:    'Click Here to Login',
 *          waitImage:    'gfx/wait.gif'
 *    });
 *
 *    <div id="logon"></div>
 *
 * For advanced users, you can hook into events as well:
 *
 *    new BrowserID({
 *          loginElement: document.id('login'),
 *          loginText:    'Click Here to Login',
 *          waitImage:    'gfx/wait.gif'
 *    }).addEvents({
 *          'login':  function(o){ console.log("Login::%o", o); },
 *          'logout': function(o){ console.log("Logout::%o", o); }
 *    });
 *
 *    <div id="logon"></div>
 */
BrowserID = new Class({

      Implements: [Options, Events],

      options: {
            loginElement: document.id('login'),
            waitImage: 'gfx/wait16.gif',
            loginText: 'BrowserID Login'
      },

      initialize: function(options){
            if (options) this.setOptions(options);

            this.loginData = null;
            this.loggedIn  = false;

            this.initEvents();
            this.isPersistent();
      },

      /***
       * Make stuff clickable
       */
      initEvents: function(){
            this.options.loginElement.addEvent('click', function(){
                  if (this.loggedIn){
                        this.setStatus('login');
                        window.navigator.id.logout(function(){});
                        this.fireEvent('logout', this.loginData);
                  } else {
                        this.setStatus('wait');
                        window.navigator.id.get(function(assertion){
                              if (assertion) this.isValid(assertion)
                              else this.setStatus('login');
                        }.bind(this), {allowPersistent:true});
                  }
            }.bind(this));
      },

      /***
       * Existing persistent authentication?
       */
      isPersistent: function(){
            this.setStatus('wait');
            window.navigator.id.get(function(assertion){
                  if (assertion) this.isValid(assertion)
                  else this.setStatus('login');
            }.bind(this), {silent:true});
      },

      /***
       * Change the visual status
       */
      setStatus: function(status, txt){
            var content = '',
                css     = '',
                tooltip = '';

            switch (status){
                  case 'wait':
                        content = '<img src="' + this.options.waitImage + '">';
                        css     = 'browserid-image';
                        tooltip = 'Please Wait...';

                        this.loggedIn = false;
                        break;

                  case 'login':
                        content = this.options.loginText;
                        css     = 'browserid-login';
                        tooltip = 'Click to login';

                        this.loggedIn = false;
                        break;

                  case 'logout':
                        content = txt;
                        css     = 'browserid-logout';
                        tooltip = 'Click to logout';

                        this.loggedIn = true;
                        break;
            }

            this.options.loginElement.set('class', css).set('title', tooltip).set('html', content);
      },

      /***
       * Validate users assertion with browserid.org
       */
      isValid: function(assertion){
            if (assertion) {
                  new Request.JSON({
                        url: 'browserid.php',
                        method: 'post',
                        data: 'assertion=' + assertion,
                        onSuccess: function(o){
                              if (o.status ==   'okay'){
                                    this.loggedIn  = true;
                                    this.loginData = o;
                                    this.setStatus('logout', o.email);
                                    this.options.loginElement.store('auth', o);
                                    this.fireEvent('login', this.loginData);
                              } else {
                                    this.setStatus('login');
                              }
                        }.bind(this)
                  }).send();
            } else {
                  this.setStatus('login');
            }
      }
});