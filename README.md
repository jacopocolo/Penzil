# Penzil

Penzil is a web application for sketching in 3d, powered by three.js and Vue. 

This project is a work in progress and an almost complete re-write of the [grease](https://github.com/jacopocolo/grease) experimental repository.

Todo:

- [ ] Undo-redo
    - [x] Draw
    - [x] Erase
    - [x] Select
    - [x] Deselect
    - [x] Transform single and group
    - [ ] Mirror elements
    - [ ] Duplicate (still has a bug when reselecting)
    - [x] Selected tool
- [ ] Small parser for displaying updates (see: https://www.w3schools.com/xml/xml_parser.asp)
- [x] Eraser
- [ ] Two finger camera controls: rotate and zoom
- [ ] Draw preferences UI: width, color, mirror
- [ ] Export to video
- [ ] Export geometry
- [ ] Save
- [ ] Save in local storage
- [ ] Load
- [ ] Drawing plane
- [ ] CSS and styling


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
