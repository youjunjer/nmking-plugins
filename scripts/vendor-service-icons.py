"""Import pinned public SVG paths using an XML parser; never run on install."""

import hashlib
import json
from pathlib import Path
from urllib.request import urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
REVISION = "17cd4ee07612198a1d8777a060d4100423762a8b"
BASE = f"https://raw.githubusercontent.com/simple-icons/simple-icons/{REVISION}/"
NS = "{http://www.w3.org/2000/svg}"


def download(path):
    with urlopen(BASE + path, timeout=20) as response:
        assert response.status == 200
        content = response.read(1024 * 1024)
        assert len(content) < 1024 * 1024
        return content


def main():
    entries = json.loads((ROOT / "catalog/services.json").read_text())["services"]
    metadata = json.loads(download("data/simple-icons.json"))
    icons = {
        "canva": {
            "kind": "monogram",
            "letter": "C",
            "hex": "007F8B",
            "source": "NMKING-created service identifier, not the Canva logo",
        }
    }
    for entry in entries:
        slug = entry["icon"]
        if slug == "canva":
            continue
        raw = download(f"icons/{slug}.svg")
        svg = ET.fromstring(raw)
        assert svg.tag == NS + "svg" and svg.attrib["viewBox"] == "0 0 24 24"
        info = next(row for row in metadata if row["title"] == entry["name"])
        assert all(child.tag in (NS + "title", NS + "path") for child in svg)
        paths = [child.attrib for child in svg if child.tag == NS + "path"]
        assert paths and all(set(path) <= {"d", "fill-rule", "clip-rule"} for path in paths)
        icons[slug] = {
            "kind": "paths",
            "hex": info["hex"],
            "source": BASE + f"icons/{slug}.svg",
            "upstream_brand_source": info["source"],
            "upstream_sha256": hashlib.sha256(raw).hexdigest(),
            "paths": paths,
        }
    license_bytes = download("LICENSE.md")
    result = {
        "schema_version": 1,
        "publisher": "Simple Icons contributors",
        "revision": REVISION,
        "license": "CC0-1.0",
        "license_sha256": hashlib.sha256(license_bytes).hexdigest(),
        "icons": icons,
    }
    license_path = ROOT / "third_party/simple-icons/LICENSE.md"
    license_path.parent.mkdir(parents=True, exist_ok=True)
    license_path.write_bytes(license_bytes)
    (ROOT / "catalog/icon-sources.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    )
    print(json.dumps({"icons": len(icons), "revision": REVISION, "provider_accounts_accessed": 0}))


if __name__ == "__main__":
    main()
