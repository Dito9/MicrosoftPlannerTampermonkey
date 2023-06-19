// ==UserScript==
// @name        Planner Color Task by Due Date v1
// @description Set background color if waiting date is today in Microsoft Planner
// @author      @diego.garate
// @namespace   planner-background-color
// @match       https://tasks.office.com/*
// @version     2023.06.11
// ==/UserScript==

/* eslint-env browser, greasemonkey */
'use strict';

const taskBoardelector = ".taskBoardView"
const taskCardSelector = ".taskBoardCard";

const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0');
const formattedDate = `${day}.${month}`;
console.log(formattedDate);

function checkTeamsLoaded() {
  const teamsElement = document.querySelector(taskCardSelector); // Replace with the actual class or selector of an element that indicates Teams has loaded

  if (teamsElement) {
    // Teams has loaded, proceed with adding the button
      console.log('changeBackgroundToDueTask')
      changeBackgroundToDueTask();
      // Observe changes to the filter criteria
      const kanbanObserver = new MutationObserver(changeBackgroundToDueTask);
      const kanbanContainer = document.querySelector(taskBoardelector); // Replace '.filter-container-selector' with the actual selector for the filter container in Microsoft Planner
      kanbanObserver.observe(kanbanContainer, { attributes: true, childList: true, subtree: true });
  } else {
    // Teams hasn't loaded yet, wait and check again after a short delay
    console.log('waiting for div')
    setTimeout(checkTeamsLoaded, 100);
  }
}

function changeBackgroundToDueTask() {
    //look for all task
    const allTask = document.querySelectorAll(taskCardSelector);
    applyBackgroundColorsTo(allTask);
}

function applyBackgroundColorsTo(taskElements) {
  taskElements.forEach(taskElement => {
    const taskTitle = taskElement.querySelector('.title').textContent; // Replace '.task-title-selector' with the actual selector for the task title in the task element

    // Check the task title and apply background color based on conditions
    if ( taskTitle.includes(formattedDate)) {
      const taskContainer = taskElement.querySelector(".container")
      taskContainer.style.backgroundColor = 'red';
    }
  });
}

// Start checking for Teams loaded
checkTeamsLoaded();