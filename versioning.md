# Ahem Engineering Versioning Guide

This guide is to outline the method of versioning and the number scheme used by Ahem Engineering.

## Outline
The Ahem versioning system uses three numbers separated by periods. Of these numbers the first is the major release, the second is a minor release and third is the current build or patch.
An example version might be `2.4.1` where, from left to right;
1) **2** - The major release
2) **4** - The minor release
3) **1** - The build or patch version
Version numbers are always sequential (with respect to time), where the major is the most significant value, the minor is the second most significant value and the build is the lease significant value. Version numbers may exceed single digits.
- **3.1.7** is newer than **2.1.7**, and is older than **7.1.7**
- **2.6.2** is newer than **2.2.2**, and is older than **2.8.2**
- **7.2.4** is newer than **7.2.3**, and is older than **7.2.12**

## Major release
Major releases are significant changes to the programming base, and more often than not will change the user experience. In the case of a library, for example, this may change the interface causing user complilation breaking changes.

## Minor release
Minor releases should be invisible to the user, or expand on the current experience. In the case of a library, for example, a minor release will likely not be noticed by a user. All code base using the same major release should still compile as expected.

## Patch and build release
These releases are generally internally used for testing purposes, with the exception of **0** release, which should be the culmination of all the previous minor versions patches. On the release of a **0** patch, no further patch or build releases should be made for the previous minor release. If a previous minor release is to be continued to be maintained, it should be forked and renamed to ensure it can be differentiated from the original codebase.
