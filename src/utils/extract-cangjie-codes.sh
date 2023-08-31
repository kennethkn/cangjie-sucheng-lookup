#!/usr/bin/env bash

while read line; do
  if [[ ${line:0:1} != "#" ]]; then
    IFS=$'\t' read -ra columns <<<"$line"
    if [[ ${columns[1]} == "kCangjie" ]]; then
      json+=", \"${columns[0]:2}\": \"${columns[2]}\""
    fi
  fi
done <src/data/Unihan_DictionaryLikeData.txt
json=${json:2}
json="{$json, \"3000\": \"ZXAA\", \"FF0C\": \"ZXAB\", \"3001\": \"ZXAC\", \"3002\": \"ZXAD\", \"FF0E\": \"ZXAE\", \"2027\": \"ZXAF\", \"FF1B\": \"ZXAG\", \"FF1A\": \"ZXAH\", \"FF1F\": \"ZXAI\", \"FF01\": \"ZXAJ\", \"FE30\": \"ZXAK\", \"2026\": \"ZXAL\", \"2025\": \"ZXAM\", \"FE50\": \"ZXAN\", \"FE51\": \"ZXAO\", \"FE52\": \"ZXAP\", \"B7\": \"ZXAQ\", \"FE54\": \"ZXAR\", \"FE55\": \"ZXAS\", \"FE56\": \"ZXAT\", \"FE57\": \"ZXAU\", \"FF5C\": \"ZXAV\", \"2013\": \"ZXAW\", \"FE31\": \"ZXAX\", \"2014\": \"ZXAY\", \"FE33\": \"ZXBA\", \"2574\": \"ZXBB\", \"FE34\": \"ZXBC\", \"FE4F\": \"ZXBD\", \"FF08\": \"ZXBE\", \"FF09\": \"ZXBF\", \"FE35\": \"ZXBG\", \"FE36\": \"ZXBH\", \"FF5B\": \"ZXBI\", \"FF5D\": \"ZXBJ\", \"FE37\": \"ZXBK\", \"FE38\": \"ZXBL\", \"3014\": \"ZXBM\", \"3015\": \"ZXBN\", \"FE39\": \"ZXBO\", \"FE3A\": \"ZXBP\", \"3010\": \"ZXBQ\", \"3011\": \"ZXBR\", \"FE3B\": \"ZXBS\", \"FE3C\": \"ZXBT\", \"300A\": \"ZXBU\", \"300B\": \"ZXBV\", \"FE3D\": \"ZXBW\", \"FE3E\": \"ZXBX\", \"3008\": \"ZXBY\", \"3009\": \"ZXCA\", \"FE3F\": \"ZXCB\", \"FE40\": \"ZXCC\", \"300C\": \"ZXCD\", \"300D\": \"ZXCE\", \"FE41\": \"ZXCF\", \"FE42\": \"ZXCG\", \"300E\": \"ZXCH\", \"300F\": \"ZXCI\", \"FE43\": \"ZXCJ\", \"FE44\": \"ZXCK\", \"FE59\": \"ZXCL\", \"FE5A\": \"ZXCM\", \"FE5B\": \"ZXCN\", \"FE5C\": \"ZXCO\", \"FE5D\": \"ZXCP\", \"FE5E\": \"ZXCQ\", \"2018\": \"ZXCR\", \"2019\": \"ZXCS\", \"201C\": \"ZXCT\", \"201D\": \"ZXCU\", \"301D\": \"ZXCV\", \"301E\": \"ZXCW\", \"2035\": \"ZXCX\", \"2032\": \"ZXCY\"}"
echo "$json" >public/data/cangjie-codes.json
