#!/usr/bin/env sh

set -eu;

if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "start deploy of server $APP_SERVER_HOST"

ssh -i "$APP_KEY_PATH" "ec2-user@$APP_SERVER_HOST" 'docker-compose pull'

echo "Pull images completed"

ssh -i "$APP_KEY_PATH" "ec2-user@$APP_SERVER_HOST" 'docker-compose down'

ssh -i "$APP_KEY_PATH" "ec2-user@$APP_SERVER_HOST" 'docker-compose up -d'

echo "service started"
