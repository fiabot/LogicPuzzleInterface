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


## Deploy on VM 
* Step 1: Git clone repo onto the VM 
* Step 2: Make a build for web 

```npx expo export -p web```

* Step 3: Create a script to run your local server 
    * Create a file script.sh and put the following content 
    * ```#! /bin/bash
        source ${HOME}/.bashrc
        export NODE_ENV=development
        npx serve dist --single -p 8081 ''' 


* Step 3: Create a server to run your script 
  * ```sudo nano /etc/systemd/system/front_end.service```
  * Add the following 
```
[Unit]
Description=Serving a server for the logic puzzle front end
After=network.target
[Service]
User=root
Group=root
WorkingDirectory=/home/path/to/repo
ExecStart=/home/path/to/script
Restart=always
[Install]
WantedBy=multi-user.target
```


* Step 4: Use nginx to sent local server to online url 
  * Install nginx ```sudo apt-get install nginx``
  * Start and enable nginx 
```
sudo systemctl start nginx
sudo systemctl enable nginx
```

  * ```Nano /etc/nginx/nginx.conf```
  * Add the following 

```
upstream front_end {
         server 127.0.0.1:8081;
   }


  upstream back_end {
      server 127.0.0.1:3000;
}

    server {
	    ....


       	location /api/ {
              proxy_pass http://back_end;
        }       
        location / {
            proxy_pass http://front_end;
            }

        ... 
        }
```

## Update VM 

* Step 1: pull changes 
* Step 2: Make new build 

```npx expo export -p web```

* Step 3: Refresh Service 


```sudo systemctl daemon-reload``` 

```sudo systemctl restart front_end.service``

* Step 5: Check the status 
 ```sudo systemctl status front_end.service``


 If you need to debug, check the logs using 
 ```sudo journalctl -u front_end.service -n 200```


