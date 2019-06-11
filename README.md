# Quartz Hardware

Headless Raspberry Pi implementation of Quartz Audio

## Installation
Clone this repo into a folder on your rPi
run:
```
chmod 755 ./install.sh
./install.sh

Edit the "Keyboard_Input/config.json" and the "Sound_Player/config.json" files
set the clientId to something that will help you recognize what it is in Thorium
```

## Running

First, start up [Thorium Server](https://thoriumsim.com).

Then, start up this client:

```
./run.sh
```

## Known Issues
* It will typically throw an error if the system is started up for the first time with a
new client name change.  Behavior with this error is unknown.  To fix it, simply assign
the client to a new simulator, and restart it.  It should start working properly
without any errors.
* Changing the "Use SFX" or "Use Ambience" in the configuration requires a restarting of
the program.  These settings are only read once at startup.

