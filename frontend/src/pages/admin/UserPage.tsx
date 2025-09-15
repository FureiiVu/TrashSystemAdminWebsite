import { useState, useMemo } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  group?: string;
  points: number;
  status: "active" | "inactive";
};

const makeId = () => Math.random().toString(36).slice(2, 9);

const SEED: User[] = [
  { id: makeId(), name: "Nguyễn Văn A", email: "a@example.com", group: "Cá nhân", points: 120, status: "active" },
  { id: makeId(), name: "Trần Thị B", email: "b@company.vn", group: "Doanh nghiệp", points: 560, status: "active" },
  { id: makeId(), name: "Lê Văn C", email: "c@example.com", group: "Cá nhân", points: 0, status: "inactive" },
];

export default function UsersPage() {
  const [rows, setRows] = useState<User[]>(SEED);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((u) =>
      [u.name, u.email, u.group ?? "", u.points.toString(), u.status].some((v) =>
        v.toLowerCase().includes(q)
      )
    );
  }, [rows, query]);

  const toggleStatus = (id: string) =>
    setRows((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)));

  const adjustPoints = (id: string, delta: number) =>
    setRows((prev) => prev.map((u) => (u.id === id ? { ...u, points: Math.max(0, u.points + delta) } : u)));

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-[#3333cc]">Quản lý người dùng</h2>
        <p className="text-sm text-gray-500 mt-1">Thông tin, nhóm và điểm tích luỹ.</p>
      </header>

      {/* Search */}
      <div>
        <input
          className="w-full md:w-1/3 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Tìm kiếm tên, email, nhóm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Tên</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Nhóm</th>
              <th className="px-4 py-2 text-right">Điểm</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.group ?? "-"}</td>
                <td className="px-4 py-2 text-right">{u.points}</td>
                <td className="px-4 py-2">
                  {u.status === "active" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5">● Hoạt động</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 text-gray-700 px-2 py-0.5">● Tạm ẩn</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => adjustPoints(u.id, 50)}
                    className="rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
                  >+50đ</button>
                  <button
                    onClick={() => adjustPoints(u.id, -50)}
                    className="rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
                  >-50đ</button>
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className="rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
                  >{u.status === "active" ? "Ẩn" : "Kích hoạt"}</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Không có dữ liệu.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
