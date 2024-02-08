import * as vscode from "vscode";

/**
 * Activates the extension.
 *
 * @param context The extension context.
 */

export function activate(context: vscode.ExtensionContext) {
  // Registra el evento de cambio en el documento
  // Record the change event in the document
  vscode.workspace.onDidChangeTextDocument((event) => {
    const document = event.document;

    // Verifica si el cambio ocurrió en un documento de código
    // Check if the change occurred in a code document
    if (isCodeDocument(document)) {
      // Obtiene la configuración del usuario
      // Get user configuration
      const config = vscode.workspace.getConfiguration("commentExtension");
      const useMultilineComments = config.get("useMultilineComments", true);

      // Determina la sintaxis de comentario correspondiente al lenguaje
      // Determine the comment syntax corresponding to the language
      const commentSyntax = getCommentSyntax(
        document.languageId,
        useMultilineComments
      );

      // Realiza la sustitución de // por la sintaxis de comentario correspondiente
      // Perform the substitution of // for the corresponding comment syntax
      const modifiedText = document
        .getText()
        .replace(/\/\/(.*)/g, commentSyntax);

      // Aplica el cambio al documento
      // Apply the change to the document
      const edit = new vscode.WorkspaceEdit();
      edit.replace(
        document.uri,
        new vscode.Range(0, 0, document.lineCount, 0),
        modifiedText
      );

      vscode.workspace.applyEdit(edit);
    }
  });
}

// Desactiva la extensión cuando se desactiva VS Code
// Deactivate the extension when VS Code is deactivated
export function deactivate() {}

function isCodeDocument(document: vscode.TextDocument): boolean {
  // Verifica si el documento es de código según su lenguaje
  // Check if the document is code based on its language
  const codeLanguages = [
    "javascript",
    "typescript",
    "html",
    "css",
    "python",
    "java",
    "c",
    "cpp",
    "csharp",
    "ruby",
    "swift",
    "php",
  ];

  return codeLanguages.includes(document.languageId);
}

function getCommentSyntax(
  languageId: string,
  useMultilineComments: boolean
): string {
  // Retorna la sintaxis de comentario correspondiente al lenguaje y la configuración del usuario
  // Returns the comment syntax corresponding to the language and user configuration
  switch (languageId) {
    case "html":
      return useMultilineComments ? "<!-- $1 -->" : "<!-- $1 -->";
    case "css":
      return useMultilineComments ? "/* $1 */" : "/* $1 */";
    case "javascript":
      return useMultilineComments ? "/* $1 */" : "//$1";
    case "typescript":
      return useMultilineComments ? "/* $1 */" : "//$1";
    case "python":
      return useMultilineComments ? "#$1" : "#$1";
    default:
      return "//$1";
  }
}
