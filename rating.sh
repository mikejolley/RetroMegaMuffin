#!/bin/bash
RED='\033[0;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR

FILE="$SCRIPT_DIR/data/ratings.json"
PLATFORMCODE=0

echo -e "${GREEN}Choose a platform:"

select platform in NES SNES GENESIS GAMECUBE PLAYSTATION SATURN; do
  case $platform in
    NES)
      echo -e "${CYAN}Selected $platform"
      PLATFORMCODE='NES'
      break
      ;;
    SNES)
      echo -e "${CYAN}Selected $platform"
      PLATFORMCODE='SNES'
      break
      ;;
    GENESIS)
      echo -e "${CYAN}Selected $platform"
      PLATFORMCODE='Mega Drive'
      break
      ;;
    GAMECUBE)
      echo -e "${CYAN}Selected $platform"
      PLATFORMCODE='GameCube'
      break
      ;;
    PLAYSTATION)
        echo -e "${CYAN}Selected $platform"
        PLATFORMCODE='PLAYSTATION'
        break
        ;;
    SATURN)
        echo -e "${CYAN}Selected $platform"
        PLATFORMCODE='Sega Saturn'
        break
        ;;
    *)
      echo -e "${RED}Invalid option $REPLY"
      ;;
  esac
done

echo -e "${GREEN}"
read -p "Enter game title: " title
echo -e "${CYAN}Let's rate $title on the $PLATFORMCODE!"
echo    # (optional) move to a new line
read -p "Rate gameplay 1-5: " gameplay
read -p "Rate graphics/animations 1-5: " graphics
read -p "Rate music/sounds 1-5: " music
read -p "Rate the length and replay value 1-5: " replay
read -p "Rate the overall challenge and fairness of the game 1-5: " challenge
read -p "Personally, how much did you like the game overall? 1-5: " slant
echo    # (optional) move to a new line

total=$(echo "$gameplay * 0.2 + $graphics * 0.2 + $music * 0.2 + $replay * 0.1 + $challenge * 0.1 + $slant * 0.2 " | bc)

echo -e "${CYAN}Based on those values, you rated $title $total out of 5."
echo -e "${GREEN}"
read -p "Submit score? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cp "$FILE" "$FILE.tmp"
  jq --arg title "$title" --arg platform "$PLATFORMCODE" '.ratingsList += [{
		"name": $title,
		"platform": $platform,
		"ratings": {
			"gameplay": '$gameplay',
			"graphics": '$graphics',
			"music": '$music',
			"replay": '$replay',
			"challenge": '$challenge',
			"slant": '$slant'
		}
	}]' "$FILE.tmp" --tab > "$FILE"
    rm "$FILE.tmp"
  # Auto-commit and push new ratings
  git add data/ratings.json
  git commit -m "Rating for $title"
  git push
  echo -e "${GREEN}Done! Rating added to $FILE"
fi
