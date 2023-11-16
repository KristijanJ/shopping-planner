
# Shopping list app

This application is a personal project. It uses serverless technology from AWS like API Gateway, Lambda & DynamoDB. For authentication is uses Cognito. The website is hosted on S3 and CloudFront. The frontend is written in React.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)


## Demo

https://shopping-list.projects.jov.mk/
![App Demo](https://s3.eu-central-1.amazonaws.com/static.jov.mk/shopping-list-demo.gif)

Registrations are currently closed but if anyone is interested to gain access, write to me.
## Deployment

To deploy this project, navigate to the shopping-planner-client dir and run the install and build commands:

```bash
  cd shopping-planner-client
  npm install
  npm run build
```

This will output the build in the `shopping-planner-server/client-build` directory.

Next, you would need to deploy your own AWS infrastructure. To do this, there are some environment variables that you need to add (check out below for the environment variables).

Navigate to the shopping-planner-server directory and run:

```bash
  cd shopping-planner-server
  npm install
  ENV_NAME=your-env-name CERTIFICATE_ID=your-cert-id DOMAIN_NAME=your-domain FROM_EMAIL=your-email \
    npm run cdk deploy --profile XXX
```

This will deploy the infrastructure on your AWS account.

Please note that you need to setup access to your AWS account either via temporary credentials, SSO or IAM user.
## Environment Variables

To run this project, you will need to add the following environment variables:

`ENV_NAME` This is the prefix that will be used for the resources and their names/ids

`DOMAIN_NAME` This is the name of your domain where you will host the website.

`CERTIFICATE_ID` The certificate for your domain for SSL.

`FROM_EMAIL` The email from where Cognito emails will be sent.
