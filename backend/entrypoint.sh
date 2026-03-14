#!/bin/sh

# Transform Render's DATABASE_URL (postgresql://user:pass@host/db)
# into a proper JDBC URL (jdbc:postgresql://host/db)
# Credentials are passed separately via SPRING_DATASOURCE_USERNAME/PASSWORD.

if [ -n "$DATABASE_URL" ]; then
  # Strip the scheme (postgresql://) and extract host+db portion after the @
  HOST_AND_DB=$(echo "$DATABASE_URL" | sed 's|^postgresql://[^@]*@||')
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${HOST_AND_DB}"
fi

exec java -jar app.jar
