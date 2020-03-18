![logo](https://raw.githubusercontent.com/yafp/dirgistered/master/.github/images/logo/128x128.png)


# dirgistered
## Contributing

---

### general
When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

### jsdocs
The current jsdoc documentation can be found on [https://yafp.github.io/dirgistered/](https://yafp.github.io/dirgistered/).
It is auto-generated on each commit.

### CI
The project repository is using:

* [Travis CI](https://travis-ci.org/) (for Linux and macOS)

for Continuos Integration aspects.

### Building dirgistered
Build instructions can be found [here](BUILD.md).

### Sentry (Crashreports)
Crashreport informations are located [here](https://sentry.io/organizations/yafp/issues/?project=1847606).
More informations about **dirgistered** sentry usage are located [here](SENTRY.md).

---

### Getting started

#### 1. First steps

##### Clone repo
* Clone the repository: ```git clone https://github.com/yafp/dirgistered```

##### Install dependencies
* Go into the repository: ```cd dirgistered```
* Install dependencies: ```npm install```

##### Run the code
* Execute: ```npm start```

##### Run the code with debug logging
* Execute ```npm run start-debug```

##### Run some basic test
* Execute: ```npm test```

---

#### 2. Misc howto's

##### Auditing

###### npm auditing (scan for vulnerabilities)
* ```npm audit```


##### Outdated packages

###### check for outdated npm packages
* ```npm outdated```

or using ```npm-check```:

* Install requirements: ```npm install -g npm-check```
* Run check: ```npm-check``` or 
* Run check: ```npm-check -s```



##### Updating

###### check dependencies
* Install requirements: ```npm install depcheck```
* Run check: ```depcheck```

###### update all packages
* ```npm update```


##### Others
###### List all package.json scripts
* ```npm run```

or a dynamic solution

* Install requirements: ```npm i -g ntl```
* Execute ```ntl```
