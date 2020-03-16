![logo](https://raw.githubusercontent.com/yafp/dirgistered/master/.github/images/logo/128x128.png)

# media-dupes

## General
**dirgistered** is using [Sentry](https://sentry.io/for/javascript/) by default to:

* track errors

This page tries to explain as detailed as possible what is tracked and why.

**Please keep in mind:** *Error reporting* can be disabled in the application settings at any time.

## Use cases
### Error reporting
*Error reporting* heavily helps finding bugs in the source code. Right now **dirgistered** is developed only by a single person on a single linux computer. I am not able to run **dirgistered** on Windows or MacOS myself and even on Linux i will never cause and find all bugs myself. Error reports allow me to see what errors happen on might give me a starting point to try to fix them.


## Data
### What data is stored?
Whenever an *error* actions is triggered sentry gets informations about

* ```browser.name```
* ```chrome```
* ```chrome.name```
* ```device.family```
* ```environment```
* ```event_type```
* ```level```
* ```node```
* ```node.name```
* ```os_name```
* ```release```
* ```runtime```
* ```runtime.name```

The following screenshot shows those informations: 

![logo](https://raw.githubusercontent.com/yafp/dirgistered/master/.github/images/sentry/sentry_01.png)

### What data is not stored?

* no ip addresses

## Questions
Still got questions - feel free to contact me.
