# Jimy Houlbrook Portfolio website

## Project Scope
A mobile friendly PIXI application with a "galaxy map" that has "planets" resembling entries on the portfolio
A shader can be used in the background with a noise map to create a purple nebulous effect and shining stars

## Website flow
1. Enter
  Text appears character by character saying "welcome, traveler" before fading to the galaxy map
  Galaxy map will appear a flash and scale on Y to look as if its appearing on a computer screen

2. Idle
  Galaxy map will slowly rotate, but when drag left / right will rotate with drag

4. Entries
  Icons will appear throughout the map, these can be pressed and when they do will bring up an entry
  entry will be a modal with a picture of the planet, a header, and a brief description of the entry
  description should be able to have clickable links to take to relevant pages

## Code Structure
PIXI application
State manager that ensures a state is unloaded before moving to a new state
State manager will load new state before making it visible

## TODO
Make sure Entries cant spawn too close too eachother
Add CRT filter to galaxy & modals
Test mobile compatibility