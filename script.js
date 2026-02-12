const frameDisplayText = document.getElementById('frame-display-text');
const btnRefreshGreeting = document.getElementById('btn-refresh-greeting');

const display = document.getElementById("display_text");
const dropdownContainer = document.getElementById("dropdowns");
const book1 = document.getElementById('book_grammar');
const titleEl = document.getElementById("label_title");
const savedEl = document.getElementById("saved_text");
const button_messages = document.getElementById("btn_messages");

let christmas = false;
let newYear = false;
let seollal = false;

const greetings = ["Hi", "Hello", "Good day"];
let greeting = "";
const goodGreetings = ["morning", "afternoon", "evening"];
let salutation = "";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `!(${year}-${month}-${day})`;

function getGreeting() {
  let salutationIndex = Math.floor(Math.random() * greetings.length);
  salutation = greetings[salutationIndex];
  if (salutation === "Good day") {
    const hours = today.getHours();
    const good = "Good";
    let timeOfDay = "";
    if (hours < 12){
      timeOfDay = goodGreetings[0];
    } else if (hours < 19) {
      timeOfDay = goodGreetings[1]; 
    } else {
      timeOfDay = goodGreetings[2];
    }
    greeting = `${formattedDate} \n\tGood ${timeOfDay} \n\t\n\t\n\t\n\tTeacher Steve`;
  } else {
    greeting = `${formattedDate} \n\t${salutation} \n\t\n\t\n\t\n\tTeacher Steve`;
  };
  display_greeting.innerHTML = greeting; 
  
  
  const copyText = document.getElementById("display_greeting").innerText;
  navigator.clipboard.writeText(copyText).then(() => {
  }).catch(err => {
    alert("Failed to copy text: " + err);
  });
  //alert(copyText)
  
};

const selectGreeting = document.getElementById('select-greeting');

function populateGreetingDropdown() {
  selectGreeting.replaceChildren(); // Clear everything safely

  // Create default option
  // new Option("text", "value", defautSelected, selected)
  const defaultOption = new Option("Choose greeting", "", true, true);
  defaultOption.disabled = true;
  selectGreeting.appendChild(defaultOption);

  // Make a sorted copy (doesn't mutate original array)
  const sortedGreetings = [...seasonal_greetings].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Add seasonal greetings
  sortedGreetings.forEach(season => {
    const opt = new Option(season.name, season.name);
    selectGreeting.appendChild(opt);
  });
}

selectGreeting.addEventListener('change', (event) => {
  //const selectedName = event.target.value;
  const seasonData = seasonal_greetings.find(entry => entry.name === event.target.value);
  const greeting = `${formattedDate} \n\t${seasonData.greeting1}\n\t\n\t\n\t\n\t${seasonData.greeting2}\n\t${seasonData.greeting3}`
  display_greeting.innerHTML = greeting;
  
  const copyText = document.getElementById("display_greeting").innerText;
  navigator.clipboard.writeText(copyText).then(() => {
  }).catch(err => {
    alert("Failed to copy text: " + err);
  });

  // Reset after everything is done
  event.target.selectedIndex = 0;
});

function getDropDownMenus() {
  for (const category in allCategories) {
    const dict = allCategories[category];
    // Create label
    const label = document.createElement("label");
    

    // Create dropdown
    const dropdown = document.createElement("select");
    dropdown.id = `${category}_dropdown`;

    // Default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = `${category}`;
    dropdown.appendChild(defaultOption);

    // Populate options
    for (const key in dict) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = key;
      dropdown.appendChild(option);
    }

    // Add to DOM
    dropdownContainer.appendChild(label);
    dropdownContainer.appendChild(dropdown);
    dropdownContainer.appendChild(document.createElement("br"));

    // Attach event
    dropdown.addEventListener("change", function () {
      const selectedKey = dropdown.value;
      if (selectedKey in dict) {
        display.innerText = dict[selectedKey];
        copy_to_clip();
        const myElement = document.getElementById("label_title");
        myElement.classList.remove("glide-text");
        myElement.classList.add("glide-out-right");
      } else {
        display.innerText = "";
      }
      dropdown.selectedIndex = 0;
    });
  }
};


function copy_to_clip() {
  const copyText = document.getElementById("display_text").innerText;
  navigator.clipboard.writeText(copyText).then(() => {
  }).catch(err => {
    alert("Failed to copy text: " + err);
  });
}



function animateSavedCycle() {
  const titleEl = document.getElementById("label_title");
  const savedEl = document.getElementById("saved_text");

  // Reset
  titleEl.className = "";
  savedEl.className = "";

  titleEl.classList.add("fly-out-right");

  // ⭐ Kick off Saved's fly-in immediately (overlap with title out)
  setTimeout(() => {
    savedEl.classList.add("saved-in-left");
  }, 0);

  // When Saved finishes flying in
  savedEl.addEventListener("animationend", () => {
    setTimeout(() => {
      savedEl.classList.add("saved-out-left");

      // ⭐ Kick off Title's return *just before* Saved is fully gone
      setTimeout(() => {
        titleEl.classList.add("title-in-right");
      }, 0); // tweak overlap timing (ms) → smaller = earlier return

    }, 1000);
  }, { once: true });
}


document.body.addEventListener("change", (e) => {
  if (e.target.tagName === "SELECT") {
    animateSavedCycle();
  }
});


// LISTENERS:

document.getElementById("btn_messages").addEventListener("click", function() {
  window.open("http://admin.et-phone.co.kr/tutor/qa/All_List.html", "_blank");
});

document.getElementById("btn_reports").addEventListener("click", function() {
  window.open("http://admin.et-phone.co.kr/tutor/monthly/report.html", "_blank");
});

btnRefreshGreeting.addEventListener('click', () => {
  christmas = false;
  newYear = false;
  getGreeting();
});



function getMicTestPrompt() {
  const d = new Date();
  
  const formattedDate = d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return `Good afternoon,
  <br>This is Steve.
  <br>It's ${formattedDate}.
  <br>Microphone Test 1 2 3 4.`
}

const displayMicTestPrompt = document.querySelector('#display-mic-test-prompt');
const btnMicTestPrompt = document.querySelector('#btn-mic-test-prompt');

btnMicTestPrompt.addEventListener('click', () => {
  const mic_test_prompt = getMicTestPrompt();

  const popupFrame = document.createElement('div');
  popupFrame.classList.add('popupFrame');
  popupFrame.innerHTML = mic_test_prompt;

  const buttonClose = document.createElement('button');
  buttonClose.textContent = "Close";
  buttonClose.classList.add('button-red');

  const lineBreak = document.createElement('br');

  popupFrame.appendChild(lineBreak);
  popupFrame.appendChild(buttonClose);

  displayMicTestPrompt.appendChild(popupFrame);
  
  btnMicTestPrompt.classList.add('hide-me');

  buttonClose.addEventListener('click', () => {
    if (popupFrame) {
    popupFrame.remove();
    btnMicTestPrompt.classList.remove('hide-me');
  }
  })
  
});

getGreeting();
populateGreetingDropdown();
getDropDownMenus();