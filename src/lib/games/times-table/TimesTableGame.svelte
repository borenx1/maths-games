<script context="module" lang="ts">
  // Constants.
  const levelOptions = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const maxQuestionOptions = [5, 10, 15, 20, 30, 50, -1];
</script>

<script lang="ts">
  import { tick } from 'svelte';
  import { TimesTableGame } from './time-table-game';
  import type { GameState } from './time-table-game';

  let answerInput: HTMLInputElement;
  // Game setting variables.
  let level = 12;
  let minFactor = 2;
  let maxQuestions = 10;
  let showTimer = false;
  // Game state variables.
  let isPlaying = false;
  let isFinished = false;
  let game: TimesTableGame;
  let stage = 1;
  let factor1 = 0;
  let factor2 = 0;
  let history: GameState[] = [];
  let numCorrectAnswers = 0;
  let timer = 0;
  // Player input.
  let playerInput = '';

  $: previousState = history.length ? history[history.length - 1] : undefined;
  $: scorePercentage = (() => {
    const score = isFinished ? (numCorrectAnswers / stage) : (numCorrectAnswers / (stage - 1));
    return score.toLocaleString(undefined, {
      style: 'percent',
      maximumFractionDigits: 2,
    });
  })();

  /**
   * Sync the game state of the Game class with this component.
   */
  function syncGameState() {
    if (game === null || game === undefined) {
      game = new TimesTableGame(level, minFactor, maxQuestions);
    }
    const gameState = game.getGameState();
    stage = gameState.stage;
    factor1 = gameState.factor1;
    factor2 = gameState.factor2;
    history = game.getHistory();
    numCorrectAnswers = game.getNumCorrectAnswers();
    isFinished = game.isFinished();
  }

  function resetGameState() {
    game = new TimesTableGame(level, minFactor, maxQuestions);
    syncGameState();
    timer = 0;
    playerInput = '';
  }

  async function startGame() {
    resetGameState();
    isPlaying = true;
    await tick();
    answerInput.focus();
  }

  function restartGame() {
    resetGameState();
    isPlaying = false;
  }

  function attemptAnswer() {
    const playerInputNumber = parseFloat(playerInput);
    if (!isFinite(playerInputNumber)) {
      // TODO: Error
      return;
    }

    const isCorrect = game.answerQuestion(playerInputNumber);
    syncGameState();

    if (game.isFinished()) {
      return;
    }

    playerInput = '';
    answerInput.focus();
  }

  function attemptAnswerKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      attemptAnswer();
    }
  }
</script>

<div class="border border-black">
  <!-- Settings panel -->
  <div class="flex items-center p-2 border-b border-black space-x-2">
    <div>
      Level
      <select bind:value={level} class="border">
        {#each levelOptions as num}
          <option>{num}</option>
        {/each}
      </select>
    </div>
    <div>
      Questions
      <select bind:value={maxQuestions} class="border">
        {#each maxQuestionOptions as num}
          {#if num > 0}
            <option value={num}>{num}</option>
          {:else}
            <option value={num}>Unlimited</option>
          {/if}
        {/each}
      </select>
    </div>
  </div>
  <!-- Actions panel -->
  <div class="flex justify-end items-center p-1 border-b border-black">
    <label class="mr-2">
      <input type="checkbox" bind:checked={showTimer}>
      <span>Timer</span>
    </label>
    <button
      on:click={restartGame}
      class="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-700 rounded-xl p-1"
    >
      Restart Game
    </button>
  </div>
  <!-- Main output -->
  {#if isPlaying && !isFinished}
    <div class="flex flex-col p-1">
      {#if showTimer}
        <div>
          Time: {timer} {timer === 1 ? 'second' : 'seconds'}
        </div>
      {/if}
      <div class="grid grid-cols-2 gap-4">
        <div class="text-start">
          {#if maxQuestions > 0}
            Question {stage} / {maxQuestions}
          {:else}
            Question {stage}
          {/if}
        </div>
        <div class="font-mono text-end">
          {#if stage > 1}
            Score: {numCorrectAnswers} / {stage - 1} ({scorePercentage})
          {/if}
        </div>
      </div>
      <!-- Current question -->
      <div class="font-mono text-7xl text-center px-4 py-8">
        {factor1} &times; {factor2}
      </div>
      <!-- Feedback -->
      <div class="text-center">
        {#if previousState === undefined}
          Have fun!
        {:else if previousState.answer === previousState.playerAnswer}
          <span class="text-green-700">Your previous answer was correct!</span>
        {:else}
          <span class="text-red-700">Your previous answer was wrong! It was {previousState.answer}.</span>
        {/if}
      </div>
      <div class="flex w-full px-2 py-2">
        <input
          type="number"
          bind:this={answerInput}
          bind:value={playerInput}
          on:keydown={attemptAnswerKeyDown}
          class="text-2xl text-center border border-slate-700 w-2/3 py-1 mx-auto"
        >
      </div>
      <button
        on:click={attemptAnswer}
        class="w-3/4 sm:w-1/2 bg-slate-100 border hover:bg-slate-200 active:bg-slate-300 border-slate-700 py-2 px-4 mx-auto"
      >
        <span class="font-mono text-xl">Enter</span>
      </button>
    </div>
  {:else if isPlaying}
    <div class="text-center px-4 py-2">
      <h3 class="text-xl">
        You answered {numCorrectAnswers} out of {stage} questions correctly!
      </h3>
      <span>You got {scorePercentage} of questions correct.</span>
    </div>
    <div class="flex justify-center items-center py-12">
      <button
        on:click={startGame}
        class="bg-sky-100 hover:bg-sky-200 active:bg-sky-300 border border-sky-700 rounded-full p-4 w-1/4 aspect-square"
      >
        <span class="text-3xl font-bold">Play Again</span>
      </button>
    </div>
  {:else}
    <div class="flex justify-center items-center py-12">
      <button
        on:click={startGame}
        class="bg-sky-100 hover:bg-sky-200 active:bg-sky-300 border border-sky-700 rounded-full p-4 w-1/4 aspect-square"
      >
        <span class="text-3xl font-bold">Start Game</span>
      </button>
    </div>
  {/if}
</div>
