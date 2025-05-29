import { useCallback, useState } from "react";
import { FormData, FormMessagesProps } from "@/types/messages";

export function useFormMessages({
  initialData,
  isLoading,
  onSubmit,
}: FormMessagesProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [text, setText] = useState(initialData?.text || "");

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setTitle(e.target.value);
    },
    []
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
      setText(e.target.value);
    },
    []
  );

  const extractVariables = useCallback((text: string): string[] => {
    const matches = text.match(/\{([^}]+)\}/g);
    return matches ? matches.map((match) => match.slice(1, -1)) : [];
  }, []);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!title.trim() || !text.trim()) {
      console.warn("Title and text are required");
      return;
    }

    const formData: FormData = {
      title: title.trim(),
      text: text.trim(),
      details: {
        variables_used: extractVariables(text),
        character_count: text.length,
        word_count: text.split(/\s+/).filter((word) => word.length > 0).length,
        created_at: new Date().toISOString(),
      },
    };

    console.log("Form submitted:", formData);

    if (onSubmit) {
      await onSubmit(formData);
    }
  }, [title, text, onSubmit, extractVariables]);

  const resetForm = useCallback((): void => {
    setTitle("");
    setText("");
  }, []);

  const isFormValid = useCallback((): boolean => {
    return title.trim().length > 0 && text.trim().length > 0;
  }, [title, text]);

  // Derived state
  const characterCount = text.length;
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
  const usedVariables = extractVariables(text);

  return {
    // Form State
    title,
    text,
    isLoading,

    // Form Handlers
    handleTitleChange,
    handleTextChange,
    handleSubmit,
    resetForm,

    // Form Validation
    isFormValid: isFormValid(),

    // Form Data
    characterCount,
    wordCount,
    usedVariables,

    // Utilities
    extractVariables,
  };
}
