#!/bin/sh

# Transform Render's DATABASE_URL (postgresql://...) into a JDBC-compatible URL (jdbc:postgresql://...)
if [ -n "$DATABASE_URL" ]; then
  export SPRING_DATASOURCE_URL="jdbc:${DATABASE_URL}"
fi

exec java -jar app.jar
