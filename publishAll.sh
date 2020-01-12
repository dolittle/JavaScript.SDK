#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "No version number supplied"
    exit 1
fi

echo "Publishing $1"

for f in Source/*; do
    pushd $PWD > /dev/null
    cd $f
    echo "Publishing $f"
    yarn publish --new-version $1 --no-git-tag-version
    popd > /dev/null
done

echo "Committing changed files"
git add .
git commit -m "Publishing version $1"

echo "Adding tag for the version"

git tag $1