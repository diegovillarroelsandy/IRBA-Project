"use client";

import { useCallback, useEffect, useState } from "react";

import { adminApi } from "@/lib/admin-api";

import DataTable from "@/components/common/DataTable/DataTable";
import { DataTableColumn } from "@/components/common/DataTable/types";

import UserDialog from "@/components/user/UserDialog";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Pencil, UserCheck, UserX } from "lucide-react";

import { User, Role } from "@/types/user";

import { usePagination } from "@/hooks/usePagination";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const {
    page,
    setPage,

    pageSize,
    setPageSize,

    total,
    setTotal,

    totalPages,
    setTotalPages,

    resetPage,
  } = usePagination();

  // Dialog

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState<Role>(Role.COLLABORATOR);

  // Confirm

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const resetForm = () => {
    setName("");

    setEmail("");

    setPassword("");

    setRole(Role.COLLABORATOR);

    setEditingUser(null);
  };

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await adminApi.get("/users", {
        params: {
          page,
          limit: pageSize,
          search,
        },
      });

      setUsers(data.data);

      setTotal(data.total);

      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openCreateModal = () => {
    resetForm();

    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);

    setName(user.name);

    setEmail(user.email);

    setRole(user.role);

    setIsModalOpen(true);
  };

  const createUser = async () => {
    try {
      await adminApi.post("/users", {
        name,

        email,

        password,

        role,
      });

      setIsModalOpen(false);

      resetForm();

      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const updateUser = async () => {
    if (!editingUser) return;

    try {
      await adminApi.patch(`/users/${editingUser.id}`, {
        name,
        email,
        role,
      });

      setIsModalOpen(false);

      resetForm();

      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async () => {
    if (!selectedUser) return;

    try {
      await adminApi.patch(`/users/${selectedUser.id}/status`, {
        isActive: !selectedUser.isActive,
      });

      setConfirmOpen(false);

      setSelectedUser(null);

      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const columns: DataTableColumn<User>[] = [
    {
      key: "id",
      header: "ID",
    },

    {
      key: "name",
      header: "Nombre",
    },

    {
      key: "email",
      header: "Correo",
    },

    {
      key: "role",
      header: "Rol",

      render: (user) =>
        user.role === Role.ADMIN ? (
          <Badge>Administrador</Badge>
        ) : (
          <Badge variant="secondary">Colaborador</Badge>
        ),
    },

    {
      key: "isActive",
      header: "Estado",

      render: (user) =>
        user.isActive ? (
          <Badge>Activo</Badge>
        ) : (
          <Badge variant="secondary">Inactivo</Badge>
        ),
    },

    {
      key: "actions",
      header: "Acciones",

      render: (user) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => openEditModal(user)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedUser(user);

              setConfirmOpen(true);
            }}
          >
            {user.isActive ? (
              <UserX className="h-4 w-4" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Administración de Usuarios</h1>

      <DataTable<User>
        data={users}
        columns={columns}
        loading={loading}
        toolbar={{
          search,

          onSearchChange: (value) => {
            setSearch(value);

            resetPage();
          },

          buttonText: "Nuevo Usuario",

          onCreate: openCreateModal,
        }}
        pagination={{
          page,

          totalPages,

          total,

          pageSize,

          onPageChange: setPage,

          onPageSizeChange: (size) => {
            setPageSize(size);

            setPage(1);
          },
        }}
        emptyState={{
          title: "No hay usuarios",

          description: "Crea un usuario para comenzar.",
        }}
      />

      <UserDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        role={role}
        setRole={setRole}
        editingUser={editingUser}
        createUser={createUser}
        updateUser={updateUser}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={
          selectedUser?.isActive ? "Desactivar usuario" : "Activar usuario"
        }
        description={
          selectedUser?.isActive
            ? "El usuario no podrá acceder al sistema."
            : "El usuario podrá acceder nuevamente."
        }
        onConfirm={updateStatus}
        onCancel={() => {
          setConfirmOpen(false);

          setSelectedUser(null);
        }}
      />
    </main>
  );
}
