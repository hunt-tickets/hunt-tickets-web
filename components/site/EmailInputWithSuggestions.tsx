"use client";

import { useState, useRef, useEffect } from "react";
import { Field, useFormikContext } from "formik";
import { Input } from "@/components/ui/input";

interface EmailInputWithSuggestionsProps {
  name: string;
  placeholder?: string;
  disabled?: boolean;
}

const commonDomains = [
  "@gmail.com",
  "@outlook.com", 
  "@icloud.com",
  "@hotmail.com"
];

const EmailInputWithSuggestions: React.FC<EmailInputWithSuggestionsProps> = ({
  name,
  placeholder = "",
  disabled = false,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { values, setFieldValue } = useFormikContext<{ email: string }>();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const currentValue = values[name as keyof typeof values] as string || "";

  const generateSuggestions = (value: string) => {
    if (!value || value.includes("@")) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSuggestions(commonDomains);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setFieldValue(name, value);
    generateSuggestions(value);
  };

  const selectSuggestion = (domain: string) => {
    const currentInput = currentValue;
    setFieldValue(name, currentInput + domain);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter key
    if (e.key === "Enter") {
      e.preventDefault();
      
      // If suggestions are shown and one is selected, use it
      if (showSuggestions && suggestions.length > 0 && selectedIndex >= 0) {
        selectSuggestion(suggestions[selectedIndex]);
        return;
      }
      
      // Otherwise, submit the form if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (currentValue && emailRegex.test(currentValue)) {
        // Trigger form submission
        const form = (e.target as HTMLElement).closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
      return;
    }

    // Handle suggestions navigation only if suggestions are visible
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Escape":
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      case "Tab":
        if (selectedIndex >= 0) {
          e.preventDefault();
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        suggestionsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <Field name={name}>
        {({ field }: any) => (
          <Input
            {...field}
            ref={inputRef}
            type="email"
            placeholder={placeholder}
            disabled={disabled}
            className="w-full"
            showEmailIcon={true}
            style={{ textTransform: "lowercase" }}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoComplete="new-password"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            data-form-type="other"
          />
        )}
      </Field>

      {/* Suggestions as badges */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="mt-3 grid grid-cols-4 gap-2"
        >
          {suggestions.map((domain, index) => (
            <button
              key={domain}
              type="button"
              className={`inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border w-full ${
                index === selectedIndex
                  ? "bg-white/20 border-white/40 text-white shadow-lg"
                  : "bg-white/5 border-white/20 text-white/80 hover:bg-white/15 hover:border-white/40 hover:text-white hover:shadow-md"
              }`}
              style={{
                backdropFilter: 'blur(8px)',
                boxShadow: index === selectedIndex 
                  ? '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  : '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              onClick={() => selectSuggestion(domain)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="flex-shrink-0 opacity-70"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>{domain}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailInputWithSuggestions;