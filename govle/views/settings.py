from flask import Blueprint, render_template
from flask_login import login_required

settings = Blueprint("settings", __name__)


@settings.route("/settings")
@login_required
def settings_page():
    return render_template("settings.html")
