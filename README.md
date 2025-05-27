# Puzzle Garden Front-end 
This is a front-end interface for running Puzzle Garden. Requires a backend surver to be running. 

## Run Locally 

### Install node and npm 
Follow the instructions to install node and npm : https://docs.npmjs.com/downloading-and-installing-node-js-and-npm 

### Download code from git 

Download the source code from GitHub. In the terminal you can install dependacies with the following command: 

```
npm install
```

### Set up configuration 
Open src/API/config.js in a text editor. Change the API_URL to wherever the server is hosted. If server is deployed locally change this to 



```
const API_URL = 'http://127.0.0.1:3000'  
```

### Run the interface 

In the command line run the command

```
npx expo start
```

You should be able to view the interface in any browser using: 

```
http://localhost:8081/
```

Note: the exact numbers may be different, look at the output in the terminal 

## Deploy online 
To step up follow instructions in: https://docs.expo.dev/distribution/publishing-websites/

Once this is set up, you can update the interface in two steps: 


Step 1: 
```
firebase login 
```


```
npm run deploy-hosting 
```


