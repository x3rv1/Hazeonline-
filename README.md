# Haze Online.

## Description
-This is the Back end that powers the Haze online app.
-Uses fastapi as the frame work.
-Uses sqlalchemy for db management.
-At the beginning use sqlite but when hosting the application switch to postgres
## Project Setup

1. Use `pipenv install sqlalchemy alembic "fastapi [standard]"` to install the required packages.
2. Using `pipenv shell`activate the virtual environment.
3. initialise migrations by typing the following command on the terminal `alembic init migrations`.we only run this command once.
4. update the alembic ini file and set the sqlalchemy to whatever the data base should be  ie;sqlite:///haze_online.db
5. Create the two necesarry python files
6. After setting up atleast one model, we need to modify the env.py inside the migration folder and update thr targe_metadata
7. to start backend use ```fast api dev app.py```


## Handling migrations usiing alembic
-to generate migration file we run `alembic revision --autogenerate -m "the message"`
-To apply the migration, we run `alembic upgrade head` 