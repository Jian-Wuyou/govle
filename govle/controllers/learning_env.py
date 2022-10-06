from abc import ABC, abstractmethod
from typing import List

from govle.models.credentials import LearningEnvCredentials
from govle.models.learning_env_class import LearningEnvClass


class LearningEnv(ABC):
    """
    Abstract class for a learning environment.
    """

    def __init__(self, server: str, credentials: LearningEnvCredentials):
        self.server = server
        self.credentials = credentials

    @abstractmethod
    def get_classes(self) -> List[LearningEnvClass]:
        """
        Gets a list of classes on the given learning environment.
        """

    @abstractmethod
    def get_deadlines(self) -> List[str]:
        """
        Gets a list of deadlines.
        """
