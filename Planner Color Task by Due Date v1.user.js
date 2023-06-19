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

function extractDateFromTitle(str) {
    const regex = /(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})/;
    const match = str.match(regex);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // Month is zero-based in Date objects
      const year = match[3].length === 2 ? 2000 + parseInt(match[3], 10) : parseInt(match[3], 10);
      return new Date(year, month, day);
    }
    return null; // Return null if no date is found
}

function todayOrBefore(taskTitle){
    const titleDate = extractDateFromTitle(taskTitle);
    if (titleDate===null) return false;
    const today = new Date()

    if (titleDate<=today) return true;
    return false;
}

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
    console.log(allTask);
    applyBackgroundColorsTo(allTask);
}

function applyBackgroundColorsTo(taskElements) {
  taskElements.forEach(taskElement => {
    const taskTitle = taskElement.querySelector('.title').textContent; // Replace '.task-title-selector' with the actual selector for the task title in the task element

    // Check the task title and apply background color based on conditions
    if ( todayOrBefore(taskTitle)) {
      const taskContainer = taskElement.querySelector(".container")
      taskContainer.style.backgroundColor = 'red';
    }
  });
}

// Start checking for Teams loaded
checkTeamsLoaded();
