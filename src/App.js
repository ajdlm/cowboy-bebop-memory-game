import React, { Component } from "react";
import Wrapper from "./components/Wrapper";
import Navbar from "./components/Navbar";
import PortraitContainer from "./components/PortraitContainer";
import CharacterPortrait from "./components/CharacterPortrait";
import Footer from "./components/Footer";
import characters from "./characters.json";
import "./App.css";

class App extends Component {
  state = {
    characters: characters,
    clickedPortraits: [],
    navbarCenter: "THE MEMORY GAME",
    navbarTextColor: "text-white",
    score: 0,
    topScore: 0,
    shaking: false,
  };

  restoreSubtitle = (newScore) => {
    setTimeout(() => {
      // After 1.75 seconds, check whether the newScore passed into this function
      // is the same as the one currently stored in this.state.score; if it is
      // now different, this.state.navbarCenter will have been updated since this
      // function was called, so don't restore the subtitle yet to avoid clearing
      // the new message stored in it too early
      if (this.state.score === newScore) {
        this.setState({
          navbarCenter: "THE MEMORY GAME",
          navbarTextColor: "text-white",
        });
      }
    }, 1750);
  };

  // Use the Durstenfeld shuffle algorithm to randomize the order of elements
  // in an array (taken from Lauren Holst's answer the question found at
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
  durstenfeldShuffle = (array) => {
    // Loop over the array starting with its last element
    for (let i = array.length - 1; i > 0; i--) {
      // Assign randomNumber a random value between 0 and the length of what
      // remains to be looped over in the array
      const randomNumber = Math.floor(Math.random() * (i + 1));
      // Swap the randomly picked element of the array (which has an index
      // equal to randomNumber) with the element that has an index of i
      [array[i], array[randomNumber]] = [array[randomNumber], array[i]];
    }

    return array;
  };

  shakePortraits = () => {
    // Set this.state.shaking to true to give the portrait container the
    // .shaking class, which causes it to shake
    this.setState({
      shaking: true,
    });

    // Set this.state.shaking to false after 3 seconds so that the shaking
    // stops
    setTimeout(() => {
      this.setState({ shaking: false });
    }, 300);
  };

  gameRestarts = (finalScore) => {
    // If the score from this last game was higher than their previous
    // topScore, change topScore's value to reflect that
    if (finalScore > this.state.topScore) {
      this.setState({ topScore: finalScore });
    }

    // Reset their score and empty the array of previously clicked
    // portrait ids
    this.setState({
      clickedPortraits: [],
      score: 0,
      characters: this.durstenfeldShuffle(characters),
    });

    // Enter 0 as the argument since the game is restarting, and if
    // the score is no longer 0 when the subtitle should be restored
    // that means that the message stored in this.state.navbarCenter
    // has since changed due to a correct player choice
    this.restoreSubtitle(0);
  };

  allPicturesClicked = () => {
    this.setState({
      navbarCenter: "ALL PICTURES CLICKED!",
      navbarTextColor: "bebopGreen",
    });

    this.gameRestarts(this.state.score + 1);
  };

  portraitClicked = (portraitId) => {
    // Check if the id of the character whose portrait was just clicked
    // is in the array of previously clicked portrait ids
    if (!this.state.clickedPortraits.includes(portraitId)) {
      // If it isn't, increment the score by one and add it to the array
      // of clicked portrait ids
      this.setState({
        score: this.state.score + 1,
        clickedPortraits: this.state.clickedPortraits.concat([portraitId]),
        characters: this.durstenfeldShuffle(characters),
      });

      if (this.state.score === 11) {
        // Since the click was correct and that would make 12 after this,
        // call the function that handles all pictures having been
        // successfully clicked
        this.allPicturesClicked();
      } else {
        this.setState({
          navbarCenter: "YOU CHOSE CORRECTLY!",
          navbarTextColor: "bebopGreen",
        });

        this.restoreSubtitle(this.state.score + 1);
      }
    } else {
      // Otherwise, call the function that shakes the portrait container
      this.shakePortraits();
      // Then change the text in the center of the navbar to alert the
      // player to their incorrect guess
      this.setState({
        navbarCenter: "YOU CHOSE INCORRECTLY.",
        navbarTextColor: "bebopRed",
      });
      // Then call the function that handles the game ending/restarting
      this.gameRestarts(this.state.score);
    }
  };

  render() {
    return (
      <Wrapper>
        <div className="notFooter">
          <Navbar
            navbarCenter={this.state.navbarCenter}
            navbarTextColor={this.state.navbarTextColor}
            score={this.state.score}
            topScore={this.state.topScore}
          />
          <PortraitContainer shaking={this.state.shaking}>
            {this.state.characters.map((character) => (
              <CharacterPortrait
                portraitClicked={this.portraitClicked}
                id={character.id}
                name={character.name}
                image={character.image}
              />
            ))}
          </PortraitContainer>
        </div>
        <Footer />
      </Wrapper>
    );
  }
}

export default App;
