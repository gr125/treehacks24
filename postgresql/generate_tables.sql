-- care plans, claims, devices, encounters, imaging studies, immunizations, medications, observations, procedures 
DROP TABLE IF EXISTS patients;

CREATE TABLE patients (
    id VARCHAR(50),
    birthdate DATE,
    deathdate DATE,
    ssn VARCHAR(20),
    drivers VARCHAR(20),
    passport VARCHAR(20),
    prefix VARCHAR(20),
    first VARCHAR(50),
    last VARCHAR(50),
    suffix VARCHAR(20),
    maiden VARCHAR(50),
    marital VARCHAR(20),
    race VARCHAR(20),
    ethnicity VARCHAR(20),
    gender VARCHAR(10),
    birthplace VARCHAR(100),
    address VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(20),
    county VARCHAR(50),
    fips VARCHAR(20),
    zip VARCHAR(20),
    lat FLOAT,
    lon FLOAT,
    healthcare_expenses FLOAT,
    healthcare_coverage FLOAT,
    income FLOAT
);

DROP TABLE IF EXISTS allergies;

CREATE TABLE allergies (
    "start" TIMESTAMP,
    "stop" TIMESTAMP,
    "patient" VARCHAR(50),
    "encounter" VARCHAR(50),
    "code" VARCHAR(50),
    "system" VARCHAR(100),
    "description" VARCHAR(255),
    "type" VARCHAR(50),
    "category" VARCHAR(50),
    "reaction1" VARCHAR(50),
    "description1" VARCHAR(255),
    "severity1" VARCHAR(50),
    "reaction2" VARCHAR(50),
    "description2" VARCHAR(255),
    "severity2" VARCHAR(50)
);

DROP TABLE IF EXISTS conditions;

CREATE TABLE conditions (
    "start" TIMESTAMP,
    "stop" TIMESTAMP,
    "patient" VARCHAR(50),
    "encounter" VARCHAR(50),
    "code" VARCHAR(50),
    "description" VARCHAR(255)
);

DROP TABLE IF EXISTS observations;

CREATE TABLE observations (
    "date" DATE,
    "patient" VARCHAR(50),
    "encounter" VARCHAR(50),
    "category" VARCHAR(50),
    "code" VARCHAR(50),
    "description" VARCHAR(255),
    "value" VARCHAR(255),
    "units" VARCHAR(50),
    "type" VARCHAR(50)
);

COPY observations("date","patient","encounter","category","code","description","value","units","type")
FROM '/Users/brendantang/Developer/Treehacks/output/csv/observations.csv'
DELIMITER ','
CSV HEADER;

COPY conditions("start","stop","patient","encounter","code","description")
FROM '/Users/brendantang/Developer/Treehacks/output/csv/conditions.csv'
DELIMITER ','
CSV HEADER;

COPY allergies("start","stop","patient","encounter","code","system","description","type","category","reaction1","description1","severity1","reaction2","description2","severity2")
FROM '/Users/brendantang/Developer/Treehacks/output/csv/allergies.csv'
DELIMITER ','
CSV HEADER;

COPY patients("id","birthdate","deathdate","ssn","drivers","passport","prefix","first","last","suffix","maiden","marital","race","ethnicity","gender","birthplace","address","city","state","county","fips","zip","lat","lon","healthcare_expenses","healthcare_coverage","income")
FROM '/Users/brendantang/Developer/Treehacks/output/csv/patients.csv'
DELIMITER ','
CSV HEADER;

