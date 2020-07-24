# cognito-nginx
 This application uses AWS congito for user authentication and then the authenticated users are able to fetch the nginx logs present on the server
 
 ## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install required dependencies.

```bash
npm install
```
## Starting the application

```bash
npm start
```

## Usage

check if the server is up and running by sending http get request to http://15.206.73.154:80

To register for a new account send a http POST request to http://15.206.73.154:80/auth/register with the request body as:
```json
 { 
   "name": "someusername",
   "password": "somesecurepassword",
   "email": "youremail@domain.com"
  }
  ```
  Verify your account you just created by sending http POST request to http://15.206.73.154:80/auth/verify with request body:
  ```json
  { 
    "name":"usernameUsedtoCreateAccount",
    "code":"verificationCodeFromEmail"
  }
  ```
  To login to your newly created account, send a http POST request to http://15.206.73.154:80/auth/login with body as:
  ```json
  { 
    "name":"yourusername",
    "password":"yourpassword"
  }
  ```
  You will receive an JWT which will be used later to autheticate you on the server for fetchng fetching the nginx logs
  
  # Fetching the nginx logs
  There are two types of nginx log 1.Access logs and 2. Errors logs. which can be fetched using these two api endpoints:
  for access logs: http://15.206.73.154:80/logs/accesslogs
  for error logs: http://15.206.73.154:80/logs/errorlogs
  
  send a POST request to these endpoints with the Authorization header set with the JWT received during the login 
  with the request body as
  ```json
  { "idx": "1" }
  ```
  idx will act as the index for the paginated api..1 will return the first page..2 will return the 2nd page and so on..
  
  ## References
  https://www.npmjs.com/package/amazon-cognito-identity-js
  https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
  
