#!/usr/bin/env bash

# This fetches the AWS CLI
# inflates it
# and sets location to the path
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip &> /dev/null
sudo ./aws/install &> /dev/null

## for AWS CLI v2 you need to install "less"
sudo apt-get update && sudo apt-get -y install less

# set the credentials to the default AWS CLI configuration file
mkdir ~/.aws # just in case the CLI did not create the file yet
AWS_CRED_FILE=~/.aws/credentials # just in case the CLI did not create the file yet
# make sure to pass the access and secret keys via the CI tool!
echo "[default]" > $AWS_CRED_FILE
echo -e "aws_access_key_id=$ACCESS_KEY" >> $AWS_CRED_FILE
echo -e "aws_secret_access_key=$SECRET_KEY" >> $AWS_CRED_FILE

# the $CIRCLE_BUILD_NUM variable is provided by CircleCI via the ENV's
# the idea here is to get a incremental version number
# the zip's name can be anything you like
zip -r app_v_$CIRCLE_BUILD_NUM.zip Dockerrun.aws.json

# upload the ZIP file to the beanstalk bucket
aws s3 cp ./app_v_$CIRCLE_BUILD_NUM.zip s3://$S3_BUCKET/docker-c19insights/

# creating a new Beanstalk version from the configuration we uploaded to s3
aws elasticbeanstalk create-application-version --application-name "c19insights" --version-label v$CIRCLE_BUILD_NUM --description="New Version number $CIRCLE_BUILD_NUM" --source-bundle S3Bucket=$S3_BUCKET,S3Key="docker-c19insights/app_v_$CIRCLE_BUILD_NUM.zip" --auto-create-application --region="us-east-2"

# deploying the new version to the given environment
aws elasticbeanstalk update-environment --application-name "c19insights" --environment-name "C19insights-env" --version-label v$CIRCLE_BUILD_NUM --region="us-east-2"

exit 0