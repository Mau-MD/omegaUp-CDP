import sanitizeMarkdown from "sanitize-markdown";
import { getFirstHidden } from "web-vitals/dist/lib/getFirstHidden";
import MarkdownIt from "markdown-it";

// @ts-ignore
import katex from "katex";
// @ts-ignore
import markdownMath from "markdown-it-texmath";

function splitBetweenTwo(
  input: string[],
  firstOccurrence: string,
  secondOccurrence: string
) {
  const startIndex = input.findIndex(
    (element) => element.trim() === firstOccurrence
  );
  const endIndex = input.findIndex(
    (element) =>
      element.trim() === secondOccurrence || element.trim() === "||end"
  );

  return {
    result: input.slice(startIndex + 1, endIndex),
    index: { startIndex, endIndex },
  };
}

function getLines(input: string) {
  let lines = input.split("\n");
  let firstGlobalIndex = lines.findIndex((line) => line === "||input");
  let lastGlobalIndex = lines.findIndex((line) => line === "||end");
  const occurrences = [
    { first: "||input", second: "||output" },
    { first: "||output", second: "||description" },
    { first: "||description", second: "||input" },
  ];
  let iterator = 0;
  let row: string[] = [],
    inputTable: string[][] = [];

  do {
    const firstOccurrence = occurrences[iterator % 3].first;
    const secondOccurrence = occurrences[iterator % 3].second;
    const { result, index } = splitBetweenTwo(
      lines,
      firstOccurrence,
      secondOccurrence
    );
    if (index.startIndex === -1 || index.endIndex === -1) break;
    lines = lines.slice(index.endIndex);
    if (iterator !== 0 && iterator % 3 === 0) {
      inputTable.push(row);
      row = [];
    }
    row.push(
      result.reduce((text, line) => (text += "<pre>" + line + "</pre>"), "")
      // "<pre>" + result.join("") + "</pre>"
    );
    iterator++;
  } while (iterator < 1000);
  inputTable.push(row);
  return {
    inputTable: inputTable,
    index: { startIndex: firstGlobalIndex, finalIndex: lastGlobalIndex + 1 },
  };
}

export const parse = (input: string) => {
  const parser = new MarkdownIt({
    html: true,
  }).use(markdownMath, { engine: katex, delimiters: "dollars" });
  const sanitizedInput = sanitizeMarkdown(input, { allowedTags: ["br"] });
  console.log(sanitizedInput);
  const { inputTable, index } = getLines(sanitizedInput);
  const finalTableOutput: string[] = [];
  inputTable.forEach((row) => {
    finalTableOutput.push("|" + row.join("|") + "|");
  });
  const sanitizedArray = sanitizedInput.split("\n");
  const firstPart = sanitizedArray.slice(0, index.startIndex);
  firstPart.push("| Entrada | Salida | Descripcion| ");
  firstPart.push("| - | - | -| ");
  const secondPart = sanitizedArray.slice(index.finalIndex);
  // | Entrada | Salida | Descripcion|
  // |-|-|-|
  const finalArray = [...firstPart, ...finalTableOutput, ...secondPart];
  const finalString = finalArray.join("\n");
  console.log(finalString);
  return parser.render(finalString.replaceAll("$$", "\n$$$$\n"));
};
