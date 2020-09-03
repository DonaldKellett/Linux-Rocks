# Linux-Rocks

Proof of concept voting app. Vote for your favorite Linux distribution!
 
## System Requirements

A Linux host. If you are using Windows/macOS, you should be able to run the Docker containers using Docker Desktop, but I would personally recommend installing Alpine Linux (or a Linux distribution of your choice) on a virtual machine using a hypervisor of your choice (e.g. VirtualBox) and running the Docker containers there instead.

## Running the app

First make sure Docker is installed on your Linux host:

```bash
$ sudo apt install docker     # on Debian-based distributions
$ sudo yum install docker     # on older Fedora-based distributions
$ sudo dnf install docker     # on newer Fedora-based distributions
$ sudo zypper install docker  # on SUSE-based distributions
$ sudo apk add docker         # on Alpine Linux
```

And make sure the Docker daemon is up and running:

```bash
$ sudo systemctl start docker  # With systemd
$ sudo service docker start    # With SysVInit/OpenRCInit
```

Now `cd` to the root directory of this repo and run the launch script:

```bash
$ ./launch.sh
```

The script will prompt for your `sudo` password when required.

Once the launch script finishes execution, point your Web browser to the address of your Linux host and enjoy the app! _Hint: you can find the IP address of your Linux host by executing `ip addr show` on the command line._

When you're done playing with the app, simply run the cleanup script and you're done:

```bash
$ ./cleanup.sh
```

## Technologies involved

- Linux
  - Development environment: [Alpine Linux](https://alpinelinux.org/) 3.12.0
- Docker
  - Webserver container: Alpine Linux 3.12.0
  - MariaDB container: [Ubuntu](https://ubuntu.com/) 20.04.1 LTS
  - Mailserver container: [Debian](https://www.debian.org/) GNU/Linux 9
- Node.js - major libraries include:
  - [Express](https://expressjs.com/)
  - [EJS](https://ejs.co/)
  - [MariaDB](https://www.npmjs.com/package/mariadb)
  - [Nodemailer](https://nodemailer.com/about/)
- SQL - MariaDB

## Features

- One vote per email address
- Graceful handling of most user errors (e.g. invalid email address)
- One-Time Password (OTP) authentication during voting to prevent voting fraud
- Proper hashing of OTP with SHA512 - vote impersonation by hackers should be infeasible despite data breach
- Decoupling of individual votes from overall voting statistics - privacy-preserving(?)

## Shortcomings

- Registered email addresses stored as plaintext in database: possible privacy issue in case of data breach?
- Votes still susceptible to manipulation through multiple email addresses from one person
- Minimal/non-existent error handling for server-side errors (e.g. failed SQL query)
- No dedicated 404 page (or 403/500/... page): users greeted with unwelcoming message `Cannot GET /nonexistent/path` instead
- No salt for OTP hash; but then, OTP is auto-generated and not chosen by user so probably a non-issue anyway
- Lack of differential privacy in displaying voting results page implies inference attack may still be possible(?)
- Email-sending setup does not use SMTP smart host: emails are delivered with unacceptable delay and often recognized by major email providers as spam
- Main webserver container cannot function independently of mailserver/database containers - requires customized shell script for coordinating networking between containers after they have been started
- UI for results page could be better - maybe use a table with the logos for each Linux distribution instead of just a plain list with percentages

## Docker Image

A Docker image for the webserver is available at https://hub.docker.com/r/donaldsebleung/linux-rocks

## License

The contents of this repo are licensed under [GPLv3](./LICENSE), with the UI frontend taken from [Landed by HTML5 UP](https://html5up.net/landed) licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0).
