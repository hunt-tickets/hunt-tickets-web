const HeaderLogin = ({ title }: { title: string }) => {
  return (
    <div className="text-center space-y-6 mb-8">
      {/* Minimalist logo */}
      <div className="flex justify-center">
        <div className="relative">
          <img
            className="h-8 w-auto object-cover opacity-80"
            src="https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_logo.png"
            alt="Hunt Logo"
          />
        </div>
      </div>
      
      {/* Minimalist typography */}
      <div className="space-y-2">
        <h1 className="text-2xl font-light text-white tracking-[-0.02em] leading-none">
          {title}
        </h1>
        <div className="h-px w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto"></div>
      </div>
    </div>
  );
};

export default HeaderLogin;
