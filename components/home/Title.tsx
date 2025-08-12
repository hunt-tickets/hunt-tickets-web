const Title = ({ title }: { title: string }) => {
  return (
    <>
      <h2 className="w-full text-heading-1 font-heading-1 text-default-font text-center">
        {title}
      </h2>
    </>
  );
};

export default Title;
