"use client"

import { useState } from "react"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

const models = [
  { value: "llama3-70b-8192", label: "Llama 3 70B" },
  { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B" }
]

interface ChatSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  model: string
  onModelChange: (model: string) => void
  temperature: number
  onTemperatureChange: (temperature: number) => void
  maxTokens: number
  onMaxTokensChange: (maxTokens: number) => void
}

export function ChatSettings({
  open,
  onOpenChange,
  model,
  onModelChange,
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
}: ChatSettingsProps) {
  const [modelOpen, setModelOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cài đặt trò chuyện</SheetTitle>
          <SheetDescription>Cấu hình mô hình và tham số cho cuộc trò chuyện của bạn.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="model">Mô hình</Label>
            <Popover open={modelOpen} onOpenChange={setModelOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={modelOpen} className="w-full justify-between">
                  {model ? models.find((m) => m.value === model)?.label : "Chọn mô hình..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                {models.map((modelOption) => (
                  <Button
                    key={modelOption.value}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      onModelChange(modelOption.value)
                      setModelOpen(false)
                    }}
                  >
                    {modelOption.label}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
          {/* Add temperature and max tokens controls here */}
        </div>
      </SheetContent>
    </Sheet>
  )
}
