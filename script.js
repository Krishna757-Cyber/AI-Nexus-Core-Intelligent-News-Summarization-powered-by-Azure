let generatedSummary = "";
let currentLanguage = "en";

window.onload = function () {
  document.getElementById("langEndpoint").value =
    localStorage.getItem("langEndpoint") || "";

  document.getElementById("langKey").value =
    localStorage.getItem("langKey") || "";

  document.getElementById("speechRegion").value =
    localStorage.getItem("speechRegion") || "koreacentral";

  document.getElementById("speechKey").value =
    localStorage.getItem("speechKey") || "";

  document.getElementById("transRegion").value =
    localStorage.getItem("transRegion") || "koreacentral";

  document.getElementById("transKey").value =
    localStorage.getItem("transKey") || "";
};

function toggleConfig() {
  const content = document.getElementById("configContent");
  const icon = document.getElementById("configIcon");

  if (content.style.display === "none") {
    content.style.display = "grid";
    icon.className = "fa-solid fa-chevron-up";
  } else {
    content.style.display = "none";
    icon.className = "fa-solid fa-chevron-down";
  }
}

function saveKeys() {
  localStorage.setItem(
    "langEndpoint",
    document.getElementById("langEndpoint").value.trim()
  );

  localStorage.setItem(
    "langKey",
    document.getElementById("langKey").value.trim()
  );

  localStorage.setItem(
    "speechRegion",
    document.getElementById("speechRegion").value.trim()
  );

  localStorage.setItem(
    "speechKey",
    document.getElementById("speechKey").value.trim()
  );

  localStorage.setItem(
    "transRegion",
    document.getElementById("transRegion").value.trim()
  );

  localStorage.setItem(
    "transKey",
    document.getElementById("transKey").value.trim()
  );

  showToast("Settings Saved!");
}

function showToast(msg) {
  const toast = document.getElementById("toast");

  toast.innerText = msg;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

function getKeys() {
  return {
    langEndpoint: localStorage.getItem("langEndpoint"),
    langKey: localStorage.getItem("langKey"),
    speechRegion: localStorage.getItem("speechRegion"),
    speechKey: localStorage.getItem("speechKey"),
    transRegion: localStorage.getItem("transRegion"),
    transKey: localStorage.getItem("transKey")
  };
}

/* ==========================
   VOICE INPUT
========================== */

async function startVoiceInput() {
  const keys = getKeys();

  if (!keys.speechKey || !keys.speechRegion) {
    alert("Please configure Azure Speech API.");
    return;
  }

  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    keys.speechKey,
    keys.speechRegion
  );

  speechConfig.speechRecognitionLanguage = "en-US";

  const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

  const recognizer = new SpeechSDK.SpeechRecognizer(
    speechConfig,
    audioConfig
  );

  recognizer.recognizeOnceAsync((result) => {
    document.getElementById("articleInput").value += result.text;
  });
}

/* ==========================
   SUMMARIZATION
========================== */

async function summarizeArticle() {
  const article = document.getElementById("articleInput").value;

  const keys = getKeys();

  if (!article.trim()) {
    alert("Please enter article text.");
    return;
  }

  let endpoint = keys.langEndpoint;

  if (!endpoint.endsWith("/")) endpoint += "/";

  const url =
    endpoint +
    "language/analyze-text/jobs?api-version=2023-04-01";

  const body = {
    displayName: "WebSummarization",
    analysisInput: {
      documents: [
        {
          id: "1",
          language: "en",
          text: article
        }
      ]
    },
    tasks: [
      {
        kind: "ExtractiveSummarization",
        parameters: {
          sentenceCount: 3
        }
      }
    ]
  };

  try {
    document.getElementById("summaryOutput").innerHTML =
      "Processing...";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": keys.langKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const operationLocation =
      response.headers.get("operation-location");

    let data;

    do {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = await fetch(operationLocation, {
        headers: {
          "Ocp-Apim-Subscription-Key": keys.langKey
        }
      });

      data = await result.json();

    } while (
      data.status === "running" ||
      data.status === "notStarted"
    );

    const sentences =
      data.tasks.items[0].results.documents[0].sentences;

    generatedSummary = sentences.map((s) => s.text).join(" ");

    document.getElementById("summaryOutput").innerHTML =
      generatedSummary;

  } catch (error) {
    document.getElementById("summaryOutput").innerHTML =
      "Error: " + error.message;
  }
}

/* ==========================
   TRANSLATION
========================== */

async function translateSummary() {

  if (!generatedSummary) {
    alert("Generate summary first.");
    return;
  }

  const keys = getKeys();

  const language =
    document.getElementById("languageSelect").value;

  const endpoint =
    "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=" +
    language;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": keys.transKey,
        "Ocp-Apim-Subscription-Region": keys.transRegion,
        "Content-Type": "application/json"
      },
      body: JSON.stringify([
        {
          Text: generatedSummary
        }
      ])
    });

    const data = await response.json();

    generatedSummary =
      data[0].translations[0].text;

    document.getElementById("summaryOutput").innerHTML =
      generatedSummary;

    currentLanguage = language;

  } catch (error) {
    alert(error.message);
  }
}

/* ==========================
   TEXT TO SPEECH
========================== */

function speakSummary() {

  if (!generatedSummary) {
    alert("Generate summary first.");
    return;
  }

  const speech = new SpeechSynthesisUtterance(
    generatedSummary
  );

  const langMap = {
    en: "en-US",
    hi: "hi-IN",
    es: "es-ES",
    fr: "fr-FR",
    "zh-Hans": "zh-CN"
  };

  speech.lang = langMap[currentLanguage] || "en-US";

  window.speechSynthesis.speak(speech);
}