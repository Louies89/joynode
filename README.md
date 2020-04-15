#### Basic Setup

1. To start, create a sample project by running the following commands:

```
mkdir joynode
cd joynode
npm init -y
npm install --save react react-dom next
mkdir pages
```
Here **pages** is the the directory, from where NextJS tries to find index.js file to start

2. Then open the "package.json" file in the "joynode" directory and replace scripts with the following:
```
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start"
}
```
3. Now everything is ready. Run the following command to start the dev server:
```
npm run dev
```

Then open `http://localhost:3000` from your favourite browser.

4. Output you see on the screen is :
```
404 - This page could not be found
```
5. The error is there, as there is no pages to load, so lets create a index.js page
Create a file named "pages/index.js" and add the following content:
```
export default function Index() {
  return (
    <div>
      <p>Hello JOY</p>
    </div>
  );
}
```

By checking the we can see **Hello JOY**.


6. Now lets add bootstrap & font-awesome from CDN.
```
import Head from 'next/head'

export default function Index() {
	return (
		<div>
			<Head>
				<title>Home</title>
				<link rel="stylesheet" crossorigin="anonymous"   //Add Boot Strap link in this way only for first loading (Read the advandatge of loading BootStarp from CDN in https://www.w3schools.com/bootstrap/bootstrap_get_started.asp)
				href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
				integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" />

				<link rel="stylesheet"  //Add font-awesome
				href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css"/>  
			</Head>
			<Header/>
			<p>Hello Next.js</p>
		</div>
	);
}
```
By adding these from CDN there is a benifit is, updated packages & first loading, as most of other sites would have fetched these two packages, the browser shall load them from cache.

##### Steps for Babel & Webpack can be icgnored as NextJs itself takes cares of these internally
7. Using Webpack and Babel as dev dependencies

- Webpack and Babel are dev dependencies, i.e. we dont need them in production mode.
- Babal  is responsible for converting the ES5 and ES6 code to browser understandable code, basically backward compatibility. 
-  The Babal packages that we are gonna use are:
	- **babel-core**: Well as the name suggests the main engine of babel plugin for its dependents to work.
	- **babel-preset-env**: This is the ES5, ES6 supporting part
	- **babel-preset-react**: Babel can be used in any framework that needs latest JS syntax support, in our case its “React”, hence this preset.
	- **babel-loader**: Consider this as a bridge of communication between Webpack and Babel
-  At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it internally builds a dependency graph which maps every module your project needs and generates one or more bundles.
	- **webpack**: The main webpack plugin as an engine for its dependents.
	- **webpack-cli**: To access some webpack commands through CLI like starting dev server, creating production build, etc.
	- **webpack-dev-server**: A minimal server for client-side development purpose only.
	- **html-webpack-plugin**: Will help in creating HTML templates for our application.

8. Install Babel
```
npm i -D babel-core babel-loader babel-preset-env babel-preset-react
```
9. Install webpack
```
npm i -D webpack webpack-cli webpack-dev-server html-webpack-plugin
```

Our next step is to create the configuration files which will act as a leash on Webpack and Babel, providing them with the necessary information within which they should operate.

10. Configuring Babel:

create a file .babelrc in "joynode" directory. If directy creating a file starting with "." is not allowed then create using command prompt.

In .babelrc file add below line
```
{"presets":["env", "react"]}
```
This is the configuration file babel looks up for.

11. Configuring Webpack

Create a file webpack.config.js , note the name of the file should be same, the content will be the following:
```
const path = require('path');
const HWP = require('html-webpack-plugin');
module.exports = {
   entry: path.join(__dirname, '/src/index.js'),
   output: {
       filename: 'build.js',
       path: path.join(__dirname, '/dist')
    },
   module:{
       rules:[{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
       }]
   },
   plugins:[
       new HWP(
          {template: path.join(__dirname,'/src/index.html')}
       )
   ]
}
```

12. NextJs with expressjs
https://blog.logrocket.com/how-to-build-a-server-rendered-react-app-with-next-express-d5a389e7ab2f/
https://github.com/zeit/next.js/tree/canary/examples/custom-server-express
https://github.com/mluberry/nextjs-express




## Referances:
https://serverless-stack.com/#table-of-contents 
https://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example
https://auth0.com/blog/next-js-authentication-tutorial/

https://dev.to/jolvera/user-authentication-with-nextjs-4023
https://levelup.gitconnected.com/secure-nextjs-app-users-with-auth0-and-typescript-3b0a6ac3a163 

E-Commerce App : https://www.youtube.com/watch?v=wPQ1-33teR4&t=5449s
Redux: https://www.youtube.com/watch?v=CVpUuw9XSjY&t=1918s