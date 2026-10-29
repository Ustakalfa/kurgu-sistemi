#!/usr/bin/env python3
"""Claude SessionStart güncelleme kancasını güvenle düzenle."""
import argparse
import json
from pathlib import Path


def duzenle(data, command, remove=False):
    data = dict(data)
    hooks = dict(data.get('hooks') or {})
    sessions = list(hooks.get('SessionStart') or [])
    result = []
    found = False
    for group in sessions:
        entries = list(group.get('hooks') or [])
        if any(item.get('command') == command for item in entries):
            found = True
        if remove:
            entries = [item for item in entries if item.get('command') != command]
            if not entries:
                continue
            group = dict(group)
            group['hooks'] = entries
        result.append(group)
    if not remove and not found:
        result.append({'hooks': [{'type': 'command', 'command': command, 'timeout': 20}]})
    if result:
        hooks['SessionStart'] = result
    else:
        hooks.pop('SessionStart', None)
    if hooks:
        data['hooks'] = hooks
    else:
        data.pop('hooks', None)
    return data


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('path', type=Path)
    parser.add_argument('command')
    parser.add_argument('--kaldir', action='store_true')
    args = parser.parse_args()
    data = json.loads(args.path.read_text()) if args.path.exists() else {}
    if not isinstance(data, dict):
        parser.error('settings.json nesne olmalı')
    print(json.dumps(duzenle(data, args.command, args.kaldir), ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
