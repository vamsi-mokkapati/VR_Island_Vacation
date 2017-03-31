# Virtual Reality Island Vacation
### By Vamsi Mokkapati, Anbo Wei, and Sabrina Chiang

## Experience it Yourself!

The following links go to a web server, where the code is being hosted. 

### Laptop Version

Click [here](192.241.227.179:9000/html/laptop.html) on your laptop/desktop to run the simulator.

The goal of this experience is to enjoy the island. Here are things you can do:
- walk around the island using the W, A, S, and D keys
- run by holding the Shift key while walking
- Find the meme cubes scattered around the island to hear some wise words from some of our computer science professors at UCLA.
- Immerse yourself in the sounds of the ocean and enjoy the view!

### Phone Version

Click [here](192.241.227.179:9000/html/phone.html) on your phone to run the simulator.

To enable the user to look around the island, we used the gyroscope 
functionality found in most mobile devices. Simply move your phone around,
up and down, and/or side to side to look all around the island, while 
walking using your laptop/desktop. 

For the island to be enjoyed in 3D on a VR Headset, we enabled a split screen
display for each eye, with each half of the screen having a slight offset from
the center (binocular disparity) to help the brain create a stereoscopic image
and perceive depth for 3D vision.

## What This Project Is

This repository is the list of all files needed in order to run both the phone and desktop version
of this VR Island simulator. It works off of a Node.js server used to serve static files. Most of
the code runs on the front end.

## How To Run the Project

To run this, first install Node. This repository does not contain required dependencies, so installing
Node is necessary.

Unpack the repository wherever you want to be and travel to the folder containing this readme. 
Type in the following commands:

npm install
node main.js

Assuming all dependencies are installed correctly (if not, you can install them manually by
typing "npm install [missing package]", where the missing package should be given to you),
the code can then be run. In order to actually run the code, you need to pull up the websites
on both your laptop or desktop and your phone (at /html/laptop.html and /html/phone.html 
respectively). These will both attempt to call home and send locational and directional data
respectively. Both are necessary for proper interaction. 

While this is occurring, you should be able to see a bunch of json objects printed out in the
console representing the data being sent from both sides of the front end. What these represent
are fairly self-evident. 

To close the server, simply press Ctrl + C. 