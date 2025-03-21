document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("search-input");
  const placeholderText = document.getElementById("placeholder-text");
  const text = "Entrez un nom ou un ID de Pokemon";
  let index = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  let deleteSpeed = 50;
  let pauseTime = 2000;

  // Create pikachu element
  const pikachu = document.createElement("div");
  pikachu.id = "typing-pikachu";
  document.querySelector(".search-container").appendChild(pikachu);

  function typeWriter() {
    if (!isDeleting && index <= text.length) {
      typeText();
    } else if (isDeleting && index > 0) {
      deleteText();
    } else if (isDeleting && index === 0) {
      resetCycle();
    }
  }

  function typeText() {
    // update placeholder text
    placeholderText.textContent = text.substring(0, index);

    // Place Pikachu after the last typed character
    if (index > 0) {
      // Calculate the actual text length to place Pikachu
      const textWidth = placeholderText.offsetWidth;
      pikachu.style.left = `${textWidth + 20}px`; // 20px offset to place Pikachu after the placeholder text
      pikachu.style.display = "block";
      pikachu.classList.add("typing");
    } else {
      pikachu.style.display = "none";
    }

    if (index < text.length) {
      // should type
      if (input.value === "") {
        index++;
        setTimeout(typeWriter, typingSpeed);
      }
    } else {
      // Pause before deleting
      setTimeout(() => {
        isDeleting = true;
        typeWriter();
      }, pauseTime);
    }
  }

  function deleteText() {
    // Update text while deleting
    index--;
    placeholderText.textContent = text.substring(0, index);

    // Position Pikachu
    if (index > 0) {
      // Pikachu should be placed right after the last character
      const textWidth = placeholderText.offsetWidth;
      pikachu.style.left = `${textWidth + 20}px`;
      pikachu.style.display = "block";
      pikachu.classList.add("erasing");
    } else {
      pikachu.style.display = "none";
      pikachu.classList.remove("erasing");
    }

    setTimeout(typeWriter, deleteSpeed);
  }

  function resetCycle() {
    // Restart the cycle
    placeholderText.textContent = "";
    pikachu.style.display = "none";
    pikachu.classList.remove("typing", "erasing");
    isDeleting = false;
    setTimeout(typeWriter, typingSpeed);
  }

  typeWriter();
  // Mask the placeholder text when focusing the input
  input.addEventListener("focus", function () {
    placeholderText.style.display = "none";
    pikachu.style.display = "none";
  });

  // Redo the placeholder and animation if input is empty on blur
  input.addEventListener("blur", function () {
    if (input.value === "") {
      placeholderText.style.display = "block";
      // Animate again
      index = 0;
      isDeleting = false;
      typeWriter();
    }
  });

  // Mask Pikachu and placeholder text when user start typing
  input.addEventListener("input", function () {
    if (input.value !== "") {
      pikachu.style.display = "none";
      placeholderText.style.display = "none";
    } else {
      index = 0;
      placeholderText.style.display = "block";
      typeWriter();
    }
  });
});
