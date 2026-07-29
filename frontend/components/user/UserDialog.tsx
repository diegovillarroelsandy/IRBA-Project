"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Role, User } from "@/types/user";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  name: string;
  setName: (value: string) => void;

  email: string;
  setEmail: (value: string) => void;

  password: string;
  setPassword: (value: string) => void;

  role: Role;
  setRole: (value: Role) => void;

  editingUser: User | null;

  createUser: () => void;
  updateUser: () => void;
}

export default function UserDialog({
  open,
  onOpenChange,

  name,
  setName,

  email,
  setEmail,

  password,
  setPassword,

  role,
  setRole,

  editingUser,

  createUser,
  updateUser,
}: UserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <label className="text-sm font-medium">Nombre</label>

          <Input
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="text-sm font-medium">Correo</label>

          <Input
            type="email"
            placeholder="correo@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {!editingUser && (
            <>
              <label className="text-sm font-medium">Contraseña</label>

              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}

          <label className="text-sm font-medium">Rol</label>

          <Select
            value={role}
            onValueChange={(value) => setRole(value as Role)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {role === Role.ADMIN ? "Administrador" : "Colaborador"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={Role.ADMIN}>Administrador</SelectItem>

              <SelectItem value={Role.COLLABORATOR}>Colaborador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button onClick={() => (editingUser ? updateUser() : createUser())}>
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
