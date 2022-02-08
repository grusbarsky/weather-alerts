\echo 'Delete and recreate weather_alerts db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE weather_alerts;
CREATE DATABASE weather_alerts;
\connect weather_alerts

\i db-schema.sql
\i db-seed.sql

\echo 'Delete and recreate weather_alerts_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE weather_alerts_test;
CREATE DATABASE weather_alerts_test;
\connect weather_alerts_test

\i db-schema.sql
\i db-seed.sql
