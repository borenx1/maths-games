<script context="module" lang="ts">
  // Constants.
  const levelOptions = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const maxQuestionOptions = [5, 10, 15, 20, 30, 50, -1];
</script>

<script lang="ts">
  import { tick, onDestroy } from 'svelte';
  import { formatTimeMinuteSecond } from '$lib/util/string';
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
  // Timer variables.
  let startTime = 0;
  let endTime = 0;
  let timer = 0;
  let interval: NodeJS.Timer;
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
  $: timerFormatted = formatTimeMinuteSecond(timer);

  onDestroy(() => clearInterval(interval));

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
    playerInput = '';
    clearInterval(interval);
    timer = 0;
  }

  async function startGame() {
    resetGameState();
    isPlaying = true;
    await tick();
    answerInput.focus();
    startTime = Date.now();
    interval = setInterval(() => {
      timer++;
    }, 1000);
  }

  function restartGame() {
    // TODO: Resets game state twice if restart then start.
    resetGameState();
    isPlaying = false;
  }

  function attemptAnswer() {
    const playerInputNumber = parseFloat(playerInput);
    if (!isFinite(playerInputNumber)) {
      // TODO: Error
      return;
    }

    game.answerQuestion(playerInputNumber);
    syncGameState();

    if (game.isFinished()) {
      endTime = Date.now();
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

<div class="border border-zinc-900 dark:border-zinc-100">
  <!-- Settings panel -->
  <div class="flex items-center p-2 border-b border-zinc-900 dark:border-zinc-100 space-x-2">
    <div>
      Level
      <select bind:value={level} class="border bg-white dark:bg-zinc-800">
        {#each levelOptions as num}
          <option>{num}</option>
        {/each}
      </select>
    </div>
    <div>
      Questions
      <select bind:value={maxQuestions} class="border bg-white dark:bg-zinc-800">
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
  <div class="flex justify-end items-center p-1 border-b border-zinc-900 dark:border-zinc-100">
    <label class="mr-2">
      <input type="checkbox" bind:checked={showTimer}>
      <span>Timer</span>
    </label>
    <button
      on:click={restartGame}
      class="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 active:bg-slate-300 dark:active:bg-slate-900 border border-slate-700 rounded-xl p-1"
    >
      Restart Game
    </button>
  </div>
  <!-- Main game screen -->
  {#if isPlaying && !isFinished}
    <div class="flex flex-col p-1">
      {#if showTimer}
        <div>
          Time: {timerFormatted}
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
      <div class="font-mono text-5xl sm:text-7xl text-center px-4 py-8">
        {factor1} &times; {factor2}
      </div>
      <!-- Feedback -->
      <div class="text-center">
        {#if previousState === undefined}
          Have fun!
        {:else if previousState.answer === previousState.playerAnswer}
          <span class="text-green-700 dark:text-green-300">Your previous answer was correct!</span>
        {:else}
          <span class="text-red-700 dark:text-red-300">Your previous answer was wrong! It was {previousState.answer}.</span>
        {/if}
      </div>
      <div class="flex w-full py-2">
        <input
          type="number"
          bind:this={answerInput}
          bind:value={playerInput}
          on:keydown={attemptAnswerKeyDown}
          class="font-mono text-xl sm:text-3xl text-center bg-zinc-50 dark:bg-zinc-800 border border-zinc-900 dark:border-zinc-100 rounded-lg w-2/3 py-1 mx-auto"
        >
      </div>
      <button
        on:click={attemptAnswer}
        class="w-3/4 sm:w-1/2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 active:bg-slate-300 dark:active:bg-slate-900 border border-slate-700 rounded py-2 px-4 mx-auto"
      >
        <span class="font-mono text-xl">ENTER</span>
      </button>
    </div>
  <!-- Game over screen -->
  {:else if isPlaying}
    <div class="text-center px-4 py-2">
      <h3 class="text-xl">
        You answered {numCorrectAnswers} out of {stage} questions correctly!
      </h3>
      <p>You got {scorePercentage} of questions correct.</p>
      <p>Time taken: {formatTimeMinuteSecond((endTime - startTime) / 1000)}.</p>
    </div>
    <div class="flex justify-center items-center py-8 sm:py-12">
      <button
        on:click={startGame}
        class="bg-sky-100 dark:bg-sky-700 hover:bg-sky-200 dark:hover:bg-sky-800 active:bg-sky-300 dark:active:bg-sky-900 border border-sky-700 rounded-full p-4 w-1/2 sm:w-1/4 aspect-square"
      >
        <span class="text-3xl font-bold">Play Again</span>
      </button>
    </div>
  <!-- Start game screen -->
  {:else}
    <div class="flex justify-center items-center py-8 sm:py-12">
      <button
        on:click={startGame}
        class="bg-sky-100 dark:bg-sky-700 hover:bg-sky-200 dark:hover:bg-sky-800 active:bg-sky-300 dark:active:bg-sky-900 border border-sky-700 rounded-full p-4 w-1/2 sm:w-1/4 aspect-square"
      >
        <span class="text-3xl font-bold">Start Game</span>
      </button>
    </div>
  {/if}
</div>
