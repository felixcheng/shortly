Shortly.LoginView = Backbone.View.extend({
  template: _.template(' \
      <h1>Shortly Log In</h1> \
      <div class="login"> \
        Enter username: <input class="username"></input>\
        Enter password: <input class="password"></input>\
        <button class="submit">submit</button>\
      </div> '
  ),
  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    return this;
  }
})