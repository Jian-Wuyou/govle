PYTHON=`command -v python3.10 || command -v python3.9 || command -v python3.8`

VENV := venv
UWSGI_INI := uwsgi.ini

.PHONY: venv

# Setup
install: venv
	# Install external dependencies
	pip install -r requirements.txt
	pre-commit install

venv:
	if ! [ -x "${PYTHON}" ]; then echo "You need Python 3.8, 3.9 or 3.10 installed"; exit 1; fi
	test -d venv || ${PYTHON} -m venv $(VENV) # setup a python3 virtualenv
	. $(VENV)/bin/activate

format:
	pre-commit run black --all-files

lint:
	pylint --rcfile=.pylintrc govle

# Deployment
run: run-uwsgi

run-flask:
	FLASK_APP=govle.app:app FLASK_ENV=development flask run

run-uwsgi:
	uwsgi --ini $(UWSGI_INI)

clean:
	rm -rf $(VENV)
	rm -rf __pycache__
