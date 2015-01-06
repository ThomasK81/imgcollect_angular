# Overview

imgcollect uses three servers.
Here are their GitHub repos.

* [JackSON](https://github.com/caesarfeta/JackSON)
* [JackRDF](https://github.com/caesarfeta/JackRDF)
* [imgup](https://github.com/caesarfeta/imgup)

imgcollect is primarily written in...

* Ruby -- 1.9.2 or above
* Javascript

It's built on top of these technologies...

* Sinatra
* AngularJS
* Fuseki

# Development Installation

Fresh Install of Ubuntu 12.04

	Note I used VirtualBox for testing
	This reminder is for me...
		fn+shift UP and DOWN to terminal scroll with Macbook

### Basic Environment

	sudo apt-get update
	sudo apt-get install build-essential zlib1g-dev libssl1.0.0 libssl-dev git 

### Setup JackSON

	sudo mkdir -p /var/www
	sudo chown -R user /var/www
	git clone https://github.com/caesarfeta/JackSON /var/www/JackSON
	cd /var/www/JackSON
	git submodule update --init

### Build Ruby

	cd /var/www/JackSON
	./rbenv.sh
	source ~/.bash_profile
	rbenv rehash

### Install JackSON dependencies

	sudo apt-get install rubygems
	gem install bundler
	rbenv rehash
	bundle install

### Install JackRDF

	git clone https://github.com/caesarfeta/JackRDF /var/www/JackRDF
	cd /var/www/JackRDF
	rake install

You might get this error...

	rake aborted!
	Couldn't install gem...

Just run this:

	gem install /var/www/JackRDF/pkg/JackRDF-1.0.1.gem

### Install JackRDFs coupled fuseki server

	sudo apt-get install default-jre default-jdk
	rake server:install

### Start fuseki

	cd /var/www/JackRDF
	rake server:start

Make sure JackRDF and fuseki are working

	rake test

### Start JackSON

	cd /var/www/JackSON
	rake start

Make sure JackSON is running properly

	rake test

### Install imgcollect_angular UI

	cd /var/www/JackSON/public/apps/imgcollect

Install nodejs this funky way.  [Taken from stackoverflow](http://stackoverflow.com/questions/12913141/installing-from-npm-fails)

	curl -sL https://deb.nodesource.com/setup | sudo bash -
	sudo apt-get install -y nodejs
	sudo npm install bower -g
	bower install
	bundle install

Watch for changes / build CSS

	bundle exec compass watch

### Install imgup server

	git clone https://github.com/caesarfeta/imgup /var/www/imgup
	cd /var/www/imgup
	bundle install
	rake start

### Get CITE-JSON-LD templates

	git clone https://github.com/PerseusDL/CITE-JSON-LD /var/www/JackSON/templates/cite

### Create fake development data

Make sure JackSON and Fuseki are running

	gem install faker
	cd /var/www/JackSON/templates/cite/templates/img
	ruby fake.rb

### Your app is working?

Take a quick peak.

	http://localhost:4567/apps/imgcollect

### Clearout fake data
When the time comes...

	cd /var/www/JackSON
	rake data:destroy

# Production Installation

You'll need to install everything needed for development, see "Development Installation" above.

## Install Apache 2

...and some necessary development headers.

	sudo apt-get install apache2 apache2-threaded-dev libcurl4-openssl-dev

## Install Phusion Passenger

	gem install passenger
	rbenv rehash

Okay here's something funky you need to know about Phusion Passenger.
If you're using rbenv for Ruby versioning then your gems are installed in your home directory.
Apache doesn't run as you.
So you have to give Apache permissions to your home directory.
Here's the easiest way to do that.

	sudo chmod -R o+x ~

Warning: This could be an issue for you if you need your user directory secure.

	passenger-install-apache2-module

This will compile Phusion Passenger.
Copy the LoadModule directive the installer gives you after it finishes compiling.
It looks like this most likely...

	LoadModule passenger_module /home/user/.rbenv/versions/1.9.3-p0/lib/ruby/gems/1.9.1/gems/passenger-4.0.57/buildout/apache2/mod_passenger.so
	<IfModule mod_passenger.c>
		PassengerRoot /home/user/.rbenv/versions/1.9.3-p0/lib/ruby/gems/1.9.1/gems/passenger-4.0.57
		PassengerDefaultRuby /home/user/.rbenv/versions/1.9.3-p0/bin/ruby
	</IfModule>

Paste that at the end of...

	/etc/apache2/apache2.conf

Try starting up Apache to see if anything is broken

	sudo apachectl start
	sudo apachectl stop

Configure VHOST

# Configuration files

If you have a non-standard installation ( one where the servers are running on different hosts or non-standard ports ) you must change the configuration directives listed here.

/var/www/JackSON/JackSON.config.yml

	sparql: 'http://localhost:4321/ds'

/var/www/imgup/imgup.config.url

	allow_origin: 'http://localhost:4567'

/var/www/JackSON/public/apps/imgcollect/angular/config.js

	serv.user
	xhr.sparql.url
	xhr.json.url
	imgup.url
