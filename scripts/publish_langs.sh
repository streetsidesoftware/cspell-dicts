#!/bin/bash

dictionaries=("de_DE" "en_GB" "en_US" "es_ES" "fr_FR" "nl_NL" "pl_PL" "pt_BR" "pt_PT" "ru_RU" "russian" "sv")

echo "Publish the following dictionaries:"
printf "%s " "${dictionaries[@]}"

echo ""
read -r -p 'Proceed y/N: ' keepgoing

if [ "${keepgoing}" != "y" ]
then
    echo "Canceled"
    exit 0
fi

for i in "${dictionaries[@]}"
do
    echo "Running: ./scripts/publish_dict.sh $i"
    ./scripts/publish_dict.sh "$i"
done
