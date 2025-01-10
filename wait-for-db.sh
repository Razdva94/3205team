#!/bin/bash
set -e

host="$1"
port="$2"
user="$3"
password="$4"
shift 4
cmd="$@"

until PGPASSWORD="$password" psql -h "$host" -p "$port" -U "$user" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is available - executing command"
exec $cmd
