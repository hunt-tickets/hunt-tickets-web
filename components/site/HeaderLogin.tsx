const HeaderLogin = ({ title }: { title: string }) => {
  return (
    <div className="text-center space-y-4 mb-10">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <img
            className="h-12 w-12 object-contain opacity-90"
            src="https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_logo.png"
            alt="Hunt Logo"
          />
        </div>
      </div>
      
      {/* Title */}
      <h1 className="text-2xl font-medium text-white tracking-[-0.01em]">
        {title}
      </h1>
    </div>
  );
};

export default HeaderLogin;
