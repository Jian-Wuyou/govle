from json import dumps
from typing import List

from flask import Blueprint, current_app, redirect, url_for
from flask_login import current_user, login_required
from govle.controllers.moodle import MoodleClient
from govle.models.credentials import MoodleCredentials
from govle.models.deadline import Deadline, sort_deadlines
from govle.models.learning_env_class import LearningEnvClassEnc

moodle = Blueprint("moodle", __name__)

# Nice way to require login for entire blueprint
@moodle.before_request
@login_required
def moodle_before_request():
    # Check if user has Moodle credentials
    if len(current_user.moodle_account.password) == 0:
        # Redirect to Moodle account linking page
        return redirect(url_for("link-moodle.link_moodle_page"))
    return None


# Create client if it doesn't exist yet
def create_moodle_client(creds: MoodleCredentials) -> MoodleClient:
    if "moodle_client" not in current_app.config:
        current_app.config["moodle_client"] = MoodleClient(creds)
    return current_app.config["moodle_client"]


@moodle.route("/courses")
def moodle_get_classes():
    client = create_moodle_client(current_user.moodle_account)
    return dumps(client.get_classes(), cls=LearningEnvClassEnc)


@moodle.route("/deadlines")
def moodle_get_deadlines():
    # Get deadlines from Moodle
    client = create_moodle_client(current_user.moodle_account)
    raw_deadlines: List[Deadline] = client.get_deadlines()
    return dumps(sort_deadlines(raw_deadlines))
