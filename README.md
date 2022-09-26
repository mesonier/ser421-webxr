# ser421-webxr
Functioning webxr Demo using three JS. 

### Platforms

---

Works in browser via [WebXR API Emulator](https://chrome.google.com/webstore/detail/webxr-api-emulator/mjddjgeghkdijejnciaefnkjmkafnnje?hl=en)

Works natively on Android/iPhone devices through Google Chrome.

### Getting started

---

#### 1.  Install NodeJS / NPM / PuTTYgen
To start, make sure that you have NodeJS and NPM installed. The easiest way to do this is through NVM (Node Version Manager). A link to the installation instructions may be found in the footer of this page. Once you have both NodeJS and NPM, you will need to install http-server, which may be done using:
```
npm install http-server
```
This will install the required packages for hosting a web server locally on your machine. Because the software deployed to the web server uses HTTPS/SSL specifically, Windows and Mac users will need to download PuTTYgen, and Linux users may use OpenSSL/PuTTYgen to create a public/private SSL key pair. Linux users can typically find the 'openssl' and 'putty-tools' packages with their distribution's package manager.

---
#### 2. Download the project repository
You may use git to clone the repository using
```
git clone https://github.com/mesonier/ser421-webxr.git
```
alternatively, you can download the source from the Github Website:
https://github.com/mesonier/ser421-webxr

---

#### 3. Run the Test Project
 you can run the project in this directory using the command:
```
http-server -C cert.pem -S 
```
This will begin the web server on `127.0.0.1:8080` through HTTPS. When viewing this location locally on browsers (like your smartphone), it will state that the connection to the server is unsecure. Disregard this message and continue to the site anyway. The web app will ask for your location as it uses your GPS and accelerometer to accurately depict your surroundings three-dimensionally. On success, you should see the app running in fullscreen on your smartphone device.
