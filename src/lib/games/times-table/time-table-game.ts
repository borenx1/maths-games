import { randomInt } from '$lib/games/util';

export interface GameState {
  stage: number;
  factor1: number;
  factor2: number;
  answer: number;
  playerAnswer?: number;
}

export class TimesTableGame {
  // Game settings.
  private maxFactor: number;
  private minFactor: number;
  private size: number;
  // Game state.
  private state: GameState = {
    stage: 1,
    factor1: 0,
    factor2: 0,
    answer: 0,
  };
  private isGameOver = false;
  /** The history of questions and answers */
  private history: GameState[] = [];
  /** The number of correct player answers so far. */
  private numCorrectAnswers = 0;

  constructor(maxFactor: number, minFactor: number, size: number) {
    // Ensure positive integers.
    this.maxFactor = Math.floor(Math.max(maxFactor, 0));
    this.minFactor = Math.floor(Math.max(minFactor, 0));
    this.size = size;
    this.resetGameState();
  }

  getGameState() {
    return this.state;
  }

  getHistory() {
    return this.history;
  }

  getPreviousState(): GameState | undefined {
    if (this.history.length) {
      return this.history[this.history.length - 1];
    }
    return undefined;
  }

  getNumCorrectAnswers() {
    return this.numCorrectAnswers;
  }

  resetGameState() {
    this.state = {
      stage: 0, // Is set to 1 in the nextQuestion() function
      factor1: 0,
      factor2: 0,
      answer: 0,
    };
    this.isGameOver = false;
    this.history = [];
    this.numCorrectAnswers = 0;
    this.nextQuestion();
  }

  /**
   * Prepares the next question and answer (if this game is not finished)
   * and advances to the next game stage.
   */
  nextQuestion() {
    if (this.isGameOver) {
      return;
    }

    const factor1 = randomInt(this.minFactor, this.maxFactor);
    const factor2 = randomInt(this.minFactor, this.maxFactor);
    this.state = {
      stage: this.state.stage + 1,
      factor1,
      factor2,
      answer: Math.floor(factor1 * factor2),
    };
  }

  /**
   * Answers the question of factor1 * factor2 and advances to the next
   * question if the game hasn't ended yet. Adds to the game history.
   * @param {number} answer The player's answer to the current question.
   * @returns {boolean} `true` if the answer is correct.
   */
  answerQuestion(answer: number) {
    if (this.isGameOver) {
      return false;
    }

    this.state.playerAnswer = answer;
    const isCorrect = answer === this.state.answer;
    if (isCorrect) {
      this.numCorrectAnswers += 1;
    }

    this.history.push({ ...this.state });
    // End if game if the max questions is reached.
    if (this.size > 0 && this.state.stage >= this.size) {
      this.isGameOver = true;
    }
    this.nextQuestion();

    return isCorrect;
  }

  /**
   * Checks if the game is finished.
   * @returns {boolean} `true` if the progress > the game size and the size is not 0 (unlimited).
   */
  isFinished() {
    return this.isGameOver;
  }
}
