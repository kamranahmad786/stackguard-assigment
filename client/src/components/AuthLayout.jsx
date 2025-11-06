export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-white md:grid-cols-2">
      {/* Left Visual Section */}
      <div className="items-center justify-center hidden p-8 bg-gray-100 md:flex">
        <div className="w-10/12 h-[85vh] rounded-2xl bg-gray-300" />
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md p-8 border shadow-sm rounded-2xl">
          {/* Branding */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-purple-600 rounded-full" />
            <span className="text-xl font-semibold">StackGuard</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}

          {/* Form */}
          <div className="mt-6">{children}</div>

          {/* Footer */}
          {footer && <div className="mt-6 text-sm text-gray-600">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
