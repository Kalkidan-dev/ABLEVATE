// import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';


pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


export const extractTextFromPdf = async (pdfUrl) => {
  const loadingTask = pdfjsLib.getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const maxPages = pdf.numPages;
  const pageTextPromises = [];

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const textItems = textContent.items.map((item) => item.str);
    pageTextPromises.push(textItems.join(' '));
  }

  return (await Promise.all(pageTextPromises)).join(' ');
};

// 🔊 Speak the extracted text aloud using browser speech synthesis
export const speakText = (text) => {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  synth.cancel(); // 🔄 Optional: Stop any current speech
  synth.speak(utterance);
};

// 🎤 Handle a command like "read <pdfUrl>"
export const handleReadCommand = (text) => {
  if (text && text.toLowerCase().includes('read')) {
    const match = text.match(/read (.*)/i);
    if (match?.[1]) {
      const pdfUrl = match[1].trim();
      extractTextFromPdf(pdfUrl).then((pdfText) => {
        speakText(pdfText);
      });
    }
  }
};
