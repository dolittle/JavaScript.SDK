#!/bin/bash

export VERSION=$(git tag --sort=-version:refname | head -1)

MAJOR_VERSION=$(echo $VERSION | sed 's/v*\([0-9]*\).*$/\1/g')
MINOR_VERSION=$(echo $VERSION | sed 's/v*[0-9]*.\([0-9]*\).*$/\1/g')
PATCH_VERSION=$(echo $VERSION | sed 's/v*[0-9]*.[0-9]*.\([0-9]*\).*$/\1/g')
PRE_RELEASE_TAG=$(echo $VERSION | sed 's/v*[0-9]*.[0.9]*.[0-9]-\([a-zA-Z]*\).*$/\1/g')
BUILD_VERSION=$(echo $VERSION | sed 's/v*[0-9]*.[0.9]*.[0-9]-[a-zA-Z]*.\([0-9]*\)/\1/g')

[[ $PRE_RELEASE_TAG == $BUILD_VERSION ]] &&
    PACKAGE_VERSION=$MAJOR_VERSION.$MINOR_VERSION.$PATCH_VERSION ||
    PACKAGE_VERSION=$MAJOR_VERSION.$MINOR_VERSION.$PATCH_VERSION-$PRE_RELEASE_TAG.$BUILD_VERSION

echo "Git Version : " $VERSION
echo "Major Version : " $MAJOR_VERSION
echo "Minor Version : " $MINOR_VERSION
echo "Patch Version : " $PATCH_VERSION
echo "Build Version : " $BUILD_VERSION
echo "Package Version : " $PACKAGE_VERSION

VERSION=

echo "Build $PACKAGE_VERSION"

yarn build

echo "Publishing $PACKAGE_VERSION"

for f in Source/*; do
    pushd $PWD > /dev/null
    cd $f
    echo "Publishing $f"
    yarn publish --new-version $PACKAGE_VERSION --no-git-tag-version
    popd > /dev/null
done

echo "Committing changed files"
git add .
git commit -m "Publishing version $PACKAGE_VERSION"
