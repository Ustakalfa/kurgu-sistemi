#!/bin/zsh
set -euo pipefail
cd "${GIRDI:-$PWD}"
photocraft-cli run --new '{"width":3840,"height":2160,"mode":"rgb","depth":8,"background":"#172335","name":"Sentetik Kapak"}' \
 --cmd layer.newFillLayer.gradient --params '{"from":"#101629","to":"#1e7e86","angle":25}' \
 --cmd file.placeEmbedded --params '{"path":"kapak-kare.png","smartObject":true,"scale":85}' \
 --cmd layer.newAdjustmentLayer.curves --params '{"points":[[0,0],[128,140],[255,255]]}' \
 --cmd layer.newAdjustmentLayer.vibrance --params '{"vibrance":20,"saturation":5}' \
 --cmd type.create --params '{"x":180,"y":950,"text":"ÇAĞRI IŞIĞI ÖĞÜN ŞÜKÜR İĞNE","font":"Helvetica Neue","size":170,"color":"#ffffff","name":"Başlık"}' \
 --cmd layer.layerStyle.stroke --params '{"size":8,"position":"outside","color":"#0c1930"}' \
 --cmd layer.layerStyle.dropShadow --params '{"color":"#000000","opacity":75,"angle":120,"distance":16,"size":28}' \
 --out kapak.pcraft
photocraft-cli run kapak.pcraft --cmd layer.select --params '{"layer":7}' \
 --cmd filter.sharpen.unsharpMask --params '{"amount":80,"radius":1.5,"threshold":2}' \
 --cmd filter.lensCorrection --params '{"profile":"none","correctDistortion":false,"correctVignette":false,"correctCA":false,"vignetteAmount":-25,"vignetteMidpoint":55}' \
 --out kapak-son.pcraft
photocraft-cli run kapak-son.pcraft --out kapak.png
photocraft-cli run kapak-son.pcraft --out kapak.jpg --quality 90
photocraft-cli run kapak-son.pcraft --out kapak.psd
photocraft-cli run kapak-son.pcraft --cmd image.imageSize --params '{"width":1280,"height":720,"resample":"lanczos"}' --out kapak-1280x720.png
photocraft-cli batch --actions "${0:A:h}/photocraft-batch-adimlar.json" --in batch-girdi --out batch-cikti --format png
