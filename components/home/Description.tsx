const Description = ({ text }: { text: string }) => {
  return (
    <>
      <p className="text-body font-body text-default-font whitespace-pre-wrap text-justify">{text}</p>
    </>
  );
};

export default Description;