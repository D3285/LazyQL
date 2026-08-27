"""
llm_client.py
-------------
The ONLY file that knows which local LLM is actually running.
Everything else in this service (and the whole backend) talks to
`LLMClient.complete()` and never touches Ollama/llama.cpp/etc directly.

Default implementation targets Ollama (https://ollama.com) since it's the
fastest way to run a local model in a hackathon (e.g. `ollama pull llama3`
or `ollama pull sqlcoder`). Swap the internals of OllamaClient (or write a
new class with the same .complete() method) to change models later —
nothing else in the codebase needs to change.
"""

import json
import urllib.request
import urllib.error
from abc import ABC, abstractmethod


class LLMClient(ABC):
    """Abstract interface. Any local model backend must implement this."""

    @abstractmethod
    def complete(self, prompt: str, temperature: float = 0.1) -> str:
        """Send a prompt to the model, return raw text completion."""
        raise NotImplementedError


class OllamaClient(LLMClient):
    """
    Talks to a locally running Ollama server (default http://localhost:11434).
    Requires `ollama serve` running and a model pulled, e.g.:
        ollama pull llama3.1
        ollama pull sqlcoder      # SQL-specialized model, often better for this task
    """

    def __init__(self, model: str = "sqlcoder", host: str = "http://localhost:11434"):
        self.model = model
        self.host = host.rstrip("/")

    def complete(self, prompt: str, temperature: float = 0.1) -> str:
        url = f"{self.host}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": temperature},
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url, data=data, headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                body = json.loads(resp.read().decode("utf-8"))
                return body.get("response", "")
        except urllib.error.URLError as e:
            raise ConnectionError(
                f"Could not reach local Ollama server at {self.host}. "
                f"Is `ollama serve` running and is the model '{self.model}' pulled? "
                f"Original error: {e}"
            )


class MockLLMClient(LLMClient):
    """
    Fake client for local dev / testing without a real model running.
    Lets Person 2 (and you) test the API contract before the model is wired up.
    Returns a canned but plausible structured response.
    """

    def complete(self, prompt: str, temperature: float = 0.1) -> str:
        return json.dumps({
            "sql": "SELECT e.name, e.salary FROM employees e "
                   "JOIN departments d ON e.department_id = d.id "
                   "WHERE d.name = 'Engineering' ORDER BY e.salary DESC LIMIT 5;",
            "operation": "SELECT",
            "explanation": "Finds the five highest-paid employees in Engineering.",
            "confidence": 0.9,
        })


def get_default_client() -> LLMClient:
    """
    Single place the rest of the app calls to get a model instance.
    Swap this line to change the default model for the whole project.
    """
    return OllamaClient(model="sqlcoder")
