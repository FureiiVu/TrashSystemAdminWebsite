import { useMemo, useState, useEffect } from "react";

// UI-ONLY (no backend) — TailwindCSS, không phụ thuộc shadcn/ui hay thư viện nào khác
// - CRUD chạy trên state bộ nhớ tạm
// - Có tìm kiếm, sắp xếp, phân trang, bật/tắt trạng thái
// - Có modal thuần Tailwind
// - Không dùng localStorage (nếu muốn bật, xem dòng NOTE bên dưới)

export type Reward = {
  id: string;
  name: string;
  points: number; // điểm cần để đổi
  stock: number; // tồn kho
  status: "active" | "inactive";
  createdAt: string; // ISO
};

const makeId = () => Math.random().toString(36).slice(2, 9);

const SEED: Reward[] = [
  { id: makeId(), name: "Voucher Grab 20k", points: 200, stock: 45, status: "active", createdAt: new Date().toISOString() },
  { id: makeId(), name: "Thẻ cào 50k", points: 450, stock: 30, status: "active", createdAt: new Date().toISOString() },
  { id: makeId(), name: "Ly giữ nhiệt", points: 700, stock: 12, status: "inactive", createdAt: new Date().toISOString() },
  { id: makeId(), name: "Áo thun thương hiệu", points: 1200, stock: 6, status: "active", createdAt: new Date().toISOString() },
];

export default function RewardsPage() {
  const [rows, setRows] = useState<Reward[]>(SEED);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "points" | "stock">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // NOTE: nếu muốn lưu tạm xuống localStorage, bỏ comment 2 hook dưới
  // useEffect(() => { const raw = localStorage.getItem("rewards_mock_v1"); if (raw) setRows(JSON.parse(raw)); }, []);
  // useEffect(() => { localStorage.setItem("rewards_mock_v1", JSON.stringify(rows)); }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = rows.filter((r) =>
      [r.name, r.points.toString(), r.stock.toString(), r.status].some((v) => v.toString().toLowerCase().includes(q))
    );
    const dir = sortDir === "asc" ? 1 : -1;
    data.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "points":
          return (a.points - b.points) * dir;
        case "stock":
          return (a.stock - b.stock) * dir;
        default:
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
      }
    });
    return data;
  }, [rows, query, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const reset = () => {
    setQuery("");
    setSortBy("createdAt");
    setSortDir("desc");
    setPage(1);
  };

  // CRUD (UI-only)
  const upsert = (payload: Partial<Reward> & { name: string; points: number; stock: number; status: Reward["status"] }) => {
    setRows((prev) => {
      if (payload.id) {
        return prev.map((r) => (r.id === payload.id ? { ...r, ...payload } as Reward : r));
      }
      const next: Reward = {
        id: makeId(),
        name: payload.name,
        points: payload.points,
        stock: payload.stock,
        status: payload.status,
        createdAt: new Date().toISOString(),
      };
      return [next, ...prev];
    });
  };

  const removeOne = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));
  const toggleStatus = (id: string) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "active" ? "inactive" : "active" }
          : r
      )
    );

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#3333cc] flex items-center gap-2">
            <span className="inline-block">🎁</span> Quản lý quà tặng
          </h2>
        </div>
        <RewardModal triggerLabel="Thêm quà tặng" onSubmit={(val) => { upsert(val); }} />
      </header>

      {/* Controls */}
      <div className="grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Tìm kiếm</label>
          <div className="relative mt-1">
            <input
              className="w-full rounded-lg border px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Tên quà, điểm, trạng thái..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600">Sắp xếp theo</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as any); setPage(1); }}
          >
            <option value="createdAt">Ngày tạo</option>
            <option value="name">Tên</option>
            <option value="points">Điểm</option>
            <option value="stock">Tồn kho</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Chiều</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={sortDir}
            onChange={(e) => { setSortDir(e.target.value as any); setPage(1); }}
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Tổng quà" value={rows.length} />
        <SummaryCard title="Đang hoạt động" value={rows.filter((r) => r.status === "active").length} />
        <SummaryCard title="Sắp hết hàng (<10)" value={rows.filter((r) => r.stock < 10).length} />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-500">Danh sách quà tặng</div>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50">Reset</button>
            <select
              className="text-sm rounded-lg border px-2 py-1.5"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
              {[5, 8, 10, 20].map((n) => <option key={n} value={n}>{n}/trang</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left w-16">#</th>
                <th className="px-4 py-2 text-left">Tên</th>
                <th className="px-4 py-2 text-right">Điểm</th>
                <th className="px-4 py-2 text-right">Tồn kho</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
                <th className="px-4 py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, idx) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="px-4 py-2 font-medium">{r.name}</td>
                  <td className="px-4 py-2 text-right">{r.points.toLocaleString()} điểm</td>
                  <td className="px-4 py-2 text-right">{r.stock}</td>
                  <td className="px-4 py-2">
                    {r.status === "active" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5">● Hoạt động</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 text-gray-700 px-2 py-0.5">● Tạm ẩn</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(r.id)}
                        className="rounded-lg border px-3 py-1 hover:bg-gray-50"
                      >{r.status === "active" ? "Tạm ẩn" : "Kích hoạt"}</button>
                      <RewardModal
                        triggerClass="rounded-lg border px-3 py-1 hover:bg-gray-50"
                        triggerLabel="Sửa"
                        initial={r}
                        onSubmit={(val) => upsert({ ...val, id: r.id })}
                      />
                      <button
                        onClick={() => { if (confirm(`Xoá quà tặng \"${r.name}\"?`)) removeOne(r.id); }}
                        className="rounded-lg border px-3 py-1 text-red-600 hover:bg-red-50"
                      >Xoá</button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Không có dữ liệu.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="text-sm text-gray-500">Trang {page}/{totalPages} • Tổng {filtered.length}</div>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border px-3 py-1.5 disabled:opacity-50">Trước</button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-lg border px-3 py-1.5 disabled:opacity-50">Sau</button>
          </div>
        </div>
      </div>

      {/* Lịch sử đổi thưởng (placeholder) */}
      <div className="rounded-xl border bg-white p-4">
        <div className="font-medium mb-1">Lịch sử đổi thưởng</div>
        <p className="text-sm text-gray-500">UI demo — sẽ kết nối API sau, có lọc theo user/trạng thái và export CSV.</p>
      </div>
    </section>
  );
}

function SummaryCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

// ---------------- Modal thuần Tailwind ----------------
function RewardModal({
  triggerLabel = "Thêm",
  triggerClass = "rounded-lg bg-indigo-600 text-white px-3 py-2 hover:bg-indigo-700",
  initial,
  onSubmit,
}: {
  triggerLabel?: string;
  triggerClass?: string;
  initial?: Reward;
  onSubmit: (val: { name: string; points: number; stock: number; status: Reward["status"] }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [points, setPoints] = useState<number>(initial?.points ?? 200);
  const [stock, setStock] = useState<number>(initial?.stock ?? 10);
  const [status, setStatus] = useState<Reward["status"]>(initial?.status ?? "active");

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setPoints(initial?.points ?? 200);
    setStock(initial?.stock ?? 10);
    setStatus(initial?.status ?? "active");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial?.id]);

  const valid = name.trim().length >= 3 && points > 0 && stock >= 0;

  return (
    <>
      <button onClick={() => setOpen(true)} className={triggerClass}>{triggerLabel}</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
            <div className="text-lg font-semibold mb-1">{initial ? "Chỉnh sửa quà tặng" : "Thêm quà tặng"}</div>
            <p className="text-sm text-gray-500 mb-4">Nhập thông tin quà tặng. Các trường * là bắt buộc.</p>

            <div className="grid gap-3">
              <div>
                <label className="text-sm text-gray-600">Tên quà tặng *</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Voucher Grab 20k"
                />
                {name.trim().length > 0 && name.trim().length < 3 && (
                  <p className="text-xs text-red-600 mt-1">Tên tối thiểu 3 ký tự</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Điểm cần *</label>
                  <input
                    type="number"
                    min={1}
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Tồn kho *</label>
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Trạng thái</label>
                  <select
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Reward["status"]) }
                  >
                    <option value="active">Đang bán</option>
                    <option value="inactive">Tạm ẩn</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-gray-500 -mt-1">Gợi ý tương đương giá trị: ~ {(points * 1000).toLocaleString()}đ</p>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">Hủy</button>
              <button
                disabled={!valid}
                onClick={() => { onSubmit({ name: name.trim(), points, stock, status }); setOpen(false); }}
                className="rounded-lg bg-indigo-600 text-white px-3 py-1.5 enabled:hover:bg-indigo-700 disabled:opacity-50"
              >{initial ? "Lưu" : "Thêm mới"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}