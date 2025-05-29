 function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-3 shadow bg-white">
      <div className="text-xl font-bold text-blue-600">Inclusive Learn</div>
      <div className="space-x-4">
        <span className="text-gray-600">Hello, Kalkidan</span>
        <img src="/assets/avatar.png" alt="Profile" className="h-8 w-8 rounded-full" />
        
      </div>
    </header>
  );
}

export default Header;
