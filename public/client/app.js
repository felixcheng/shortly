window.Shortly = Backbone.View.extend({

  template: _.template(' \
      <h1>Shortly</h1> \
      <div class="navigation"> \
      <ul> \
        <li><a href="#" class="index">All Links</a></li> \
        <li><a href="#" class="create">Shorten</a></li> \
        <li><a href="#" class="lastVisit">Show Latest</a></li>\
        <li><input class="search"></input></li> \
      </ul> \
      </div> \
      <div id="container"></div>'
  ),

  events: {
    "click li a.index":  "renderIndexView",
    "click li a.create": "renderCreateView",
    "click li a.lastVisit": "sortVisit", 
    "keypress input": "logKey",
     "click button.submit": "authenticate"

    // add event to initialize renderIndexView
  },

  initialize: function(){
    console.log( "Shortly is running" );
    $('body').append(this.render().el);
    this.renderLoginView();
    // request to fetch on interval
    // on success for login, fetch 
  },

  render: function(){
    this.$el.html( this.template() );
    return this;
  },
  renderLoginView: function(){
    var login = new Shortly.Login();
    var loginView = new Shortly.LoginView( { model: login } );
    this.$el.find('#container').html( loginView.render().el );
    
    // post request, on success, render index view
    // this.renderIndexView(); // default view
  },

  renderIndexView: function(e){
    e && e.preventDefault();
    var links = new Shortly.Links();
    var linksView = new Shortly.LinksView( {collection: links} );
    this.$el.find('#container').html( linksView.render().el );
    this.updateNav('index');
  },

  renderCreateView: function(e){
    e && e.preventDefault();
    var linkCreateView = new Shortly.LinkCreateView();
    this.$el.find('#container').html( linkCreateView.render().el );
    this.updateNav('create');
  },

  updateNav: function(className){
    this.$el.find('.navigation li a')
            .removeClass('selected')
            .filter('.'+className)
            .addClass('selected')
  },

  logKey: function(e) {
    if(e.keyCode === 13){
      var searchVal = this.$el.find('.search').val();
      $( ".original" )
        .filter(function( index ) {
        if ($(this ).text().indexOf(searchVal)> 0) {
          console.log($(this));
          $(this).parent().toggleClass('filtered').toggleClass('filtered').toggleClass('filtered');
        } 
      })
      this.updateNav('index');
    }
  },

  sortVisit: function(e){
    $('.link').find('.lastVisit')
    var ar = []; 
    console.log(sortBy);
  },
  // write an onclick event
  // get (send name of button)
  // on server, if button, sort by updated at
  sortByLastVisit: function(e){
    // this.updateNav('index');
    // $.get('/clicked').done(function(data){});
    $.get('/lastVisited').done(function(data){});
    this.renderIndexView();
  },

  authenticate: function(){
    var thisUsername = $('.username').val();
    var thisPassword = $('.password').val();
    var that = this;
    $.ajax({
      type: "POST",
      data: JSON.stringify({'username': thisUsername, 'password': thisPassword}),
      success: function(){ 
        $('.login').remove();
        that.renderIndexView();
      }, 
      error: console.log("error"),
    });
    console.log(thisUsername, thisPassword);
  },
    // this.$el.find('.search').val('');

});