require 'sinatra'
require "sinatra/reloader" if development?
require 'active_record'
require 'digest/sha1'
require 'pry'
require 'uri'
require 'open-uri'
# require 'bcrypt' # WHY DOES THIS

# require 'nokogiri'

set :sessions, true

###########################################################
# Configuration
###########################################################

set :public_folder, File.dirname(__FILE__) + '/public'

configure :development, :production do
    ActiveRecord::Base.establish_connection(
       :adapter => 'sqlite3',
       :database =>  'db/dev.sqlite3.db'
     )
end

# Handle potential connection pool timeout issues
after do
    ActiveRecord::Base.connection.close
end

# turn off root element rendering in JSON
ActiveRecord::Base.include_root_in_json = false

###########################################################
# Models
###########################################################
# Models to Access the database through ActiveRecord.
# Define associations here if need be
# http://guides.rubyonrails.org/association_basics.html

class Link < ActiveRecord::Base
    has_many :clicks

    validates :url, presence: true

    before_save do |record|
        record.code = Digest::SHA1.hexdigest(url)[0,5]
    end
end

class Click < ActiveRecord::Base
    belongs_to :link, counter_cache: :visits
end

class User < ActiveRecord::Base
    validates :username, presence: true
    validates :password, presence: true
end

###########################################################
# Routes
###########################################################
get '/lastVisited' do
    # if params == {"clicked"=>"hooray!"}
    links = Link.order("updated_at DESC")
    # links = Link.order("visits DESC")
    links.map { |link|
        link.as_json.merge(base_url: request.base_url)
    }.to_json
    # end
end

get '/login' do
  erb :login
end

post '/login' do 
    puts params["password"]
    username = params["username"]
    password = params["password"]
    you = User.find_by_username(username.to_s)
    if you.nil?
        puts "username doesn't exist in database. Creating new one, for now." 
        # for now, encrypt password, add to login
        User.create(username: username, password: BCrypt::Password.create(password))
    elsif authenticate?(password, you)
        puts "found username, found password"
        session[:username] = you.id
    else
        puts "wrong password, solve later"
    end
    puts "redirecting"
    redirect "/"
end

get '/' do
    # session["username"] ||= nil 
    # redirect "/login" 
  

    erb :index
end

get '/links' do
    # links = Link.order("updated_at DESC")
    links = Link.order("visits DESC")
    links.map { |link|
        link.as_json.merge(base_url: request.base_url)
    }.to_json
end

post '/' do
    links = Link.order("updated_at DESC")
    # links = Link.order("visits DESC")
    links.map { |link|
        link.as_json.merge(base_url: request.base_url)
    }.to_json
end

post '/links' do
    data = JSON.parse request.body.read
    uri = URI(data['url'])
    raise Sinatra::NotFound unless uri.absolute?
    link = Link.find_by_url(uri.to_s) ||
           Link.create( url: uri.to_s, title: get_url_title(uri) )
    link.as_json.merge(base_url: request.base_url).to_json
end

get '/:url' do
    link = Link.find_by_code params[:url]
    raise Sinatra::NotFound if link.nil?
    link.clicks.create!
    link.touch
    redirect link.url
end

###########################################################
# Utility
###########################################################

def read_url_head url
    head = ""
    url.open do |u|
        begin
            line = u.gets
            next  if line.nil?
            head += line
            break if line =~ /<\/head>/
        end until u.eof?
    end
    head + "</html>"
end

def get_url_title url
    # Nokogiri::HTML.parse( read_url_head url ).title
    result = read_url_head(url).match(/<title>(.*)<\/title>/)
    result.nil? ? "" : result[1]
end

# helper function, checks password against bcrypted password
def authenticate?(password, you)
    BCrypt::Password.create(password) == you[:password]
end
