#!/usr/bin/env python3
"""Run a Google PageSpeed Insights check for a URL.

Uses only the Python standard library (no pip install needed).
An API key is optional for occasional, low-volume use, but avoids
stricter unauthenticated rate limits. Pass it via --key or set
PAGESPEED_API_KEY / GOOGLE_PAGESPEED_API_KEY in the environment.
"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

API_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

METRIC_LABELS = {
    "first-contentful-paint": "FCP",
    "largest-contentful-paint": "LCP",
    "total-blocking-time": "TBT",
    "cumulative-layout-shift": "CLS",
    "speed-index": "Speed Index",
    "interactive": "TTI",
}


def fetch_report(url, strategy, categories, api_key=None):
    params = [("url", url), ("strategy", strategy)]
    for category in categories:
        params.append(("category", category))
    if api_key:
        params.append(("key", api_key))

    full_url = f"{API_ENDPOINT}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(
        full_url, headers={"User-Agent": "cape-vows-pagespeed-check/1.0"}
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"PageSpeed API error {e.code}: {body}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"Network error contacting PageSpeed API: {e.reason}", file=sys.stderr)
        sys.exit(1)


def summarize(report):
    lighthouse = report.get("lighthouseResult", {})
    categories = lighthouse.get("categories", {})
    audits = lighthouse.get("audits", {})

    scores = {
        name: round(data["score"] * 100)
        for name, data in categories.items()
        if data.get("score") is not None
    }

    metrics = {}
    for key, label in METRIC_LABELS.items():
        audit = audits.get(key)
        if audit:
            metrics[label] = audit.get("displayValue")

    crux = report.get("loadingExperience", {}).get("metrics", {})

    return {
        "url": report.get("id"),
        "strategy": lighthouse.get("configSettings", {}).get("formFactor"),
        "scores": scores,
        "lab_metrics": metrics,
        "field_data_available": bool(crux),
    }


def main():
    parser = argparse.ArgumentParser(
        description="Run a Google PageSpeed Insights check for a URL."
    )
    parser.add_argument("url", help="URL to test")
    parser.add_argument(
        "--strategy", choices=["mobile", "desktop"], default="mobile"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Print the full raw PageSpeed API response instead of a summary",
    )
    parser.add_argument(
        "--category",
        action="append",
        choices=["performance", "accessibility", "best-practices", "seo"],
        help="Limit to specific Lighthouse categories (repeatable). Defaults to performance only.",
    )
    parser.add_argument(
        "--key",
        default=os.environ.get("PAGESPEED_API_KEY")
        or os.environ.get("GOOGLE_PAGESPEED_API_KEY"),
        help="Google API key (optional; falls back to PAGESPEED_API_KEY / "
        "GOOGLE_PAGESPEED_API_KEY env vars, or unauthenticated low-volume access)",
    )
    args = parser.parse_args()

    categories = args.category or ["performance"]
    report = fetch_report(args.url, args.strategy, categories, api_key=args.key)

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(json.dumps(summarize(report), indent=2))


if __name__ == "__main__":
    main()
