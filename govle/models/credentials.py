from abc import ABC
from dataclasses import dataclass, field
from typing import List


@dataclass
class LearningEnvCredentials(ABC):
    pass


@dataclass
class GoogleCredentials(LearningEnvCredentials):
    # Associated user ID
    user_id: str = ""

    # Associated e-mail address
    email: str = ""

    # OAuth2 access token
    token: str = ""

    # OAuth2 refresh token
    refresh_token: str = ""

    # OAuth2 token URI
    token_uri: str = ""

    # OAuth2 client ID
    client_id: str = ""

    # OAuth2 client secret
    client_secret: str = ""

    # OAuth2 scopes
    scopes: List[str] = field(default_factory=list)

    # OpenID token
    id_token: str = ""

    # OAuth2 expiry
    expiry: str = ""


@dataclass
class MoodleCredentials(LearningEnvCredentials):
    # Username
    username: str = ""

    # Token
    password: str = ""

    # Moodle server URL
    server: str = ""
