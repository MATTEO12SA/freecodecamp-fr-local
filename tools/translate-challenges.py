#!/usr/bin/env python3
"""Disabled: Argos bulk translation is not a valid source for this fork.

Use the extract / apply / verify pipeline instead:

    node tools/translate-workshop.js extract <block>
    # translate tools/translations/<block>.json, set reviewed: true
    node tools/translate-workshop.js apply <block>
    node tools/translate-workshop.js verify <block>
    node tools/check-translation-quality.js <block>
"""

from __future__ import annotations

import sys

sys.stderr.write(
    "tools/translate-challenges.py is disabled.\n"
    "Argos output is not accepted as a final French translation.\n"
    "Use tools/translate-workshop.js extract/apply/verify instead.\n"
)
sys.exit(2)
