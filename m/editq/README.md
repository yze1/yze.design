# Project Brief

## Overview

This project is a front-end UI/design redesign for a two-page web app.

The existing project is a page editor with chatbot support. For this first stage, the work is limited to visual design and clean HTML/CSS structure only. No backend development or JavaScript functionality is required at this stage.

The final HTML/CSS will be integrated into the existing project by the client.

## Project Purpose

The app allows users to manage and edit pages, with support from a chatbot assistant.

The chatbot is intended to help users fill page content, reorganise pages, improve written content, and support future features such as report editing.

The goal of the redesign is to make the interface more professional, intuitive, modern, and easy to understand.

## Required Pages

The project includes two pages:

### 1. Login Page

A clean and professional login page for users to access the app.

The login page should feel modern, credible, and simple to use.

### 2. Homepage / App Page

The homepage is the main working interface of the app.

It should include three main areas:

#### Left Sidebar

The left sidebar is used to manage pages.

The user should be able to understand that pages can be selected, reordered, deleted, and managed from this area.

At this stage, the sidebar only needs to be designed visually. Functional drag-and-drop, deletion, and page management logic are not required.

#### Central Editor Area

The central area is where the selected page content is edited.

The design should support the idea of an Editor.js-style content editor, with a clean writing area and a clear page structure.

At this stage, the editor only needs to be represented visually. Editor.js functionality is not required.

#### Right Chatbot Panel

The right panel contains the chatbot assistant.

The chatbot helps users generate content, improve page structure, fill empty sections, and reorganise pages.

At this stage, the chatbot only needs to be designed visually. Real chatbot integration is not required.

## Design Direction

The interface should be:

- Professional
- Intuitive
- Modern
- Easy to understand
- Easy to use
- Clean and well structured

The client has mentioned ChatGPT and Notion as design references, but is also open to original ideas.

The design should take inspiration from these tools without directly copying them.

## Colour Scheme

The client has not provided a fixed colour scheme.

Part of the design work should include proposing suitable colour choices.

The colour system should be placed clearly in the CSS using reusable variables.

Example structure:

```css
:root {
  --color-bg: #f7f7f5;
  --color-surface: #ffffff;
  --color-border: #e2e2df;
  --color-text: #1f1f1f;
  --color-muted: #777777;
  --color-accent: #2563eb;
}
```

## Proposed Workflow

### Stage 1: Design Concepts

Create 2 or 3 initial design proposals or mockups.

These proposals should include:

- Login page layout
- Main app page layout
- Colour choices
- General visual direction
- UI structure
- Basic component styling

The concepts can be simple visual proposals, sketches, or mockups.

The client will review the proposals and choose one direction.

### Stage 2: HTML/CSS Build

After the client validates one design direction, convert the selected design into clean static HTML and CSS.

Expected deliverables may include:

- `login.html`
- `index.html` or `app.html`
- `style.css`

The code should be clean, organised, and suitable for integration into the existing project.

## Included in Scope

This first stage includes:

- UI design for 2 pages
- 2 or 3 design proposals/mockups
- Login page visual design
- Main app page visual design
- Page-management sidebar design
- Central editor area design
- Chatbot panel design
- Colour system proposal
- Static HTML structure
- CSS styling
- Clean front-end files for client integration

## Not Included in Scope

The following items are not included unless agreed separately:

- Backend development
- Login authentication
- Database setup
- Page storage
- JavaScript functionality
- Editor.js setup
- Drag-and-drop functionality
- Page deletion functionality
- Real chatbot integration
- API connection
- Report editor functionality
- Deployment or hosting
- Advanced responsive behaviour beyond static layout requirements

## Summary

The project is a static front-end redesign for a two-page page-editor web app.

The main objective is to create a professional, intuitive, and modern interface that helps users understand how to manage pages, edit content, and use chatbot assistance.

The first deliverable should be 2 or 3 visual design directions. Once one direction is approved, the final deliverable should be clean HTML and CSS files ready for the client to integrate into the existing project.
