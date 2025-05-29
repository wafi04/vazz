import { useCallback, useState } from "react";
import { FormatType, Variable } from "@/types/messages";
import { variables } from "@/data/data-message";

type TextUpdater = (updater: (prevText: string) => string) => void;
type TextSetter = (text: string) => void;

export function useTemplateEditor() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVariablePicker, setShowVariablePicker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const insertEmoji = useCallback(
    (emoji: string, updateText: TextUpdater): void => {
      updateText((prev) => prev + emoji);
      setShowEmojiPicker(false);
    },
    []
  );

  const insertVariable = useCallback(
    (variable: Variable, updateText: TextUpdater): void => {
      const variableText = `{${variable.key}}`;
      updateText((prev) => prev + variableText);
      setShowVariablePicker(false);
    },
    []
  );

  const insertTemplate = useCallback(
    (template: string, setText: TextSetter): void => {
      setText(template);
      setShowSuggestions(false);
    },
    []
  );

  const formatText = useCallback(
    (format: FormatType, text: string, setText: TextSetter): void => {
      const textarea = document.getElementById(
        "message-text"
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = text.substring(start, end);

      if (selectedText) {
        let formattedText = "";
        switch (format) {
          case "bold":
            formattedText = `*${selectedText}*`;
            break;
          case "italic":
            formattedText = `_${selectedText}_`;
            break;
          case "strikethrough":
            formattedText = `~${selectedText}~`;
            break;
          default:
            formattedText = selectedText;
        }

        const newText =
          text.substring(0, start) + formattedText + text.substring(end);
        setText(newText);

        // Restore cursor position after formatting
        setTimeout(() => {
          textarea.setSelectionRange(
            start + formattedText.length,
            start + formattedText.length
          );
          textarea.focus();
        }, 0);
      }
    },
    []
  );

  const getPreview = useCallback((text: string): string => {
    let preview = text;
    variables.forEach((variable) => {
      const regex = new RegExp(`\\{${variable.key}\\}`, "g");
      preview = preview.replace(regex, `[${variable.example}]`);
    });
    return preview;
  }, []);

  const toggleEmojiPicker = useCallback((): void => {
    setShowEmojiPicker((prev) => !prev);
    setShowVariablePicker(false);
    setShowSuggestions(false);
  }, []);

  const toggleVariablePicker = useCallback((): void => {
    setShowVariablePicker((prev) => !prev);
    setShowEmojiPicker(false);
    setShowSuggestions(false);
  }, []);

  const toggleSuggestions = useCallback((): void => {
    setShowSuggestions((prev) => !prev);
    setShowEmojiPicker(false);
    setShowVariablePicker(false);
  }, []);

  const closeAllPickers = useCallback((): void => {
    setShowEmojiPicker(false);
    setShowVariablePicker(false);
    setShowSuggestions(false);
  }, []);

  return {
    // Template Editor State
    showEmojiPicker,
    showVariablePicker,
    showSuggestions,

    // Template Editor Actions
    insertEmoji,
    insertVariable,
    insertTemplate,
    formatText,
    getPreview,

    // Template Editor Toggles
    toggleEmojiPicker,
    toggleVariablePicker,
    toggleSuggestions,
    closeAllPickers,
  };
}
