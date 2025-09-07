"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Slider } from "@heroui/slider";
import { TbRefresh, TbCopy } from "react-icons/tb";
import { CopyButton } from "@/components/copy-button";
import { 
  generatePassword, 
  validatePasswordOptions, 
  createDefaultPasswordOptions,
  type PasswordOptions 
} from "@/lib/util/password.util";

export default function PasswordGeneratorForm() {
  const [password, setPassword] = useState("");
  const [options, setOptions] = useState<PasswordOptions>(createDefaultPasswordOptions());

  const handleGenerate = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
  };

  const updateOption = (key: keyof PasswordOptions, value: boolean | number | string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const validation = validatePasswordOptions(options);
  const isGenerateDisabled = !validation.isValid;

  // Generate password on first load
  useState(() => {
    handleGenerate();
  });

  return (
    <div className="bg-background rounded-2xl shadow-lg border border-divider p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Generated Password Section */}
      <div className="space-y-4">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-3">
          <div className="flex gap-2">
            <Input
              value={password}
              readOnly
              variant="bordered"
              className="font-mono text-sm"
              classNames={{
                input: "text-center text-sm font-bold tracking-wider",
                inputWrapper: "bg-gray-50 dark:bg-gray-800 border-2 h-12"
              }}
            />
            <CopyButton 
              textToCopy={password} 
              icon={TbCopy}
              variant="flat"
              addTooltip={true}
              tooltipText="Copy password"
            />
          </div>
          <Button
            color="primary"
            onPress={handleGenerate}
            startContent={<TbRefresh className="text-lg" />}
            isDisabled={isGenerateDisabled}
            size="lg"
            className="w-full"
          >
            Generate
          </Button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <Input
            value={password}
            readOnly
            variant="bordered"
            className="font-mono text-lg"
            classNames={{
              input: "text-center text-lg font-bold tracking-wider",
              inputWrapper: "bg-gray-50 dark:bg-gray-800 border-2 h-14"
            }}
          />
          <div className="flex gap-2 ml-4">
            <CopyButton 
              textToCopy={password} 
              icon={TbCopy}
              variant="flat"
              addTooltip={true}
              tooltipText="Copy password"
            />
            <Button
              color="primary"
              onPress={handleGenerate}
              startContent={<TbRefresh className="text-lg" />}
              isDisabled={isGenerateDisabled}
              size="lg"
              className="min-w-unit-20"
            >
              Generate
            </Button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Customize Password Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Customize your password
        </h2>
        
        {/* Password Length */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password length
            </label>
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md min-w-[60px] text-center">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {options.length}
              </span>
            </div>
          </div>
          <Slider
            size="lg"
            step={1}
            minValue={4}
            maxValue={128}
            value={options.length}
            onChange={(value: number | number[]) => {
              const newLength = Array.isArray(value) ? value[0] : value;
              updateOption("length", newLength);
            }}
            className="w-full"
            classNames={{
              track: "bg-gray-200 dark:bg-gray-700",
              filler: "bg-primary",
              thumb: "bg-primary border-4 border-white shadow-lg"
            }}
          />
        </div>

        {/* Character Types */}
        {/* Mobile Layout - Switches in single column */}
        <div className="md:hidden flex flex-col space-y-6">
          <div className="w-full">
            <Switch
              isSelected={options.includeUppercase}
              onValueChange={(value) => updateOption("includeUppercase", value)}
              color="secondary"
              size="md"
              className="w-full"
            >
              <span className="font-medium">Uppercase</span>
            </Switch>
          </div>

          <div className="w-full">
            <Switch
              isSelected={options.includeLowercase}
              onValueChange={(value) => updateOption("includeLowercase", value)}
              color="secondary"
              size="md"
              className="w-full"
            >
              <span className="font-medium">Lowercase</span>
            </Switch>
          </div>

          <div className="w-full">
            <Switch
              isSelected={options.includeNumbers}
              onValueChange={(value) => updateOption("includeNumbers", value)}
              color="secondary"
              size="md"
              className="w-full"
            >
              <span className="font-medium">Numbers</span>
            </Switch>
          </div>

          <div className="w-full space-y-3">
            <Switch
              isSelected={options.includeSymbols}
              onValueChange={(value) => updateOption("includeSymbols", value)}
              color="secondary"
              size="md"
              className="w-full"
            >
              <span className="font-medium">Symbols</span>
            </Switch>
            {options.includeSymbols && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Custom symbols
                </label>
                <Input
                  value={options.customSymbols}
                  onChange={(e) => updateOption("customSymbols", e.target.value)}
                  placeholder="Enter custom symbols"
                  variant="bordered"
                  className="font-mono"
                  classNames={{
                    inputWrapper: "bg-gray-50 dark:bg-gray-800 border h-10"
                  }}
                  size="sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout - Switches in grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          <Switch
            isSelected={options.includeUppercase}
            onValueChange={(value) => updateOption("includeUppercase", value)}
            color="secondary"
            size="lg"
          >
            <span className="font-medium">Uppercase</span>
          </Switch>

          <Switch
            isSelected={options.includeLowercase}
            onValueChange={(value) => updateOption("includeLowercase", value)}
            color="secondary"
            size="lg"
          >
            <span className="font-medium">Lowercase</span>
          </Switch>

          <Switch
            isSelected={options.includeNumbers}
            onValueChange={(value) => updateOption("includeNumbers", value)}
            color="secondary"
            size="lg"
          >
            <span className="font-medium">Numbers</span>
          </Switch>

          <Switch
            isSelected={options.includeSymbols}
            onValueChange={(value) => updateOption("includeSymbols", value)}
            color="secondary"
            size="lg"
          >
            <span className="font-medium">Symbols</span>
          </Switch>
        </div>

        {/* Custom Symbols Input (Desktop) - Outside grid to avoid alignment issues */}
        {options.includeSymbols && (
          <div className="hidden md:block space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom symbols
            </label>
            <Input
              value={options.customSymbols}
              onChange={(e) => updateOption("customSymbols", e.target.value)}
              placeholder="Enter custom symbols"
              variant="bordered"
              className="font-mono"
              classNames={{
                inputWrapper: "bg-gray-50 dark:bg-gray-800 border h-10"
              }}
            />
          </div>
        )}

        {/* Warning */}
        {isGenerateDisabled && (
          <div className="p-4 bg-warning-50 dark:bg-warning-50/10 border border-warning-200 dark:border-warning-800 rounded-lg">
            <p className="text-warning-800 dark:text-warning-200 text-sm">
              {validation.error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
