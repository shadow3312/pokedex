document.addEventListener("DOMContentLoaded", function () {
  // #region PLACEHOLDER ANIMATION

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

  // #endregion

  // #region POKEMON SEARCH
  const searchContainer = document.querySelector(".search-container");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const infoContainer = document.getElementById("info-container");

  // Types to color mapping
  const typeColors = {
    normal: "normal",
    fire: "fire",
    water: "water",
    electric: "electric",
    grass: "grass",
    ice: "ice",
    fighting: "fighting",
    poison: "poison",
    ground: "ground",
    flying: "flying",
    psychic: "psychic",
    bug: "bug",
    rock: "rock",
    ghost: "ghost",
    dragon: "dragon",
    dark: "dark",
    steel: "steel",
    fairy: "fairy",
  };

  searchButton.addEventListener("click", () => {
    searchPokemon(searchInput.value.trim().toLowerCase());
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchPokemon(searchInput.value.trim().toLowerCase());
    }
  });

  // Focus input when clicking in the search container
  searchContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("search-container")) {
      searchInput.focus();
    }
  });

  async function searchPokemon(searchTerm) {
    if (searchTerm === "") {
      return;
    }

    try {
      let pokemonData;
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
      );

      if (!response.ok) {
        console.log("err", searchTerm);
        throw new Error("Pokémon not found");
      }

      pokemonData = await response.json();

      displayPokemonData(pokemonData);

      // Animate the container
      infoContainer.classList.remove("hidden");

      setTimeout(() => {
        infoContainer.classList.add("visible");
      }, 10);
    } catch (error) {
      alert(error);
      infoContainer.classList.remove("visible");

      setTimeout(() => {
        infoContainer.classList.add("hidden");
      }, 500);
    }
  }

  function displayPokemonData(pokemon) {
    // Header Info
    const pokemonName = document.getElementById("pokemon-name");
    const pokemonId = document.getElementById("pokemon-id");
    const pokemonWeight = document.getElementById("weight");
    const pokemonHeight = document.getElementById("height");

    pokemonName.textContent = pokemon.name;
    pokemonId.textContent = `#${pokemon.id}`;
    pokemonWeight.textContent = `${(pokemon.weight / 10).toFixed(1)} kg`;
    pokemonHeight.textContent = `${(pokemon.height / 10).toFixed(1)} m`;

    // Pic
    const picElement = document.getElementById("pic");
    picElement.src = pokemon.sprites.front_default;
    picElement.alt = pokemon.name;

    // Types
    const typesElement = document.getElementById("types");
    typesElement.innerHTML = ""; // Clear previous
    pokemon.types.forEach((typeInfo) => {
      const typeElement = document.createElement("span");
      typeElement.classList.add("type-tag");

      // Add type-specific color class
      const typeName = typeInfo.type.name.toLowerCase();
      if (typeColors[typeName]) {
        typeElement.classList.add(typeColors[typeName]);
      }

      typeElement.textContent = typeInfo.type.name.toUpperCase();
      typesElement.appendChild(typeElement);
    });

    // Display stats with animated bars
    const stats = {
      hp: "hp",
      attack: "attack",
      defense: "defense",
      "special-attack": "special-attack",
      "special-defense": "special-defense",
      speed: "speed",
    };

    // Reset all stat bars
    Object.values(stats).forEach((statId) => {
      document.getElementById(`${statId}-bar`).style.width = "0%";
    });

    // Set stat values and animate bars
    setTimeout(() => {
      pokemon.stats.forEach((stat) => {
        const statName = stat.stat.name;
        if (stats[statName]) {
          const statValue = stat.base_stat;
          document.getElementById(stats[statName]).textContent = statValue;

          // Animate the stat bar (max stat value is typically 255, so we scale accordingly)
          const percentage = Math.min(100, (statValue / 255) * 100);
          document.getElementById(
            `${stats[statName]}-bar`
          ).style.width = `${percentage}%`;
        }
      });
    }, 100);

    // Change card header background based on primary type
    if (pokemon.types && pokemon.types.length > 0) {
      const primaryType = pokemon.types[0].type.name.toLowerCase();
      const cardHeader = document.querySelector(".card-header");

      if (typeColors[primaryType]) {
        const typeColorClass = typeColors[primaryType];
        const element = document.createElement("div");
        element.classList.add(typeColorClass);
        document.body.appendChild(element);
        const color = getComputedStyle(element).backgroundColor;
        document.body.removeChild(element);

        // Apply a gradient with the type color
        const rgbValues = color.match(/\d+/g);
        const darkenedColor = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0.8)`;
        const evenDarkerColor = `rgba(${Math.max(
          0,
          rgbValues[0] * 0.6
        )}, ${Math.max(0, rgbValues[1] * 0.6)}, ${Math.max(
          0,
          rgbValues[2] * 0.6
        )}, 0.9)`;

        cardHeader.style.background = `linear-gradient(135deg, ${darkenedColor}, ${evenDarkerColor})`;

        // Also adjust the background pulse to match the Pokemon type
        const backgroundPulse = document.querySelector(".background-pulse");
        backgroundPulse.style.background = `radial-gradient(circle at center, ${darkenedColor} 0%, transparent 70%)`;
      }
    }
  }

  // #endregion
});
