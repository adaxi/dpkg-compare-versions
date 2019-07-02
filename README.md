dpkg --compare-versions
=======================
Pure javascript implementation of the `dpkg --compare-versions` functionality.

This implementation is a port of the C implementation of [dpkg](https://git.dpkg.org/cgit/dpkg/dpkg.git/tree/lib/dpkg/version.c).
Supports epoch, version and revision.

Usage
-----

```js
const compare = require('dpkg-compare-versions');
compare('1.1.1', '1.0.1')     // returns 1
compare('1.0.0', '1.0.0')     // returns 0
compare('1.0.0~rc1', '1.0.0') // returns -1
compare('2:1.0.0', '1:2.0.0') // returns 1
```

You can also use this function to sort packages:

```js
const compare = require('dpkg-compare-versions')
const versions = [ '2.1', '1.2.2', '3-3' ]
versions.sort(compare) // versions = [ '1.2.2', '2.1', '3-3' ]
```

You can find more information about how sorting works in the [deb-version (5)](http://man7.org/linux/man-pages/man5/deb-version.5.html) manual page.

Tests
-----

Tests can be run by executing the command `npm test`. This will run [standard](https://standardjs.com/) and [jest](https://jestjs.io/).
The package has 100% coverage tests. This can be verified by running `npm run coverage`.

Contributions
-------------

Contributions are welcome, but are expected to pass the `npm test` command.
