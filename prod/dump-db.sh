#!/usr/bin/env sh

set -eu;

if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

ssh -i "$APP_KEY_PATH" "ec2-user@$APP_SERVER_HOST" 'docker exec ec2-user-bot-db-1 sh -c "pg_dump -U postgres --column-inserts --data-only > dump.sql"'

echo "SQL file created"

ssh -i "$APP_KEY_PATH" "ec2-user@$APP_SERVER_HOST" 'docker cp ec2-user-bot-db-1:./dump.sql .'

scp -i "$APP_KEY_PATH" "ec2-user@$APP_SERVER_HOST:~/dump.sql" .
