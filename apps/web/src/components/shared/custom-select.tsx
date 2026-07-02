import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  options: Option[] | string[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement> | string | any) => void;
  value?: string | string[];
  placeholder?: string;
  wrapperClassName?: string;
  multiple?: boolean;
}

export const CustomSelect = forwardRef<HTMLSelectElement, CustomSelectProps>(
  ({ options, placeholder = "Select an option", className, wrapperClassName, value, onChange, name, multiple, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string | string[]>(value || (multiple ? [] : ""));
    const selectRef = useRef<HTMLDivElement>(null);
    const nativeSelectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
      let newValue: string | string[];
      if (multiple) {
        const currentVals = Array.isArray(internalValue) ? internalValue : [];
        if (currentVals.includes(val)) {
          newValue = currentVals.filter(v => v !== val);
        } else {
          newValue = [...currentVals, val];
        }
      } else {
        newValue = val;
        setIsOpen(false);
      }
      
      setInternalValue(newValue);
      
      if (nativeSelectRef.current) {
        if (multiple) {
          const arr = newValue as string[];
          Array.from(nativeSelectRef.current.options).forEach(opt => {
            opt.selected = arr.includes(opt.value);
          });
        } else {
          nativeSelectRef.current.value = newValue as string;
        }
      }
      
      if (onChange) {
        const isHookForm = typeof onChange === 'function' && onChange.name !== 'mockOnChange' && onChange.name !== '';
        
        const mockEvent = {
          target: { name, value: newValue },
          currentTarget: { name, value: newValue },
          preventDefault: () => {},
          stopPropagation: () => {},
        };

        onChange(isHookForm ? mockEvent as any : (multiple ? newValue : val));
      }
    };

    const normalizedOptions = options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt);
    
    let displayValue = placeholder;
    if (multiple) {
       const selectedOpts = normalizedOptions.filter(opt => Array.isArray(internalValue) && internalValue.includes(opt.value));
       if (selectedOpts.length > 0) displayValue = selectedOpts.map(o => o.label).join(", ");
    } else {
       const selectedOption = normalizedOptions.find(opt => opt.value === internalValue);
       if (selectedOption) displayValue = selectedOption.label;
    }

    return (
      <div className={cn("relative", wrapperClassName)} ref={selectRef}>
        <select 
          ref={(e) => {
             (nativeSelectRef as any).current = e;
             if (typeof ref === 'function') ref(e);
             else if (ref) (ref as React.MutableRefObject<HTMLSelectElement | null>).current = e;
          }}
          name={name} 
          value={internalValue}
          onChange={(e) => {
             if (onChange) onChange(e);
             setInternalValue(multiple ? Array.from(e.target.selectedOptions, o => o.value) : e.target.value);
          }}
          multiple={multiple}
          className="opacity-0 absolute inset-0 -z-10 w-full h-full pointer-events-none" 
          {...props}
        >
          {!multiple && <option value="" disabled>{placeholder}</option>}
          {normalizedOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <div 
          className={cn("w-full px-4 py-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-sm bg-white", isOpen ? "border-primary-500 ring-2 ring-primary-500/20" : "border-accent-200 hover:border-accent-300", className)}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={cn("truncate pr-2", internalValue && (Array.isArray(internalValue) ? internalValue.length > 0 : true) ? "text-text-900" : "text-text-400")}>
            {displayValue}
          </span>
          <ChevronDown className={cn("w-4 h-4 text-text-400 transition-transform shrink-0", isOpen && "rotate-180")} />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-accent-200 rounded-xl shadow-lg max-h-60 overflow-y-auto overflow-hidden">
            <div className="py-1">
              {normalizedOptions.map((opt) => {
                const isSelected = multiple ? (Array.isArray(internalValue) && internalValue.includes(opt.value)) : internalValue === opt.value;
                return (
                  <div 
                    key={opt.value}
                    className={cn("px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-primary-50 flex items-center justify-between", isSelected ? "bg-primary-50 font-medium text-primary-700" : "text-text-700")}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && multiple && (
                      <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 ml-2"></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";
