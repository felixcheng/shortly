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
    // "keyup input": "logKey",
    "click li a.lastVisit": "sortByLastVisit", 
    "keypress input": "logKey"
  },

  initialize: function(){
    console.log( "Shortly is running" );
    $('body').append(this.render().el);
    this.renderIndexView(); // default view
  },

  render: function(){
    this.$el.html( this.template() );
    return this;
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
  // write an onclick event
  // get (send name of button)
  // on server, if button, sort by updated at
  sortByLastVisit: function(e){
    $.get("#", {'clicked' : true})
    this.updateNav('index');
  },
    // this.$el.find('.search').val('');

});