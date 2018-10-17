#!/usr/bin/env bash

app_path="/usr/src/app/src/index.js"
forever_log="/var/log/app/forever.log"
app_access_log="/var/log/app/access.log"
app_error_log="/var/log/app/error.log"

touch $forever_log

forever start -a \
  -l "$forever_log" \
  -o "$app_access_log" \
  -e "$app_error_log" \
  "$app_path"