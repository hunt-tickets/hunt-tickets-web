const Subtitle = ({ title }: { title: string }) => {
  return (
    <>
      <h2 className="text-heading-2 font-heading-2 text-default-font">
        {title}
      </h2>
    </>
  );
};

export default Subtitle;
