#!/bin/sh
ARRAY=(Albert "Bad News" Bahh Bells Boing Bubbles Cellos Deranged "Good News" Hysterical Trinoids Whisper Zarvox Daniel Kate Oliver Serena Rishi Veena Karen Lee Fiona Kyoko Otoya Katya Milena Moira Agnes Alex Allison Ava Bruce Fred Junior Kathy Nicky Princess Ralph Samantha Susan Tom Vicki Victoria)

j=${#ARRAY[@]}
for var in {0..50}
do
    echo "\n"
done
sleep 3
echo "全部で${j}人います"
for((k=0;k<j;k++))
do
    echo "${ARRAY[k]}"
    say -v "${ARRAY[k]}" "Good night" #"Hi.I'm ${ARRAY[k]}."
done
echo "end"
sleep 3
for var in {0..50}
do
    echo "\n"
done

