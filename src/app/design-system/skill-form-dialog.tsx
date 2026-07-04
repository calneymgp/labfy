"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export function SkillFormDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" className="rounded-sm">
            <Plus className="h-3.5 w-3.5" />
            Publicar skill
          </Button>
        }
      />
      <DialogContent className="rounded-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Publicar uma skill de IA</DialogTitle>
          <DialogDescription>
            Compartilhe um agente, prompt ou skill com a comunidade Labfy.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="skill-title" className="text-xs">
              Título
            </Label>
            <Input id="skill-title" placeholder="Ex: Revisor de PR automático" className="rounded-sm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="skill-category" className="text-xs">
              Categoria
            </Label>
            <Select>
              <SelectTrigger id="skill-category" className="w-full rounded-sm">
                <SelectValue placeholder="Escolha uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agente">Agente</SelectItem>
                <SelectItem value="prompt">Prompt</SelectItem>
                <SelectItem value="automacao">Automação</SelectItem>
                <SelectItem value="skill">Skill</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="skill-description" className="text-xs">
              Descrição
            </Label>
            <Textarea
              id="skill-description"
              placeholder="O que essa skill faz e como usar..."
              className="rounded-sm"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-sm">
            Cancelar
          </Button>
          <Button variant="default" className="rounded-sm">
            Publicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
