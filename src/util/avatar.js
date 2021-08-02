const robohashAvatars = require('robohash-avatars')
const _ = require('lodash')
const backgroundSets = Object.values(robohashAvatars.BackgroundSets)
const characterSets = Object.values(robohashAvatars.CharacterSets)

function getRandomBackground() {
    const randomIndex = _.random(0, backgroundSets.length - 1)
    return backgroundSets[randomIndex]
}

function getRandomCharacterSet() {
    const randomIndex = _.random(0, characterSets.length - 1)
    return characterSets[randomIndex]
}

/**
 * @param {string} username
 * @return {string}
 */
function getRandomAvatar(username) {
    return robohashAvatars.generateAvatar({
        username: username,
        background: getRandomBackground(),
        characters: getRandomCharacterSet(),
        height: 48,
        width: 48
    })
}

module.exports = getRandomAvatar