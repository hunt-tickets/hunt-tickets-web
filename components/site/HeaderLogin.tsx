const HeaderLogin = ({ title }: { title: string }) => {
  return (
    <>
      <div className="flex justify-center">
        <img
          className="h-8 flex-none object-cover"
          src="https://res.cloudinary.com/subframe/image/upload/v1733715348/uploads/4760/wb4hppqfhbr28yhtfejo.png"
        />
      </div>
      <div className="h-10" />
      <div className="flex justify-center">
        <h2 className="text-heading-2 font-heading-2 text-default-font">
          {title}
        </h2>
      </div>
    </>
  );
};

export default HeaderLogin;
