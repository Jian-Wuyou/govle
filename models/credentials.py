from abc import ABC
from dataclasses import dataclass


@dataclass
class LearningEnvCredentials(ABC):
    pass


@dataclass
class GoogleCredentials():
    # User ID
    user_id: str = ''

    # OAuth2 access token
    access_token: str = ''

    # OAuth2 refresh token
    refresh_token: str = ''


@dataclass
class MoodleCredentials():
    # Username
    username: str = ''

    # Password
    password: str = ''

    # Moodle server URL
    server: str = ''
