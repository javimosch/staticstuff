# Static Site Generator Enviroment (STATICSTUFF)

STATICSTUFF let you develop static web sites and web applications faster.

## DEPRECATED WARNING: Use instead https://github.com/javimosch/montpesites

### GITLAB

If you are watching this in GITLAB, your are watching the last version, who includes some of my projects.
The official version listed in https://www.staticgen.com/ is yet deprecated and need to be updated soon. T

### Features

 - You can develop multiple projects 
 - Homemade Watch & Build feature per project (Ultra fast)
 - Homemade Live Developement Server Sync (Using Firebase, is faster and platform frendly).
 - Production build using ES6 javascript bundling delivering backwards compatibility with old browser engines and speeding things up.
 - Development Server config endpoint (/config) using Enviroment Variables (.env file)
 - Handlebars compilation errors do not break the node proccess.
 -

### Why 

Sometimes I work with multiple projects at the same time and always wanted to centralize all the stuff in one place.
I'm facinated about static web generation and to output the files in a simple way possible without mess with server side technologies. Just html + js + css.
I tried several frameworks but they approach was to big regarding the scope and the technologies they support. They usually use task runners such as gulp or grunt, which are indeed great but sometimes the sum of all the code layers produce a little of inestability or oversized stack. I just wanted to keep the things as simple as possible and to maximize my productivity. I had been using statickstuff since six months with super good results.


### How it works

 - dev.sh [PrjName]  (dev watch & build + local server. Output to dist). The root of the project its /[PrjName]
 - watch.sh [PrjName] (same as above but do not launch the local server). Useful if you run multiple projects at once. 
 - build.sh [PrjName] (production build copied to dist-production folder). The root of the project its /
 
 - Every project has a configuration file in root/config (Used as locals for Handlebars)
 
 - Everything (.html) under src/static/[PrjName] is realtime compiled and copied to dist folder.
 - Note: Copy (compiles) handlebars files from templates folder. (preserves the folder structure). Ex: If you have templates/index.html   and templates/aboutus/index.html (both using handlebars syntax), the output will be the same, it only compiles the content.

 - Everything (.html) under src/partials is loaded as a Handlebars partial during the build stage.
 - Note: Use the partial with name of the file without ext. Ex: partials/myproject1/sections/prj1-head.html becomes {{> prj1-head}} 

 - Everything (.js) under src/js/[PrjName] is realtime concatened ordered by filename and copied to dist/js/app.js
 - Everything (.css) under src/css/[PrjName] is realtime concatened ordered by filename and copied to dist/css/css.js
 - Everything under src/res/[PrjName] is routed to /[PrjName]
 
 - Dist folder (Who contains released files during development stage) is pointed to /[PrjName]
 - Ex: localhost/MyProject
 

 - Every time a watch (on scripts, styles and templates) emits a build success event, a signal is sent to a firebase database. If your has the firebase reloading snippet (a handlebars partial), your browser will reload automatically.
 

 - Lib folder under root/src/Lib contains should contain user code reusable by multiple projects.
 - Vendor folder under root/vendor should contain third party javascript libraries.
 - Test folder under roott/tests should contain everything related to tests. Not yet implemented.

 - Lib folder under root/lib contains the source of the staticstuff toolkit.
 
