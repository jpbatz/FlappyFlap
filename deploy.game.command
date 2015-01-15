#!/bin/bash

# upload project to server

# read index.html for the author
line=$(head -n 1 ~/Desktop/FlappyFlap/index.html)
author=`echo $line |sed -e "s/<\!\-\- AUTHOR:[ ]*\(.*\)[ ]*\-\->/\1/"`

# trim leading and trailing spaces
author=`echo $author | sed -e 's/^ *//' -e 's/ *$//'`

# upload to server
ssh summer2014gg@summer2014.gomagames.com "rm -Rf \"summer2014.gomagames.com/games/flappy/$author\"; mkdir -p \"summer2014.gomagames.com/games/flappy/$author\""
scp -r ~/Desktop/FlappyFlap/* summer2014gg@summer2014.gomagames.com:"'/home/summer2014gg/summer2014.gomagames.com/games/flappy/$author'"
ssh summer2014gg@summer2014.gomagames.com "chmod +rx -R \"summer2014.gomagames.com/games/flappy/$author\""

ssh summer2014gg@summer2014.gomagames.com "/home/summer2014gg/scripts/auto.index.sh"

echo "done uploading, go to http://summer2014.gomagames.com/games/flappy/$author"

echo "You can close this terminal now."

