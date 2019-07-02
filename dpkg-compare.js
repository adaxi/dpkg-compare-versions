'use strict'

/** Compares two Debian versions.
 *
 * Based on https://git.dpkg.org/cgit/dpkg/dpkg.git/tree/lib/dpkg/version.c#n140
 *
 * @param {string} v1 - The first version.
 * @param {string} v2 - The second version.
 *
 * @return 0 If v1 and v2 are equal.
 * @return > 0 If v1 is greater than v2.
 * @return < 0 If v1 is smaller than v2.
 */
module.exports = (v1, v2) => {
  const a = parseVersion(v1)
  const b = parseVersion(v2)
  return a.compareTo(b)
}

class Version {
  compareTo (other) {
    if (this.epoch > other.epoch) {
      return 1
    }
    if (this.epoch < other.epoch) {
      return -1
    }
    const versionCompare = compareVersion(this.version, other.version)
    if (versionCompare) {
      return versionCompare
    }
    return compareVersion(this.revision, other.revision)
  }
}

function parseVersion (string) {
  if (typeof string !== 'string' || !string) {
    throw new Error('version string is empty')
  }

  const version = new Version()

  string = string.trim()
  const colon = string.indexOf(':')
  if (colon >= 0) {
    if (colon === 0) {
      throw new Error('epoch in version is empty')
    }
    const epoch = parseInt(string.split(':')[0])
    if (isNaN(epoch)) {
      throw new Error('epoch in version is not a number')
    }
    if (epoch < 0) {
      throw new Error('epoch in version is negative')
    }
    if (epoch > Number.MAX_SAFE_INTEGER) {
      throw new Error('epoch in version is too big')
    }
    if ((colon + 1) === string.length) {
      throw new Error('nothing after colon in version number')
    }
    version.epoch = epoch
  } else {
    version.epoch = 0
  }

  const vstring = string.substring(colon + 1)
  const hyphen = vstring.lastIndexOf('-')
  if (hyphen >= 0) {
    version.version = vstring.substring(0, hyphen)
    version.revision = vstring.substring(hyphen + 1)
    if (version.revision.length === 0) {
      throw new Error('revision number is empty')
    }
  } else {
    version.version = string
    version.revision = ''
  }

  if (version.version.length === 0) {
    throw new Error('version number is empty')
  }
  if (!isDigit(version.version[0])) {
    throw new Error('version number does not start with digit' + version.version[0])
  }
  if (!version.version.match(/^[0-9a-zA-Z.+~:-]+$/)) {
    throw new Error('invalid character in version number')
  }

  if (!version.revision.match(/^[0-9a-zA-Z.+~]*$/)) {
    throw new Error('invalid character in revision number')
  }
  return version
}

function isDigit (c) {
  return typeof c === 'string' && c >= '0' && c <= '9'
}

function isAlpha (c) {
  return typeof c === 'string' && ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))
}

function order (c) {
  if (isAlpha(c)) {
    return c.charCodeAt(0)
  } else if (c === '~') {
    return -1
  } else if (c) {
    return c + 256
  } else {
    return 0
  }
}

function compareVersion (a, b) {
  let pA = 0
  let pB = 0
  while (a[pA] || b[pB]) {
    let firstDiff = 0
    while ((a[pA] && !isDigit(a[pA])) || (b[pB] && !isDigit(b[pB]))) {
      const ac = order(a[pA])
      const bc = order(b[pB])

      if (ac !== bc) {
        return ac - bc
      }
      pA++
      pB++
    }
    while (a[pA] === '0') {
      pA++
    }
    while (b[pB] === '0') {
      pB++
    }
    while (isDigit(a[pA]) && isDigit(b[pB])) {
      if (!firstDiff) {
        firstDiff = a.charCodeAt(pA) - b.charCodeAt(pB)
      }
      pA++
      pB++
    }
    if (isDigit(a[pA])) {
      return 1
    }
    if (isDigit(b[pB])) {
      return -1
    }
    if (firstDiff) {
      return firstDiff
    }
  }
  return 0
}
