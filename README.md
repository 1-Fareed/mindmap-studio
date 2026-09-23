# MindMap Studio

An interactive web-based Mind Mapping Studio built with React and TypeScript. It allows users to visually organize ideas using draggable nodes, dynamic connections, customizable node styles, zoom and pan controls, and browser-based project storage.

## Features

- Dashboard for viewing saved mind maps
- Create and reopen mind maps
- Add, edit, move and delete nodes
- Drag-and-drop node positioning
- Connect nodes using directional arrows
- Prevent duplicate and self-connections
- Customize node colors and shapes
- Zoom in, zoom out and reset canvas
- Pan around the workspace
- Undo and redo support
- Save projects using browser Local Storage
- Automatic cleanup of invalid saved connections
- Three starter templates
- Responsive and clean user interface

## Templates
### Study Planner
A visual structure for organizing study subjects, topics and tasks.


### SWOT Analysis
A template for organizing Strengths, Weaknesses, Opportunities and Threats.

### Brainstorming Map
A flexible starting point for generating and connecting ideas.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- SVG
- Lucide Icons
- Browser Local Storage
- Vite

## How It Works

The application uses an interactive canvas where ideas are represented as nodes. Nodes can be moved freely around the workspace and connected using directional SVG arrows.

Changes to nodes, positions, colors, shapes and connections are managed through application state. Mind maps are stored locally in the browser, allowing saved maps to be reopened and edited later.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

``` bash
git clone https://github.com/1-Fareed/mindmap-studio.git
cd mindmap-studio
```
Install dependencies:
```npm install```
Start the development server:
```npm run dev```
Open the local URL shown by Vite in your browser.
##Project Structure
```src/
├── components/
├── hooks/
├── lib/
├── routes/
└── router.tsx
public/
```
##Learning Outcomes
This project demonstrates:
- React component development
- TypeScript
- State management
- Drag and drop interactions
- Graph-based node relationships
- SVG connection rendering
- Zoom and pan functionality
- Browser Local Storage
- Responsive UI design
##Future Improvements
Possible future enhancements include:
- PNG and JSON export
- Dark mode
- Node search
- Multi-selection
- Additional connection styles
- Collaboration features
##Project
This project was developed as part of the ICT Academy Mind Mapping Studio assignment.
Built with React, TypeScript and Tailwind CSS. 
