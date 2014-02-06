Shortly.LoginView = Backbone.View.extend({
  template: _.template(' \
      <div class="login"> \
      <h1>Shortly Log In</h1> \
        <li>Enter username: <input class="username"></input></li>\
        <li>Enter password: <input class="password"></input></li>\
        <li><button class="submit">submit</button></li>\
      </div> '
  ),
  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    return this;
  },

  // events: {
  //   "click button": "authenticate"
  // },

  // authenticate: function(){
  //   var thisUsername = $('.username').val();
  //   var thisPassword = $('.password').val();
  //   $.post('/login', {'username': thisUsername, 'password': thisPassword});
  //   console.log(thisUsername, thisPassword);
  //   // take username password,
  //   // post data, ask server
  // }
})
