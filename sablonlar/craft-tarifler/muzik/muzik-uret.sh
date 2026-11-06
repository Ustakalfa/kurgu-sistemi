#!/usr/bin/env zsh
set -euo pipefail
root=$HOME/.local/share/kurgu-araclar
case ${1:-} in
 magenta)
  mrt=$root/magenta-venv/bin/mrt
  "$mrt" models init
  "$mrt" checkpoints download mrt2_small
  "$mrt" mlx generate --no-mlxfn --model mrt2_small --duration 30 --prompt 'Calm piano and warm pad, instrumental documentary underscore'
  print 'Atıf: Magenta RealTime 2 — Google Magenta, CC BY 4.0'
  ;;
 ace)
  ace=$root/ace-step-1.5
  config=${2:-${0:A:h}/ace-step.ornek.toml}
  config=${config:A}
  (cd "$ace" && rm -f instruction.txt && yes '' | .venv/bin/python cli.py -c "$config")
  ;;
 *) print -u2 'Kullanım: muzik-uret.sh magenta | ace [config.toml]'; exit 2;;
esac
