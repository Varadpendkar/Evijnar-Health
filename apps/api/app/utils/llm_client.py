"""
Unified LLM client wrapper for data mapping.
Supports Anthropic Claude and Groq providers with shared caching/retry logic.
Includes caching, retry logic, and structured output parsing.
"""

import asyncio
import hashlib
import json
import logging
from typing import Optional, Dict, Any

import httpx
import redis.asyncio as redis
from anthropic import AsyncAnthropic
from anthropic import APIError, RateLimitError, APIConnectionError

from app.config import settings

logger = logging.getLogger("evijnar.llm")


class LLMCache:
    """Redis-backed cache for LLM responses"""

    def __init__(self, redis_url: Optional[str] = None):
        self.redis_url = redis_url or settings.redis_url if hasattr(
            settings, "redis_url") else "redis://localhost:6379"
        self.redis: Optional[redis.Redis] = None
        self.enabled = self.redis_url is not None

    async def connect(self):
        """Initialize Redis connection"""
        if not self.enabled:
            return

        try:
            self.redis = await redis.from_url(self.redis_url)
            await self.redis.ping()
            logger.info("Connected to Redis cache")
        except Exception as e:
            logger.warning(
                f"Failed to connect to Redis: {e}. Continuing without cache.")
            self.enabled = False

    async def disconnect(self):
        """Close Redis connection"""
        if self.redis:
            await self.redis.close()

    def _get_cache_key(self, prompt: str, model: str) -> str:
        """Generate deterministic cache key from prompt"""
        prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()[:16]
        return f"llm:v1:{model}:{prompt_hash}"

    async def get(self, prompt: str, model: str) -> Optional[Dict[str, Any]]:
        """Get cached response"""
        if not self.enabled or not self.redis:
            return None

        try:
            key = self._get_cache_key(prompt, model)
            cached = await self.redis.get(key)
            if cached:
                logger.debug(f"Cache hit for: {key[:20]}...")
                return json.loads(cached)
        except Exception as e:
            logger.warning(f"Cache retrieval error: {e}")

        return None

    async def set(self, prompt: str, model: str, response: Dict[str, Any], ttl: int = 86400):
        """Cache response with TTL"""
        if not self.enabled or not self.redis:
            return

        try:
            key = self._get_cache_key(prompt, model)
            await self.redis.setex(key, ttl, json.dumps(response))
            logger.debug(f"Cached response: {key[:20]}...")
        except Exception as e:
            logger.warning(f"Cache write error: {e}")


class ClaudeClient:
    """
    Async wrapper around Anthropic's Claude API.
    Handles structured output parsing, retries, and caching.
    """

    def __init__(self, api_key: Optional[str] = None, cache: Optional[LLMCache] = None):
        self.api_key = api_key or settings.anthropic_api_key if hasattr(
            settings, "anthropic_api_key") else None
        self.client = AsyncAnthropic(api_key=self.api_key)
        self.cache = cache or LLMCache()
        self.model = "claude-opus-4"  # Use latest model
        self.max_retries = 3
        self.retry_delay = 1  # seconds

        self.usage_stats = {
            "provider": self.provider,
            "total_calls": 0,
            "total_tokens": 0,
            "total_cached": 0,
            "estimated_cost_usd": 0.0,
        }

        # Approximate token pricing (subject to provider updates)
        self.pricing = {
            "input_tokens_per_mtok": 0.003,
            "output_tokens_per_mtok": 0.015,
        }

        logger.info(
            f"LLM client initialized with provider={self.provider}, model={self.model}"
        )

    async def initialize(self):
        """Initialize cache connection"""
        await self.cache.connect()

    async def shutdown(self):
        """Clean up resources"""
        await self.cache.disconnect()

    async def _call_anthropic(
        self,
        prompt: str,
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int,
    ) -> tuple[str, Dict[str, int]]:
        if not self.api_key:
            raise RuntimeError("ANTHROPIC_API_KEY is not configured")

        if self.client is None:
            self.client = AsyncAnthropic(api_key=self.api_key)

        response = await self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_prompt,
            messages=[{"role": "user", "content": prompt}],
        )

        response_text = response.content[0].text
        usage = {
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
        }
        return response_text, usage

    async def _call_groq(
        self,
        prompt: str,
        system_prompt: Optional[str],
        response_format: str,
        temperature: float,
        max_tokens: int,
    ) -> tuple[str, Dict[str, int]]:
        if not self.api_key:
            raise RuntimeError("GROQ_API_KEY is not configured")

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        if response_format == "json":
            payload["response_format"] = {"type": "json_object"}

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            response.raise_for_status()
            data = response.json()

        response_text = data["choices"][0]["message"]["content"]
        usage_data = data.get("usage", {})
        usage = {
            "input_tokens": usage_data.get("prompt_tokens", 0),
            "output_tokens": usage_data.get("completion_tokens", 0),
        }
        return response_text, usage

    async def call_claude(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        response_format: Optional[str] = "json",  # "json" or "text"
        temperature: float = 0.3,  # Lower for structured tasks
        max_tokens: int = 1024,
        cache_ttl: int = 86400,
    ) -> Dict[str, Any]:
        """
        Call Claude API with structured output.

        Args:
            prompt: User prompt
            system_prompt: System context
            response_format: "json" or "text"
            temperature: Model temperature (0-1)
            max_tokens: Max tokens in response
            cache_ttl: Cache TTL in seconds

        Returns:
            Parsed response as dict

        Raises:
            LLMError: If API call fails
        """
        try:
            # Check cache first
            cached_response = await self.cache.get(prompt, self.model)
            if cached_response:
                self.usage_stats["total_cached"] += 1
                return cached_response

            # Build messages
            messages = [{"role": "user", "content": prompt}]

            # Add JSON format instruction
            if response_format == "json":
                if system_prompt:
                    system_prompt += "\n\nAlways respond with valid JSON."
                else:
                    system_prompt = "Always respond with valid JSON."

            # Retry logic
            for attempt in range(self.max_retries):
                try:
                    logger.debug(
                        f"LLM API call provider={self.provider} "
                        f"(attempt {attempt + 1}/{self.max_retries})"
                    )

                    if self.provider == "groq":
                        response_text, usage = await self._call_groq(
                            prompt=prompt,
                            system_prompt=system_prompt,
                            response_format=response_format or "json",
                            temperature=temperature,
                            max_tokens=max_tokens,
                        )
                    else:
                        response_text, usage = await self._call_anthropic(
                            prompt=prompt,
                            system_prompt=system_prompt,
                            temperature=temperature,
                            max_tokens=max_tokens,
                        )

                    input_tokens = usage.get("input_tokens", 0)
                    output_tokens = usage.get("output_tokens", 0)

                    self.usage_stats["total_calls"] += 1
                    self.usage_stats["total_tokens"] += input_tokens + \
                        output_tokens

                    input_cost = (
                        input_tokens / 1_000_000
                    ) * self.pricing["input_tokens_per_mtok"]
                    output_cost = (
                        output_tokens / 1_000_000
                    ) * self.pricing["output_tokens_per_mtok"]
                    self.usage_stats["estimated_cost_usd"] += input_cost + output_cost

                    if response_format == "json":
                        try:
                            if "```json" in response_text:
                                json_str = response_text.split(
                                    "```json")[1].split("```")[0].strip()
                            elif "```" in response_text:
                                json_str = response_text.split(
                                    "```")[1].split("```")[0].strip()
                            else:
                                json_str = response_text

                            parsed_response = json.loads(json_str)
                        except json.JSONDecodeError as e:
                            logger.error(
                                f"Failed to parse LLM JSON response: {str(e)}")
                            logger.error(
                                f"Response text: {response_text[:200]}...")
                            raise ValueError(
                                f"Invalid JSON in LLM response: {str(e)}")
                    else:
                        parsed_response = {"text": response_text}

                    # Cache the response
                    await self.cache.set(prompt, self.model, parsed_response, cache_ttl)

                    return parsed_response

                except RateLimitError:
                    if attempt < self.max_retries - 1:
                        wait_time = self.retry_delay * \
                            (2 ** attempt)  # Exponential backoff
                        logger.warning(
                            f"Rate limited. Waiting {wait_time}s before retry...")
                        await asyncio.sleep(wait_time)
                    else:
                        raise APIError(
                            "Rate limit exceeded after retries", request=None)

                except APIConnectionError as e:
                    if attempt < self.max_retries - 1:
                        wait_time = self.retry_delay * (2 ** attempt)
                        logger.warning(
                            f"Connection error: {e}. Waiting {wait_time}s before retry...")
                        await asyncio.sleep(wait_time)
                    else:
                        raise

                except (RateLimitError, httpx.HTTPStatusError) as e:
                    is_rate_limit = isinstance(e, RateLimitError) or (
                        isinstance(e, httpx.HTTPStatusError)
                        and e.response is not None
                        and e.response.status_code == 429
                    )

                    if is_rate_limit and attempt < self.max_retries - 1:
                        wait_time = self.retry_delay * (2 ** attempt)
                        logger.warning(
                            f"Rate limited by {self.provider}. Waiting {wait_time}s before retry..."
                        )
                        await asyncio.sleep(wait_time)
                    else:
                        raise

        except Exception as e:
            logger.error(f"LLM ({self.provider}) error: {str(e)}")
            raise

    def get_usage_stats(self) -> Dict[str, Any]:
        """Get accumulated usage statistics"""
        return self.usage_stats.copy()

    def reset_usage_stats(self):
        """Reset usage statistics"""
        self.usage_stats = {
            "provider": self.provider,
            "total_calls": 0,
            "total_tokens": 0,
            "total_cached": 0,
            "estimated_cost_usd": 0.0,
        }


# Global instance
_llm_client: Optional[ClaudeClient] = None


async def get_llm_client() -> ClaudeClient:
    """Get or create global Claude client"""
    global _llm_client

    if _llm_client is None:
        _llm_client = ClaudeClient()
        await _llm_client.initialize()

    return _llm_client


async def shutdown_llm_client():
    """Shutdown global Claude client"""
    global _llm_client

    if _llm_client:
        await _llm_client.shutdown()
        _llm_client = None
