if [ $1 ]; then
    MESSAGE=$*
else
    MESSAGE="update"
fi

git add --all
git commit -m "$MESSAGE"
git push origin master
