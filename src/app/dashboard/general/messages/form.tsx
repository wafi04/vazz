"use client";
import {
  Send,
  Smile,
  Hash,
  Bold,
  Italic,
  List,
  MessageSquare,
} from "lucide-react";
import type { FormMessagesProps } from "@/types/messages";
import { messageSuggestions, emojis, variables } from "@/data/data-message";
import { useMessages } from "@/hooks/messages/use-messages";
import { Button } from "@/components/ui/button";
import type { JSX } from "react";

export function FormMessages({
  onSubmit,
  initialData,
  isLoading = false,
}: FormMessagesProps): JSX.Element {
  const {
    // Form state
    title,
    text,
    characterCount,
    usedVariables,
    isFormValid,

    // Form handlers
    handleTitleChange,
    handleTextChange,
    handleSubmit,

    // Template editor state
    showEmojiPicker,
    showVariablePicker,
    showSuggestions,

    // Template editor actions
    insertEmoji,
    insertVariable,
    insertTemplate,
    formatText,
    previewText,

    // Template editor toggles
    toggleEmojiPicker,
    toggleVariablePicker,
    toggleSuggestions,
  } = useMessages({
    initialData,
    isLoading,
    onSubmit,
  });

  console.log(initialData);

  return (
    <div className="bg-background text-foreground rounded-lg shadow-lg">
      <div className="flex gap-4">
        {/* Main Form Content */}
        <div
          className={`space-y-6 transition-all duration-300 ${
            showSuggestions ? "flex-1" : "w-full"
          }`}
        >
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Judul Template
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              placeholder="Contoh: Konfirmasi Pesanan"
              required
              disabled={isLoading}
            />
          </div>

          {/* Message Suggestions Toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                Template Pesan
              </label>
              <button
                type="button"
                onClick={toggleSuggestions}
                className={`text-sm flex items-center gap-1 disabled:opacity-50 transition-colors rounded px-2 py-1 ${
                  showSuggestions
                    ? "text-primary-foreground bg-primary"
                    : "text-primary hover:text-primary/80 hover:bg-primary/10"
                }`}
                disabled={isLoading}
              >
                <List className="w-4 h-4" />
                {showSuggestions ? "Tutup Saran" : "Lihat Saran"}
              </button>
            </div>
          </div>

          {/* Message Text Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                Isi Pesan
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {characterCount} karakter
                </span>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 p-2 border border-b-0 rounded-t-md bg-card/50">
              <button
                type="button"
                onClick={() => formatText("bold")}
                className="p-1 hover:bg-muted rounded disabled:opacity-50 text-foreground"
                title="Bold (*text*)"
                disabled={isLoading}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatText("italic")}
                className="p-1 hover:bg-muted rounded disabled:opacity-50 text-foreground"
                title="Italic (_text_)"
                disabled={isLoading}
              >
                <Italic className="w-4 h-4" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={toggleEmojiPicker}
                  className="p-1 hover:bg-muted rounded disabled:opacity-50 text-foreground"
                  title="Emoji"
                  disabled={isLoading}
                >
                  <Smile className="w-4 h-4" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute top-8 left-0 z-10 bg-popover border border-border rounded-lg shadow-lg p-3 w-64">
                    <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
                      {emojis.map((emoji, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => insertEmoji(emoji)}
                          className="w-8 h-8 hover:bg-muted rounded text-lg flex items-center justify-center"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={toggleVariablePicker}
                  className="p-1 hover:bg-muted rounded disabled:opacity-50 text-foreground"
                  title="Variabel"
                  disabled={isLoading}
                >
                  <Hash className="w-4 h-4" />
                </button>
                {showVariablePicker && (
                  <div className="absolute top-8 left-0 z-10 bg-popover border border-border rounded-lg shadow-lg p-3 w-72">
                    <h4 className="font-medium text-foreground mb-2">
                      Variabel Tersedia:
                    </h4>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {variables.map((variable, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => insertVariable(variable)}
                          className="w-full text-left p-2 hover:bg-muted rounded text-sm"
                        >
                          <div className="font-medium text-foreground">{`{${variable.key}}`}</div>
                          <div className="text-muted-foreground text-xs">
                            {variable.label} - {variable.example}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <textarea
              id="message-text"
              value={text}
              onChange={handleTextChange}
              className="w-full px-3 py-2 bg-card border border-border rounded-b-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50 disabled:bg-muted"
              rows={6}
              placeholder="Tulis pesan Anda di sini... Gunakan {name} untuk variabel nama, dll."
              required
              disabled={isLoading}
            />
          </div>

          {/* Preview */}
          {text && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Preview:
              </h4>
              <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-card p-3 rounded-lg shadow-sm border border-border">
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                        {previewText}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Variables Used */}
          {usedVariables.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Variabel yang Digunakan:
              </h4>
              <div className="flex flex-wrap gap-2">
                {usedVariables.map((variable, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-secondary/20 text-secondary border border-secondary/30 text-xs rounded-full"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading || !isFormValid}
            >
              <Send className="w-4 h-4" />
              {isLoading ? "Menyimpan..." : "Simpan Template"}
            </button>
          </div>
        </div>

        {/* Template Suggestions Sidebar */}
        {showSuggestions && (
          <div className="w-80 border-l border-border pl-4">
            <div className="sticky top-0">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <List className="w-4 h-4" />
                Template Saran
              </h4>
              <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                {messageSuggestions.map((category, idx) => (
                  <div
                    key={idx}
                    className="border-b border-border/50 pb-4 last:border-b-0"
                  >
                    <h5 className="text-sm font-medium text-muted-foreground mb-3 sticky top-0 bg-background py-1">
                      {category.category}:
                    </h5>
                    <div className="space-y-2">
                      {category.templates.map((template, templateIdx) => (
                        <Button
                          key={templateIdx}
                          type="button"
                          onClick={() => insertTemplate(template)}
                          variant="outline"
                          size="sm"
                          className="w-full text-left p-3 h-auto text-sm hover:bg-primary/10 hover:border-primary/30 transition-colors disabled:opacity-50 whitespace-normal border-border bg-card text-foreground"
                          disabled={isLoading}
                        >
                          <span className="block text-left leading-relaxed">
                            {template}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
