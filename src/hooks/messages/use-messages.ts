import { FormMessagesProps } from "@/types/messages";
import { useFormMessages } from "./use-form-messages";
import { useTemplateEditor } from "./use-template-editor";

export function useMessages(props: FormMessagesProps) {
  const formHook = useFormMessages(props);
  const templateHook = useTemplateEditor();

  const handleInsertEmoji = (emoji: string) => {
    templateHook.insertEmoji(emoji, (updater) => {
      const newText = updater(formHook.text);
      const event = {
        target: { value: newText },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      formHook.handleTextChange(event);
    });
  };

  const handleInsertVariable = (variable: any) => {
    templateHook.insertVariable(variable, (updater) => {
      const newText = updater(formHook.text);
      const event = {
        target: { value: newText },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      formHook.handleTextChange(event);
    });
  };

  const handleInsertTemplate = (template: string) => {
    templateHook.insertTemplate(template, (text) => {
      const event = {
        target: { value: text },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      formHook.handleTextChange(event);
    });
  };

  const handleFormatText = (format: any) => {
    templateHook.formatText(format, formHook.text, (text) => {
      const event = {
        target: { value: text },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      formHook.handleTextChange(event);
    });
  };

  const previewText = templateHook.getPreview(formHook.text);

  return {
    // Form properties and methods
    ...formHook,

    // Template editor properties and methods
    ...templateHook,

    // Connected methods
    insertEmoji: handleInsertEmoji,
    insertVariable: handleInsertVariable,
    insertTemplate: handleInsertTemplate,
    formatText: handleFormatText,

    // Derived state
    previewText,
  };
}
