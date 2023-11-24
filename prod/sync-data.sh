#!/usr/bin/env sh

set -eu;

if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "Sync data to server $APP_SERVER_HOST"

scp -i "$APP_KEY_PATH" -r ./data/ "ec2-user@$APP_SERVER_HOST":~