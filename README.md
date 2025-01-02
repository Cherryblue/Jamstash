# PROJECT DISCONTINUED
In november 2024 I finally decided to start from scratch using some more modern technologies (Jamstash was AngularJS-based).<br>
Here comes **[Noiser](https://github.com/Cherryblue/Noiser)**. *See you around.*

# JAMSTASH - Original Project
This here is a fork of the original project [which you can go see here](https://github.com/tsquillario/Jamstash).
This is a great project, and by no means do I want to remove any credit from the original(s) creator(s).

# This Fork Intentions
I've been using this software for a few years already, and multiple little bugs/views made my days more and more unbearable to me, until it forced me to take action :). I feel like it is already a big step in the right direction and would love to hear the original devs opinion.

## In short
1. Modernizing and improving the UI while staying true to the original spirit (at least for now :))
2. Correcting as many bugs as I can
3. Delivering a completely remodeled responsive/adaptive experience

## What is still missing, or a work-in-progress
- Updating existing test cases, as this colossal rework of the app surely did break a few tests.
- Proposing this as a enormous pull request for original project
- UI Adaptive bugfixes when necessary. Should be realy minor, but design/layout still needs a little more time to be completely polished.

## The big next steps/ideas
- Little JS widget to render current hours/minutes/seconds of the song/podcast/... played.
- Adapt initial navigation, which is pretty bad when you login/subscribe for the first time. (Feels like it's missing an "auto open artists and albums" instead of a global empty page)
- you name it.

## More details
### Modernizing and improving the GUI
- HTML/CSS has been **entirely** revised, replacing all FLOATING references into FLEXBOXES : saves time, space, size, and is more modern and responsive.
- Colors have been regrouped and harmonized around a few CSS variables. Less different colors and easier to change.
- A new dark theme, heavily based on the use of the new CSS Color Variables.
- Complete rewrite of icons in the app, by creating my own iconic font from scratch (using [Figma](https://figma.com) for svg vector drawing), all for this nice app. This replaces every image and icon that were used, greatly accelerates app loading time, and make it easier to color differently icons. The font source is on this repository, and [Figma icons designed are viewable here](https://www.figma.com/file/bBmAHzY5BvCi4mJ7Z34UMp/Jamstash-Mobile?node-id=10%3A2).
- Navigation reorganized : a lot of buttons have been moved to what felt like more logic positions. The ability for the user to show or remove any side of the UI (and in order to do that, the buttons which used space without being really necessary) has been completely removed. The sides are ajusted depending on breakpoints if necessary for optimizing space on screen. All in all, this limits the number of buttons for the user, which rised the complexity of the app for casuals :).
- Buttons designs were different overall in the application. This design has been harmonized, and moreover, the buttons near the player have been correctly rendered (as a square), which is more aesthetic.
- In Artists panel, now, Folders select html object only renders if there are... multiple folders.
- Sorting actions is now quicker when on desktop, as the different options are listed as different "buttons". However It's still the same as before on smaller screens to optimize space.
- Things from left side to right side have been aligned, for the eyes.

### Bugfixing
- Removed empty spaces between album covers (no "cursor changing" and "no selection" when moving from a side to the other).
- Clean seperation between albums and songs when a folder has both (no more first song sticked to the last album as a "buggy view/layout")
- Correctly rendering empty song or album string in notification pop-up (no more "&nbsp;", and no more "dash" if nothing before/after)

### New Responsive/Adaptive design
- Completely replaces old mobile view, from scratch. This is highly based on the change from floating layout to flexbox layout.
- Top to bottom approach using [Figma](https://figma.com), to adapt layout for mobile view. [Draft is viewable here](https://www.figma.com/file/bBmAHzY5BvCi4mJ7Z34UMp/Jamstash-Mobile?node-id=0%3A1).
- Multiple (I mean a lot) breakpoints in order to make the best intermediate views, and optimize space.
- New CSS/JS navigation system between left-list section and albums/songs section, to navigate on mobile screen.

**All of this responsive/adaptive design has been achieved without a different html page. Only CSS and JS have been modified to make this work, which means the same app renders both desktop and mobile views :)**
