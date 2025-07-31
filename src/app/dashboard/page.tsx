'use client'

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Role {
  _id: string;
  name: string;
  rank: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role?: Role;
  tasks: { name: string; isCompleted: boolean }[];
}

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'tasks'>('overview');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();

  // Form states
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRoleId, setNewRoleId] = useState("");
  const [taskUserId, setTaskUserId] = useState("");
  const [taskName, setTaskName] = useState("");

  const fetchCurrentUser = useCallback(async () => {
    try {
      setIsLoadingUser(true);
      const res = await fetch("/api/auth");
      const data = await res.json();
      
      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      router.push("/login");
    } finally {
      setIsLoadingUser(false);
    }
  }, [router]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch("/api/get-roles");
      const data = await res.json();
      setRoles(data);
    } catch {
      setError("Failed to fetch roles");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch {
      setError("Failed to fetch users");
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
    fetchRoles();
    fetchUsers();
  }, [fetchCurrentUser, fetchRoles, fetchUsers]);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          roleId: newRoleId,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setError(errorText || "Failed to create user");
        return;
      }

      setSuccess("User created successfully");
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRoleId("");
      fetchUsers();
    } catch (error) {
      setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/delete-user`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        setError("Failed to delete user");
        return;
      }

      setSuccess("User deleted successfully");
      fetchUsers();
    } catch (error) {
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignTask(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/assign-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: taskUserId,
          taskName: taskName,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setError(errorText || "Failed to assign task");
        return;
      }

      setSuccess("Task assigned successfully");
      setTaskUserId("");
      setTaskName("");
      fetchUsers();
    } catch (error) {
      setError("Failed to assign task");
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteTask(userId: string, taskIndex: number) {
    setLoading(true);
    try {
      const res = await fetch("/api/complete-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, taskIndex }),
      });

      if (!res.ok) {
        setError("Failed to complete task");
        return;
      }

      setSuccess("Task completed successfully");
      fetchUsers();
    } catch (error) {
      setError("Failed to complete task");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask(userId: string, taskIndex: number) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/delete-task", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, taskIndex }),
      });

      if (!res.ok) {
        setError("Failed to delete task");
        return;
      }

      setSuccess("Task deleted successfully");
      fetchUsers();
    } catch (error) {
      setError("Failed to delete task");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    }
  }

  const canAssignToUser = (targetUser: User) => {
    if (!currentUser || !currentUser.role) return false;
    if (!targetUser.role) return false;
    return currentUser.role.rank < targetUser.role.rank;
  };

  const canManageUser = (targetUser: User) => {
    if (!currentUser || !currentUser.role) return false;
    if (!targetUser.role) return false;
    return currentUser.role.rank < targetUser.role.rank;
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow Dashboard</h1>
              {currentUser && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">
                        {currentUser.role ? `${currentUser.role.name} (Rank: ${currentUser.role.rank})` : 'No role assigned'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'users', name: 'User Management' },
              { id: 'tasks', name: 'Task Management' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'users' | 'tasks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{users?.length || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {users?.reduce((total, user) => total + (user.tasks?.length || 0), 0) || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {users?.reduce((total, user) => total + (user.tasks?.filter(t => t.isCompleted).length || 0), 0) || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {users && users.slice(0, 5).map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.role?.name || 'No role assigned'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{user.tasks?.length || 0} tasks</p>
                        <p className="text-sm text-gray-500">
                          {user.tasks?.filter(t => t.isCompleted).length || 0} completed
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Create User Form */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Create New User</h3>
              </div>
              <div className="p-6">
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Full Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Email Address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newRoleId}
                    onChange={(e) => setNewRoleId(e.target.value)}
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name} (Rank: {role.rank})
                      </option>
                    ))}
                  </select>
                  <div className="md:col-span-2 lg:col-span-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                    >
                      {loading ? "Creating..." : "Create User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users && users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.role ? `${user.role.name} (Rank: ${user.role.rank})` : 'No role assigned'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.tasks?.length || 0} total, {user.tasks?.filter(t => t.isCompleted).length || 0} completed
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {canManageUser(user) && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Assign Task Form */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Assign New Task</h3>
              </div>
              <div className="p-6">
                <form onSubmit={handleAssignTask} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={taskUserId}
                    onChange={(e) => setTaskUserId(e.target.value)}
                    required
                  >
                    <option value="">Select User</option>
                    {users && users.filter(user => canAssignToUser(user)).map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.role?.name || 'No role'})
                      </option>
                    ))}
                  </select>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Task Name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                  >
                    {loading ? "Assigning..." : "Assign Task"}
                  </button>
                </form>
              </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">All Tasks</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {users && users.map((user) => (
                    <div key={user._id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-lg font-medium text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{user.name}</h4>
                            <p className="text-sm text-gray-500">{user.role ? `${user.role.name} (Rank: ${user.role.rank})` : 'No role assigned'}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {user.tasks?.length || 0} tasks
                        </span>
                      </div>
                      {user.tasks && user.tasks.length > 0 ? (
                        <div className="space-y-3">
                          {user.tasks.map((task, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleCompleteTask(user._id, index)}
                                  disabled={loading}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    task.isCompleted
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-gray-300 hover:border-green-500'
                                  } disabled:opacity-50`}
                                >
                                  {task.isCompleted && (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                                <span className={`text-sm ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                  {task.name}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteTask(user._id, index)}
                                disabled={loading}
                                className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No tasks assigned</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 