const MAX_LOGGED_STEPS = 160;

const algorithms = {
  insertion: {
    name: "Сортування вставками",
    blurb: "Будує відсортовану частину масиву, вставляючи елементи на потрібні позиції.",
    complexity: "O(n²) | стабільна",
    run: insertionSort,
  },
  selection: {
    name: "Сортування прямим вибором",
    blurb: "Послідовно знаходить мінімальний елемент і ставить його на місце.",
    complexity: "O(n²) | нестабільна",
    run: selectionSort,
  },
  bubble: {
    name: "Сортування бульбашкою",
    blurb: "Підіймає великі елементи до кінця масиву через серію обмінів.",
    complexity: "O(n²) | стабільна",
    run: bubbleSort,
  },
  shell: {
    name: "Сортування Шелла",
    blurb: "Порівнює елементи на спадних відстанях (gap), пришвидшуючи впорядкування.",
    complexity: "≈ O(n log² n)",
    run: shellSort,
  },
  hoare: {
    name: "Швидке сортування (Гоар)",
    blurb: "Ділить масив за опорним елементом і рекурсивно впорядковує частини.",
    complexity: "O(n log n) в середньому",
    run: quickSortHoare,
  },
};

const ui = {
  input: document.getElementById("numbersInput"),
  algoSelect: document.getElementById("algoSelect"),
  randomSize: document.getElementById("randomSize"),
  generateBtn: document.getElementById("generateBtn"),
  clearBtn: document.getElementById("clearBtn"),
  sortBtn: document.getElementById("sortBtn"),
  about: document.getElementById("algorithmAbout"),
  rawOutput: document.getElementById("rawOutput"),
  sortedOutput: document.getElementById("sortedOutput"),
  stepsList: document.getElementById("stepsList"),
  stepsHint: document.getElementById("stepsHint"),
  timeMetric: document.getElementById("timeMetric"),
  swapMetric: document.getElementById("swapMetric"),
  compareMetric: document.getElementById("compareMetric"),
};

function formatArray(arr) {
  return arr.join(", ");
}

function parseNumbers(value) {
  const parts = value.split(/[\s,;]+/).filter(Boolean);
  if (!parts.length) {
    throw new Error("Введіть хоча б одне число.");
  }
  const numbers = parts.map((n) => Number(n));
  if (numbers.some((n) => Number.isNaN(n))) {
    throw new Error("Використовуйте лише числа (через пробіл або кому).");
  }
  return numbers;
}

function generateRandomArray(size) {
  const length = Math.max(3, Math.min(size, 200));
  const arr = [];
  for (let i = 0; i < length; i += 1) {
    const value = Math.round(Math.random() * 100 - 50);
    arr.push(value);
  }
  return arr;
}

function selectionSort(source, limit) {
  const arr = [...source];
  const steps = [];
  let swaps = 0;
  let comparisons = 0;

  for (let i = 0; i < arr.length - 1; i += 1) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j += 1) {
      comparisons += 1;
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      const left = arr[i];
      const right = arr[minIdx];
      [arr[i], arr[minIdx]] = [right, left];
      swaps += 1;
      if (steps.length < limit) {
        steps.push(`Крок ${i + 1}: min → індекс ${minIdx}, обмін ${left} ↔ ${right}`);
      }
    } else if (steps.length < limit) {
      steps.push(`Крок ${i + 1}: елемент ${arr[i]} вже мінімальний`);
    }
  }

  return { sorted: arr, steps, swaps, comparisons };
}

function bubbleSort(source, limit) {
  const arr = [...source];
  const steps = [];
  let swaps = 0;
  let comparisons = 0;
  let pass = 1;
  let swapped;

  do {
    swapped = false;
    for (let i = 0; i < arr.length - pass; i += 1) {
      comparisons += 1;
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swaps += 1;
        swapped = true;
        if (steps.length < limit) {
          steps.push(`Бульбашка ${pass}.${i + 1}: ${arr[i + 1]} піднялася над ${arr[i]}`);
        }
      }
    }
    pass += 1;
    if (!swapped && steps.length < limit) {
      steps.push("Далі проходи не потрібні — масив відсортований.");
    }
  } while (swapped);

  return { sorted: arr, steps, swaps, comparisons };
}

function insertionSort(source, limit) {
  const arr = [...source];
  const steps = [];
  let swaps = 0;
  let comparisons = 0;

  for (let i = 1; i < arr.length; i += 1) {
    const current = arr[i];
    let j = i - 1;
    if (steps.length < limit) {
      steps.push(`Беремо ${current} і шукаємо місце ліворуч.`);
    }
    while (j >= 0 && arr[j] > current) {
      comparisons += 1;
      arr[j + 1] = arr[j];
      j -= 1;
      swaps += 1;
    }
    if (j >= 0) {
      comparisons += 1;
    }
    arr[j + 1] = current;
    if (steps.length < limit) {
      steps.push(`Вставляємо ${current} на позицію ${j + 1}.`);
    }
  }

  return { sorted: arr, steps, swaps, comparisons };
}

function shellSort(source, limit) {
  const arr = [...source];
  const steps = [];
  let swaps = 0;
  let comparisons = 0;
  let gap = Math.floor(arr.length / 2);
  let wave = 1;

  while (gap > 0) {
    if (steps.length < limit) {
      steps.push(`Геп ${gap}: порівнюємо елементи на відстані.`);
    }
    for (let i = gap; i < arr.length; i += 1) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        comparisons += 1;
        arr[j] = arr[j - gap];
        j -= gap;
        swaps += 1;
      }
      if (j >= gap) {
        comparisons += 1;
      }
      arr[j] = temp;
      if (steps.length < limit) {
        steps.push(`Хвиля ${wave}: елемент ${temp} зміщений у позицію ${j}.`);
      }
      wave += 1;
    }
    gap = Math.floor(gap / 2);
  }

  return { sorted: arr, steps, swaps, comparisons };
}

function quickSortHoare(source, limit) {
  const arr = [...source];
  const steps = [];
  let swaps = 0;
  let comparisons = 0;

  const log = (text) => {
    if (steps.length < limit) {
      steps.push(text);
    }
  };

  const partition = (left, right) => {
    const pivot = arr[Math.floor((left + right) / 2)];
    let i = left - 1;
    let j = right + 1;
    log(`Опорний елемент = ${pivot} для діапазону [${left}, ${right}]`);

    while (true) {
      do {
        i += 1;
        comparisons += 1;
      } while (arr[i] < pivot);

      do {
        j -= 1;
        comparisons += 1;
      } while (arr[j] > pivot);

      if (i >= j) {
        return j;
      }

      [arr[i], arr[j]] = [arr[j], arr[i]];
      swaps += 1;
      log(`Обмін ${arr[j]} ↔ ${arr[i]} (після порівняння з опорним ${pivot})`);
    }
  };

  const quickSort = (left, right) => {
    if (left < right) {
      const pivotIndex = partition(left, right);
      quickSort(left, pivotIndex);
      quickSort(pivotIndex + 1, right);
    }
  };

  quickSort(0, arr.length - 1);
  return { sorted: arr, steps, swaps, comparisons };
}

function renderSteps(steps, truncated) {
  ui.stepsList.innerHTML = "";
  if (!steps.length) {
    const li = document.createElement("li");
    li.textContent = "Для цього масиву перестановки не знадобилися.";
    li.className = "muted";
    ui.stepsList.appendChild(li);
    return;
  }

  steps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    ui.stepsList.appendChild(li);
  });

  if (truncated) {
    const li = document.createElement("li");
    li.textContent = "Частину кроків приховано, щоб інтерфейс залишався швидким.";
    li.className = "muted";
    ui.stepsList.appendChild(li);
  }
}

function renderMetrics({ timeMs, swaps, comparisons }) {
  ui.timeMetric.textContent = `${timeMs.toFixed(2)} мс`;
  ui.swapMetric.textContent = swaps;
  ui.compareMetric.textContent = comparisons;
}

function renderResult(original, sorted, steps, truncated, algoKey) {
  const algo = algorithms[algoKey];
  ui.rawOutput.textContent = formatArray(original);
  ui.sortedOutput.textContent = formatArray(sorted);
  ui.about.textContent = `${algo.name}: ${algo.blurb} — ${algo.complexity}`;
  ui.stepsHint.textContent = truncated
    ? "Показані перші кроки, решта приховані."
    : "Повний хід алгоритму для заданого масиву.";
  renderSteps(steps, truncated);
}

function handleSort() {
  try {
    const numbers = parseNumbers(ui.input.value.trim());
    const algoKey = ui.algoSelect.value;
    const algo = algorithms[algoKey];
    if (!algo) {
      throw new Error("Оберіть алгоритм сортування.");
    }

    const start = performance.now();
    const { sorted, steps, swaps, comparisons } = algo.run(
      numbers,
      MAX_LOGGED_STEPS
    );
    const timeMs = performance.now() - start;
    renderResult(numbers, sorted, steps, steps.length >= MAX_LOGGED_STEPS, algoKey);
    renderMetrics({ timeMs, swaps, comparisons });
  } catch (error) {
    ui.about.textContent = error.message;
    ui.rawOutput.textContent = "—";
    ui.sortedOutput.textContent = "—";
    ui.stepsList.innerHTML = "";
    const li = document.createElement("li");
    li.textContent = error.message;
    li.className = "muted";
    ui.stepsList.appendChild(li);
    ui.stepsHint.textContent = "Виправте ввід і повторіть.";
    ui.timeMetric.textContent = "—";
    ui.swapMetric.textContent = "—";
    ui.compareMetric.textContent = "—";
  }
}

function seedWithSample() {
  const sample = generateRandomArray(10);
  ui.input.value = formatArray(sample);
}

function handleGenerate() {
  const size = Number(ui.randomSize.value) || 10;
  const arr = generateRandomArray(size);
  ui.input.value = formatArray(arr);
}

function handleClear() {
  ui.input.value = "";
  ui.rawOutput.textContent = "—";
  ui.sortedOutput.textContent = "—";
  ui.stepsList.innerHTML = "";
  const li = document.createElement("li");
  li.textContent = "Кроки з'являться тут після запуску.";
  li.className = "muted";
  ui.stepsList.appendChild(li);
  ui.about.textContent = "Оберіть алгоритм і натисніть «Сортувати».";
  ui.stepsHint.textContent = "Натисніть «Сортувати», щоб побачити деталі.";
  ui.timeMetric.textContent = "—";
  ui.swapMetric.textContent = "—";
  ui.compareMetric.textContent = "—";
}

ui.sortBtn.addEventListener("click", handleSort);
ui.generateBtn.addEventListener("click", handleGenerate);
ui.clearBtn.addEventListener("click", handleClear);

seedWithSample();
