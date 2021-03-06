# Penzil

Penzil is a web application for sketching in 3d, powered by three.js and Vue. 

This project is a work in progress and an almost complete re-write of the [grease](https://github.com/jacopocolo/grease) experimental repository.

Todo:

- [ ] Draw
    - [X] Transition Geometry to BufferGeometry. [See this](https://stackoverflow.com/questions/41177425/
    three-js-dynamically-add-points-to-a-points-geometry-does-not-render) and [this thread](https://discourse.threejs.org/t/three-geometry-will-be-removed-from-core-with-r125/22401/5).
    - [ ] Line width
    - [ ] Line color
    - [ ] Line mirror
- [ ] Undo-redo
    - [x] Draw
    - [x] Erase
    - [x] Select
    - [x] Deselect
    - [x] Transform single and group
    - [x] Duplicate
    - [x] Selected tool
    - [x] Display state in the UI
    - [x] Display trasformToolbar appropriately
    - [ ] Two tap to undo
    - [ ] Visual notifications
    - [ ] Mirror elements
- [ ] Cancel event for Line, Erase, Select
- [ ] Small parser for displaying updates (see: https://www.w3schools.com/xml/xml_parser.asp)
- [x] Eraser
- [ ] Two finger camera controls: rotate and zoom
- [ ] Export to video
- [ ] Export geometry
- [ ] Save
- [ ] Save in local storage
- [ ] Load
- [ ] Drawing plane
- [ ] CSS and styling

Notable bugs:
- [ ] Clean up ghost strokes (may be solved by cancel events)
- [ ] Adjust visibility of transformToolbar when undoing/redoing

## Project setup

You can download and test the project locally by using Yarn. 

```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```
