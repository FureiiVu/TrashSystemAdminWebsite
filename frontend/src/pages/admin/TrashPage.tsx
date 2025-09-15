export default function PointsPage() {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Quản lý thùng rác</h2>
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        <li>Theo người dùng</li>
        <li>Theo tổ chức/doanh nghiệp</li>
        <li>Khi nào cộng/trừ điểm</li>
      </ul>
      <div className="mt-4 border rounded-lg bg-white p-4 text-sm text-gray-500">
        (Bảng/biểu đồ điểm sẽ đặt ở đây)
      </div>
    </section>
  );
}
