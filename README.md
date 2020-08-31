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

## License

The contents of this repo are licensed under [GPLv3](./LICENSE), with the UI frontend taken from [Landed by HTML5UP](https://html5up.net/landed) licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0).
